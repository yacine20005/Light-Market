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

    def get_stat_definition(self, stat_hash):
        """Retrieves a stat definition."""
        return self.get_definition("DestinyStatDefinition", stat_hash)

    def get_socket_type_definition(self, socket_type_hash):
        """Retrieves a socket type definition."""
        return self.get_definition("DestinySocketTypeDefinition", socket_type_hash)

    def get_plug_definition(self, plug_hash):
        """Retrieves a plug definition (for perks, mods, etc.)."""
        return self.get_definition("DestinyInventoryItemDefinition", plug_hash)

    def get_damage_type_definition(self, damage_type_hash):
        """Retrieves a damage type definition."""
        return self.get_definition("DestinyDamageTypeDefinition", damage_type_hash)

    def get_item_detailed_info(self, item_hash, item_instance_data=None, sockets_data=None, stats_data=None):
        """
        Récupère toutes les informations détaillées d'un objet.
        
        Args:
            item_hash: Hash de l'objet
            item_instance_data: Données d'instance de l'objet (optionnel)
            sockets_data: Données des sockets (optionnel)
            stats_data: Données des stats (optionnel)
            
        Returns:
            Dict avec toutes les informations détaillées de l'objet
        """
        item_def = self.get_item_definition(item_hash)
        if not item_def:
            return None

        detailed_info = {
            'hash': item_hash,
            'displayProperties': item_def.get('displayProperties', {}),
            'itemType': item_def.get('itemType'),
            'itemSubType': item_def.get('itemSubType'),
            'classType': item_def.get('classType'),
            'rarity': self.get_rarity_name(item_def.get('inventory', {}).get('tierType', 0)),
            'supportedClasses': self.get_supported_classes(item_def),
            'flavorText': item_def.get('flavorText', ''),
            'stats': {},
            'sockets': [],
            'perks': [],
            'mods': [],
            'damageType': None,
            'ammoType': item_def.get('equippingBlock', {}).get('ammoType', 0),
            'powerLevel': None,
            'investmentStats': []
        }

        # Informations sur le type de dégâts
        damage_type_hash = item_def.get('defaultDamageTypeHash')
        if damage_type_hash:
            damage_type_def = self.get_damage_type_definition(damage_type_hash)
            if damage_type_def:
                detailed_info['damageType'] = {
                    'hash': damage_type_hash,
                    'name': damage_type_def.get('displayProperties', {}).get('name', ''),
                    'icon': damage_type_def.get('displayProperties', {}).get('icon', ''),
                    'color': damage_type_def.get('color', {})
                }

        # Stats de base de l'objet (définition)
        if 'stats' in item_def and 'stats' in item_def['stats']:
            for stat_hash, stat_value in item_def['stats']['stats'].items():
                stat_def = self.get_stat_definition(int(stat_hash))
                if stat_def:
                    detailed_info['stats'][stat_hash] = {
                        'hash': stat_hash,
                        'name': stat_def.get('displayProperties', {}).get('name', ''),
                        'description': stat_def.get('displayProperties', {}).get('description', ''),
                        'icon': stat_def.get('displayProperties', {}).get('icon', ''),
                        'value': stat_value.get('value', 0),
                        'maximum': stat_value.get('maximum', 100)
                    }

        # Stats d'investissement (pour le niveau de puissance notamment)
        if 'investmentStats' in item_def:
            for stat in item_def['investmentStats']:
                stat_def = self.get_stat_definition(stat.get('statTypeHash'))
                if stat_def:
                    detailed_info['investmentStats'].append({
                        'hash': stat.get('statTypeHash'),
                        'name': stat_def.get('displayProperties', {}).get('name', ''),
                        'value': stat.get('value', 0)
                    })

        # Récupérer tous les sockets si des sockets d'instance sont fournis
        if sockets_data and 'sockets' in sockets_data:
            sockets_list = sockets_data['sockets']
            for socket in sockets_list:
                if 'plugHash' in socket:
                    plug_hash = socket['plugHash']
                    plug_def = self.get_plug_definition(plug_hash)
                    if plug_def:
                        plug_name = plug_def.get('displayProperties', {}).get('name', '')
                        if plug_name:  # Ne pas traiter les plugs sans nom
                            plug_info = {
                                'hash': plug_hash,
                                'name': plug_name,
                                'description': plug_def.get('displayProperties', {}).get('description', ''),
                                'icon': plug_def.get('displayProperties', {}).get('icon', ''),
                                'isEquipped': socket.get('isEnabled', False),
                                'isExotic': plug_def.get('inventory', {}).get('tierType', 0) == 6,
                                'itemType': plug_def.get('itemType', 0),
                                'itemSubType': plug_def.get('itemSubType', 0)
                            }
                            detailed_info['sockets'].append(plug_info)
                            detailed_info['perks'].append(plug_info)

        # Si pas de socket data mais que l'objet a des sockets dans sa définition, les récupérer
        if not sockets_data and 'sockets' in item_def:
            sockets_def = item_def.get('sockets')
            if sockets_def:
                socket_entries = sockets_def.get('socketEntries', [])
                for socket_entry in socket_entries:
                    # Récupérer le plug par défaut
                    default_plug_hash = socket_entry.get('singleInitialItemHash')
                    if default_plug_hash:
                        plug_def = self.get_plug_definition(default_plug_hash)
                        if plug_def:
                            plug_name = plug_def.get('displayProperties', {}).get('name', '')
                            if plug_name:  # Ne pas traiter les plugs sans nom
                                plug_info = {
                                    'hash': default_plug_hash,
                                    'name': plug_name,
                                    'description': plug_def.get('displayProperties', {}).get('description', ''),
                                    'icon': plug_def.get('displayProperties', {}).get('icon', ''),
                                    'isEquipped': True,
                                    'isExotic': plug_def.get('inventory', {}).get('tierType', 0) == 6,
                                    'itemType': plug_def.get('itemType', 0),
                                    'itemSubType': plug_def.get('itemSubType', 0),
                                    'isDefault': True
                                }
                                detailed_info['sockets'].append(plug_info)
                                detailed_info['perks'].append(plug_info)

        # Récupérer les stats d'instance si disponibles
        if stats_data and 'stats' in stats_data:
            for stat_hash, stat_value in stats_data['stats'].items():
                stat_def = self.get_stat_definition(int(stat_hash))
                if stat_def:
                    detailed_info['stats'][stat_hash] = {
                        'hash': stat_hash,
                        'name': stat_def.get('displayProperties', {}).get('name', ''),
                        'description': stat_def.get('displayProperties', {}).get('description', ''),
                        'icon': stat_def.get('displayProperties', {}).get('icon', ''),
                        'value': stat_value.get('value', 0)
                    }

        # Récupérer le niveau de puissance si disponible
        if item_instance_data and 'primaryStat' in item_instance_data:
            detailed_info['powerLevel'] = item_instance_data['primaryStat'].get('value', 0)

        # Récupérer la perk exotique (généralement la dernière perk importante)
        if detailed_info['rarity'] == 'Exotic':
            exotic_perks = [perk for perk in detailed_info['perks'] if perk.get('isExotic', False)]
            if exotic_perks:
                # Garder seulement la dernière perk exotique (la plus importante)
                detailed_info['perks'] = [exotic_perks[-1]]
            else:
                detailed_info['perks'] = []
        else:
            # Pour les objets non-exotiques, garder toutes les perks importantes
            detailed_info['perks'] = [perk for perk in detailed_info['perks'] if perk.get('isExotic', False) or 'exotic' in perk.get('name', '').lower()]

        return detailed_info

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
                                
                                # Récupérer les informations détaillées de l'objet
                                item_instance_data = None
                                sockets_data = None
                                stats_data = None
                                
                                # Récupérer les données d'instance si disponibles
                                if 'itemInstances' in response and 'data' in response['itemInstances']:
                                    item_instances = response['itemInstances']['data']
                                    instance_key = f"{sale_item.get('vendorItemIndex', 0)}"
                                    if instance_key in item_instances:
                                        item_instance_data = item_instances[instance_key]
                                
                                # Récupérer les données de sockets si disponibles
                                if 'itemSockets' in response and 'data' in response['itemSockets']:
                                    item_sockets = response['itemSockets']['data']
                                    instance_key = f"{sale_item.get('vendorItemIndex', 0)}"
                                    if instance_key in item_sockets:
                                        sockets_data = item_sockets[instance_key]
                                
                                # Récupérer les données de stats si disponibles
                                if 'itemStats' in response and 'data' in response['itemStats']:
                                    item_stats = response['itemStats']['data']
                                    instance_key = f"{sale_item.get('vendorItemIndex', 0)}"
                                    if instance_key in item_stats:
                                        stats_data = item_stats[instance_key]
                                
                                # Obtenir les informations détaillées
                                detailed_info = self.get_item_detailed_info(
                                    item_hash, 
                                    item_instance_data, 
                                    sockets_data, 
                                    stats_data
                                )
                                
                                if detailed_info:
                                    # Copier seulement les informations simplifiées dans l'objet de vente
                                    sale_item.update({
                                        'itemName': detailed_info['displayProperties'].get('name', item_name),
                                        'itemDescription': detailed_info['displayProperties'].get('description', ''),
                                        'itemIcon': detailed_info['displayProperties'].get('icon', ''),
                                        'rarity': detailed_info['rarity'],
                                        'classType': detailed_info['classType'],
                                        'supportedClasses': detailed_info['supportedClasses'],
                                        'flavorText': detailed_info['flavorText'],
                                        'perks': detailed_info['perks']  # Seulement les perks
                                    })
                                else:
                                    # Fallback aux informations de base
                                    sale_item.update({
                                        'itemName': item_name,
                                        'itemDescription': item_def['displayProperties'].get('description', ''),
                                        'itemIcon': item_def['displayProperties'].get('icon', ''),
                                        'rarity': self.get_rarity_name(item_def.get('inventory', {}).get('tierType', 0)),
                                        'classType': item_def.get('classType', 3),
                                        'supportedClasses': self.get_supported_classes(item_def),
                                        'flavorText': item_def.get('flavorText', ''),
                                        'perks': []  # Pas de perks disponibles
                                    })
                                
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
