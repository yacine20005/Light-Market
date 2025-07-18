import sqlite3
import json
import os

class ManifestDecoder:
    """Décode les données de Destiny 2 depuis le manifeste local.
    """

    def __init__(self):
        current_dir = os.path.dirname(__file__)
        self.db_path = os.path.join(current_dir, "manifest", "manifest.sqlite")

    def connect_db(self):
        """Se connecte à la base de données."""
        if not os.path.exists(self.db_path):
            raise FileNotFoundError(f"Base de données introuvable: {self.db_path}")
        return sqlite3.connect(self.db_path)

    def get_definition(self, table_name, hash_id):
        """
        Récupère une définition depuis le manifeste.
        """
        try:
            conn = self.connect_db()
            cursor = conn.cursor()

            if isinstance(hash_id, str):
                hash_id = int(hash_id)

            # Convertir pour la base de données SQLite
            if hash_id > 2147483647:
                hash_id = hash_id - 4294967296

            cursor.execute(f"SELECT json FROM {table_name} WHERE id = ?", (hash_id,))
            result = cursor.fetchone()
            conn.close()

            if result:
                return json.loads(result[0])
            return None

        # En cas d'erreur de connexion, de décodage JSON ou de conversion de type
        except (sqlite3.Error, json.JSONDecodeError, ValueError) as e:
            print(f"Erreur: {e}")
            return None

    def get_item_definition(self, item_hash):
        """Récupère la définition d'un item."""
        return self.get_definition("DestinyInventoryItemDefinition", item_hash)

    def get_extended_item_definition(self, item_hash):
        """
        Récupère une définition d'item étendue avec plus de détails.
        Utile pour les items spéciaux comme les catégories de vendor.
        """
        item_def = self.get_item_definition(item_hash)
        if not item_def:
            return None
            
        # Ajouter des informations supplémentaires si l'item est une catégorie
        if item_def.get('itemType') == 19:  # Type 19 = Vendor Category
            # Chercher les vendor groups associés
            vendor_hash = item_def.get('vendorHash')
            if vendor_hash:
                vendor_def = self.get_vendor_definition(vendor_hash)
                if vendor_def:
                    item_def['associatedVendor'] = vendor_def
                    
        # Ajouter les informations de socket si disponibles
        if 'sockets' in item_def:
            socket_entries = item_def['sockets'].get('socketEntries', [])
            for socket in socket_entries:
                plug_hash = socket.get('singleInitialItemHash')
                if plug_hash:
                    plug_def = self.get_definition("DestinyInventoryItemDefinition", plug_hash)
                    if plug_def:
                        socket['plugDefinition'] = plug_def
                        
        return item_def

    def get_vendor_definition(self, vendor_hash):
        """Récupère la définition d'un vendor."""
        return self.get_definition("DestinyVendorDefinition", vendor_hash)

    def decode_vendor_data(self, vendor_data):
        """
        Décode les données de vendor en ajoutant les noms lisibles.
        """
        if not vendor_data or 'Response' not in vendor_data:
            return vendor_data

        response = vendor_data['Response']
        
        if 'vendors' in response and 'data' in response['vendors']:
            vendors = response['vendors']['data']
            
            for vendor_hash, vendor_info in vendors.items():
                vendor_def = self.get_vendor_definition(int(vendor_hash))
                
                if vendor_def and 'displayProperties' in vendor_def:
                    vendor_info['name'] = vendor_def['displayProperties'].get('name', 'Vendor inconnu')
                    vendor_info['description'] = vendor_def['displayProperties'].get('description', '')

        if 'sales' in response and 'data' in response['sales']:
            sales = response['sales']['data']
            
            for vendor_hash, vendor_sales in sales.items():
                if 'saleItems' in vendor_sales:
                    for sale_item in vendor_sales['saleItems'].values():
                        item_hash = sale_item.get('itemHash')
                        
                        if item_hash:
                            item_def = self.get_item_definition(item_hash)
                            
                            if item_def and 'displayProperties' in item_def:
                                sale_item['itemName'] = item_def['displayProperties'].get('name', 'Item inconnu')
                                sale_item['itemDescription'] = item_def['displayProperties'].get('description', '')
                                sale_item['itemIcon'] = item_def['displayProperties'].get('icon', '')
                                
                                tier_type = item_def.get('inventory', {}).get('tierType', 0)
                                sale_item['rarity'] = self.get_rarity_name(tier_type)

        return vendor_data

    def get_rarity_name(self, tier_type):
        """Convertit le type de tier en nom de rareté."""
        rarities = {
            0: "Inconnu",
            1: "Monnaie", 
            2: "Basique",
            3: "Commun",
            4: "Rare",
            5: "Légendaire",
            6: "Exotique"
        }
        return rarities.get(tier_type, "Inconnu")

    def get_all_vendors(self):
        """
        Récupère tous les vendeurs depuis le manifeste.
        """
        try:
            conn = self.connect_db()
            cursor = conn.cursor()
            
            cursor.execute("SELECT id, json FROM DestinyVendorDefinition")
            results = cursor.fetchall()
            conn.close()
            
            vendors = {}
            for vendor_id, vendor_json in results:
                try:
                    vendor_data = json.loads(vendor_json)
                    
                    # Filtrer les vendeurs qui ont des propriétés d'affichage
                    if 'displayProperties' in vendor_data and vendor_data['displayProperties'].get('name'):
                        # Convertir l'ID négatif en hash positif pour la cohérence
                        hash_id = str(vendor_id + 4294967296 if vendor_id < 0 else vendor_id)
                        
                        vendors[hash_id] = {
                            'vendorHash': hash_id,
                            'name': vendor_data['displayProperties'].get('name', 'Vendeur inconnu'),
                            'description': vendor_data['displayProperties'].get('description', ''),
                            'subtitle': vendor_data['displayProperties'].get('subtitle', ''),
                            'icon': vendor_data['displayProperties'].get('icon', ''),
                            'smallTransparentIcon': vendor_data['displayProperties'].get('smallTransparentIcon', ''),
                            'mapIcon': vendor_data['displayProperties'].get('mapIcon', ''),
                            'enabled': vendor_data.get('enabled', True),
                            'visible': vendor_data.get('visible', True),
                            'consolidateCategories': vendor_data.get('consolidateCategories', False),
                            'unlockRanges': vendor_data.get('unlockRanges', []),
                            'vendorIdentifier': vendor_data.get('vendorIdentifier', ''),
                            'vendorPortrait': vendor_data.get('vendorPortrait', ''),
                            'vendorBanner': vendor_data.get('vendorBanner', '')
                        }
                        
                        # Ajouter les informations de localisation si disponibles
                        if 'locations' in vendor_data:
                            vendors[hash_id]['locations'] = vendor_data['locations']
                            
                except json.JSONDecodeError:
                    continue
                    
            return vendors
            
        except sqlite3.Error as e:
            print(f"Erreur de base de données lors de la récupération des vendeurs: {e}")
            return {}

manifest_decoder = ManifestDecoder()
