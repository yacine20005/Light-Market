import sqlite3
import json
import os

class ManifestDecoder:
    """Decodes Destiny 2 data from the local manifest.
    """

    def __init__(self):
        current_dir = os.path.dirname(__file__)
        self.db_path = os.path.join(current_dir, "manifest", "manifest.sqlite")

    def connect_db(self):
        """
        Connects to the database.
        """
        if not os.path.exists(self.db_path):
            raise FileNotFoundError(f"Database not found: {self.db_path}")
        return sqlite3.connect(self.db_path)

    def get_definition(self, table_name, hash_id):
        """
        Retrieves a definition from the manifest.
        """
        try:
            conn = self.connect_db()
            cursor = conn.cursor()

            if isinstance(hash_id, str):
                hash_id = int(hash_id)

            # Convert hash_id for SQLite database which contains
            # negative IDs for values greater than 2^31-1
            if hash_id > 2147483647:
                hash_id = hash_id - 4294967296

            cursor.execute(f"SELECT json FROM {table_name} WHERE id = ?", (hash_id,))
            result = cursor.fetchone()
            conn.close()

            if result:
                return json.loads(result[0])
            return None

        except (sqlite3.Error, json.JSONDecodeError, ValueError) as e:
            print(f"Error: {e}")
            return None

    def get_item_definition(self, item_hash):
        """Retrieves an item definition."""
        return self.get_definition("DestinyInventoryItemDefinition", item_hash)

    def decode_vendor_data(self, vendor_data):
        """
        Decodes vendor data by adding readable names.
        """
        if not vendor_data or 'Response' not in vendor_data:
            return vendor_data

        response = vendor_data['Response']

        if 'vendors' in response and 'data' in response['vendors']:
            vendors = response['vendors']['data']

            for vendor_hash, vendor_info in vendors.items():
                vendor_def = self.get_definition("DestinyVendorDefinition", int(vendor_hash))

                if vendor_def and 'displayProperties' in vendor_def:
                    vendor_info['name'] = vendor_def['displayProperties'].get('name', 'Unknown vendor')
                    vendor_info['description'] = vendor_def['displayProperties'].get('description', '')

        if 'sales' in response and 'data' in response['sales']:
            sales = response['sales']['data']

            for vendor_hash, vendor_sales in sales.items():
                if 'saleItems' in vendor_sales:
                    # Créer une nouvelle liste filtrée des éléments de vente
                    filtered_sale_items = {}
                    seen_items = {}  # Pour éviter les doublons
                    
                    for sale_key, sale_item in vendor_sales['saleItems'].items():
                        item_hash = sale_item.get('itemHash')

                        if item_hash:
                            item_def = self.get_item_definition(item_hash)

                            if item_def and 'displayProperties' in item_def:
                                item_name = item_def['displayProperties'].get('name', 'Unknown item')
                                
                                # Filtrer les liens de navigation inutiles
                                if self.is_navigation_link(item_name):
                                    continue  # Ignorer cet élément
                                
                                # Vérifier les doublons par nom d'objet
                                if item_name in seen_items:
                                    continue  # Ignorer les doublons
                                
                                # Marquer cet élément comme vu
                                seen_items[item_name] = True
                                
                                sale_item['itemName'] = item_name
                                sale_item['itemDescription'] = item_def['displayProperties'].get('description', '')
                                sale_item['itemIcon'] = item_def['displayProperties'].get('icon', '')

                                tier_type = item_def.get('inventory', {}).get('tierType', 0)
                                sale_item['rarity'] = self.get_rarity_name(tier_type)
                                
                                # Ajouter les informations de classe
                                class_type = item_def.get('classType', 3)
                                sale_item['classType'] = class_type
                                sale_item['supportedClasses'] = self.get_supported_classes(item_def)
                                
                                # Ajouter l'élément filtré
                                filtered_sale_items[sale_key] = sale_item
                    
                    # Remplacer les éléments de vente par la version filtrée
                    vendor_sales['saleItems'] = filtered_sale_items

        return vendor_data

    def get_rarity_name(self, tier_type):
        """Converts tier type to rarity name."""
        rarities = {
            0: "Unknown",
            1: "Currency",
            2: "Common",
            3: "Uncommon",
            4: "Rare",
            5: "Legendary",
            6: "Exotic"
        }
        return rarities.get(tier_type, "Unknown")

    def get_class_name(self, class_type):
        """Converts class type to class name."""
        classes = {
            0: "Titan",
            1: "Hunter", 
            2: "Warlock",
            3: "All Classes"  # Pour les objets disponibles pour toutes les classes
        }
        return classes.get(class_type, "Unknown")
    
    def get_supported_classes(self, item_def):
        """
        Détermine les classes supportées par un objet.
        Retourne une liste des classes qui peuvent utiliser cet objet.
        """
        if not item_def:
            return []
            
        class_type = item_def.get('classType', 3)
        
        # Si classType est 3, l'objet est disponible pour toutes les classes
        if class_type == 3:
            return ["Titan", "Hunter", "Warlock"]
        
        # Sinon, retourner la classe spécifique
        class_name = self.get_class_name(class_type)
        return [class_name] if class_name != "Unknown" else []

    def is_navigation_link(self, item_name):
        """
        Détermine si un élément est un lien de navigation inutile dans le menu de Xur.
        """
        if not item_name:
            return False
            
        name_lower = item_name.lower()
        navigation_links = [
            "more strange offers",
            "strange gear offers", 
            "more strange gear",
            "strange offers"
        ]
        
        return any(link in name_lower for link in navigation_links)

manifest_decoder = ManifestDecoder()
