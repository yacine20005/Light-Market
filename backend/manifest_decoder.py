import sqlite3
import json
import os
from typing import Dict, List, Optional, Any


class ManifestDecoder:
    """Decodes Destiny 2 data from the local manifest."""

    # Class type constants
    CLASS_TITAN = 0
    CLASS_HUNTER = 1
    CLASS_WARLOCK = 2
    CLASS_ALL = 3

    # Rarity constants
    RARITY_EXOTIC = 6

    def __init__(self):
        current_dir = os.path.dirname(__file__)
        self.db_path = os.path.join(current_dir, "manifest", "manifest.sqlite")

    def connect_db(self) -> sqlite3.Connection:
        """Connects to the manifest database."""
        if not os.path.exists(self.db_path):
            raise FileNotFoundError(f"Database not found: {self.db_path}")
        return sqlite3.connect(self.db_path)

    def get_definition(self, table_name: str, hash_id: int) -> Optional[Dict[str, Any]]:
        """Retrieves a definition from the manifest."""
        try:
            with self.connect_db() as conn:
                cursor = conn.cursor()

                # Convert string to int if needed
                if isinstance(hash_id, str):
                    hash_id = int(hash_id)

                # Convert hash_id for SQLite database which contains
                # negative IDs for values greater than 2^31-1
                if hash_id > 2147483647:
                    hash_id = hash_id - 4294967296

                cursor.execute(f"SELECT json FROM {table_name} WHERE id = ?", (hash_id,))
                result = cursor.fetchone()

                return json.loads(result[0]) if result else None

        except (sqlite3.Error, json.JSONDecodeError, ValueError) as e:
            print(f"Error retrieving definition: {e}")
            return None

    # === Definition Getters ===

    def get_item_definition(self, item_hash: int) -> Optional[Dict[str, Any]]:
        """Retrieves an item definition."""
        return self.get_definition("DestinyInventoryItemDefinition", item_hash)

    def get_stat_definition(self, stat_hash: int) -> Optional[Dict[str, Any]]:
        """Retrieves a stat definition."""
        return self.get_definition("DestinyStatDefinition", stat_hash)

    def get_socket_type_definition(self, socket_type_hash: int) -> Optional[Dict[str, Any]]:
        """Retrieves a socket type definition."""
        return self.get_definition("DestinySocketTypeDefinition", socket_type_hash)

    def get_plug_definition(self, plug_hash: int) -> Optional[Dict[str, Any]]:
        """Retrieves a plug definition (for perks, mods, etc.)."""
        return self.get_definition("DestinyInventoryItemDefinition", plug_hash)

    def get_damage_type_definition(self, damage_type_hash: int) -> Optional[Dict[str, Any]]:
        """Retrieves a damage type definition."""
        return self.get_definition("DestinyDamageTypeDefinition", damage_type_hash)

    # === Item Information Processing ===

    def get_item_detailed_info(self, item_hash: int, item_instance_data: Optional[Dict] = None,
                               sockets_data: Optional[Dict] = None, stats_data: Optional[Dict] = None) -> Optional[Dict[str, Any]]:
        """
        Retrieves all detailed information for an item.
        
        Args:
            item_hash: Item hash identifier
            item_instance_data: Item instance data (optional)
            sockets_data: Socket data (optional)
            stats_data: Stats data (optional)
            
        Returns:
            Dict with all detailed item information
        """
        item_def = self.get_item_definition(item_hash)
        if not item_def:
            return None

        detailed_info = self._create_base_item_info(item_hash, item_def)

        # Process different data types
        self._add_damage_type_info(item_def, detailed_info)
        self._add_base_stats(item_def, detailed_info)
        self._add_investment_stats(item_def, detailed_info)
        self._add_socket_info(item_def, sockets_data, detailed_info)
        self._add_instance_stats(stats_data, detailed_info)
        self._add_power_level(item_instance_data, detailed_info)
        self._filter_perks_by_rarity(detailed_info)

        return detailed_info

    def _create_base_item_info(self, item_hash: int, item_def: Dict[str, Any]) -> Dict[str, Any]:
        """Create base item information structure."""
        return {
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

    def _add_damage_type_info(self, item_def: Dict[str, Any], detailed_info: Dict[str, Any]) -> None:
        """Add damage type information to item."""
        damage_type_hash = item_def.get('defaultDamageTypeHash')
        if not damage_type_hash:
            return

        damage_type_def = self.get_damage_type_definition(damage_type_hash)
        if damage_type_def:
            detailed_info['damageType'] = {
                'hash': damage_type_hash,
                'name': damage_type_def.get('displayProperties', {}).get('name', ''),
                'icon': damage_type_def.get('displayProperties', {}).get('icon', ''),
                'color': damage_type_def.get('color', {})
            }

    def _add_base_stats(self, item_def: Dict[str, Any], detailed_info: Dict[str, Any]) -> None:
        """Add base item stats from definition."""
        stats_data = item_def.get('stats', {}).get('stats', {})
        for stat_hash, stat_value in stats_data.items():
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

    def _add_investment_stats(self, item_def: Dict[str, Any], detailed_info: Dict[str, Any]) -> None:
        """Add investment stats (for power level notably)."""
        investment_stats = item_def.get('investmentStats', [])
        for stat in investment_stats:
            stat_def = self.get_stat_definition(stat.get('statTypeHash'))
            if stat_def:
                detailed_info['investmentStats'].append({
                    'hash': stat.get('statTypeHash'),
                    'name': stat_def.get('displayProperties', {}).get('name', ''),
                    'value': stat.get('value', 0)
                })

    def _add_socket_info(self, item_def: Dict[str, Any], sockets_data: Optional[Dict], detailed_info: Dict[str, Any]) -> None:
        """Add socket and perk information."""
        if sockets_data and 'sockets' in sockets_data:
            self._process_instance_sockets(sockets_data, detailed_info)
        elif 'sockets' in item_def:
            self._process_default_sockets(item_def, detailed_info)

    def _add_instance_stats(self, stats_data: Optional[Dict], detailed_info: Dict[str, Any]) -> None:
        """Add instance-specific stats."""
        if not stats_data or 'stats' not in stats_data:
            return

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

    def _add_power_level(self, item_instance_data: Optional[Dict], detailed_info: Dict[str, Any]) -> None:
        """Add power level if available."""
        if item_instance_data and 'primaryStat' in item_instance_data:
            detailed_info['powerLevel'] = item_instance_data['primaryStat'].get('value', 0)

    # === Socket Processing ===

    def _process_instance_sockets(self, sockets_data: Dict[str, Any], detailed_info: Dict[str, Any]) -> None:
        """Process instance socket data."""
        for socket in sockets_data['sockets']:
            if 'plugHash' in socket:
                plug_info = self._create_plug_info(socket['plugHash'])
                if plug_info:
                    plug_info['isEquipped'] = socket.get('isEnabled', False)
                    detailed_info['sockets'].append(plug_info)
                    detailed_info['perks'].append(plug_info)

    def _process_default_sockets(self, item_def: Dict[str, Any], detailed_info: Dict[str, Any]) -> None:
        """Process default socket data from item definition."""
        socket_entries = item_def.get('sockets', {}).get('socketEntries', [])
        for socket_entry in socket_entries:
            default_plug_hash = socket_entry.get('singleInitialItemHash')
            if default_plug_hash:
                plug_info = self._create_plug_info(default_plug_hash)
                if plug_info:
                    plug_info['isEquipped'] = True
                    plug_info['isDefault'] = True
                    detailed_info['sockets'].append(plug_info)
                    detailed_info['perks'].append(plug_info)

    def _create_plug_info(self, plug_hash: int) -> Optional[Dict[str, Any]]:
        """Create plug information dictionary."""
        plug_def = self.get_plug_definition(plug_hash)
        if not plug_def:
            return None

        plug_name = plug_def.get('displayProperties', {}).get('name', '')
        if not plug_name:  # Don't process unnamed plugs
            return None

        return {
            'hash': plug_hash,
            'name': plug_name,
            'description': plug_def.get('displayProperties', {}).get('description', ''),
            'icon': plug_def.get('displayProperties', {}).get('icon', ''),
            'isExotic': plug_def.get('inventory', {}).get('tierType', 0) == self.RARITY_EXOTIC,
            'itemType': plug_def.get('itemType', 0),
            'itemSubType': plug_def.get('itemSubType', 0)
        }

    def _filter_perks_by_rarity(self, detailed_info: Dict[str, Any]) -> None:
        """Filter perks based on item rarity."""
        if detailed_info['rarity'] == 'Exotic':
            exotic_perks = [perk for perk in detailed_info['perks'] if perk.get('isExotic', False)]
            detailed_info['perks'] = [exotic_perks[-1]] if exotic_perks else []
        else:
            detailed_info['perks'] = [
                perk for perk in detailed_info['perks']
                if perk.get('isExotic', False) or 'exotic' in perk.get('name', '').lower()
            ]

    # === Vendor Data Processing ===

    def decode_vendor_data(self, vendor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Decodes vendor data by adding readable names."""
        if not vendor_data or 'Response' not in vendor_data:
            return vendor_data

        response = vendor_data['Response']
        self._decode_vendors(response)
        self._decode_sales(response)
        return vendor_data

    def _decode_vendors(self, response: Dict[str, Any]) -> None:
        """Decode vendor information."""
        vendors_data = response.get('vendors', {}).get('data', {})
        for vendor_hash, vendor_info in vendors_data.items():
            vendor_def = self.get_definition("DestinyVendorDefinition", int(vendor_hash))
            if vendor_def and 'displayProperties' in vendor_def:
                vendor_info['name'] = vendor_def['displayProperties'].get('name', 'Unknown vendor')
                vendor_info['description'] = vendor_def['displayProperties'].get('description', '')

    def _decode_sales(self, response: Dict[str, Any]) -> None:
        """Decode sales information."""
        sales_data = response.get('sales', {}).get('data', {})

        for vendor_hash, vendor_sales in sales_data.items():
            if 'saleItems' not in vendor_sales:
                continue

            filtered_sale_items = {}
            seen_items = set()

            for sale_key, sale_item in vendor_sales['saleItems'].items():
                if self._should_skip_item(sale_item, seen_items):
                    continue

                processed_item = self._process_sale_item(sale_item, response)
                if processed_item:
                    filtered_sale_items[sale_key] = processed_item

            vendor_sales['saleItems'] = filtered_sale_items

    def _should_skip_item(self, sale_item: Dict[str, Any], seen_items: set) -> bool:
        """Check if item should be skipped."""
        item_hash = sale_item.get('itemHash')
        if not item_hash:
            return True

        item_def = self.get_item_definition(item_hash)
        if not item_def or 'displayProperties' not in item_def:
            return True

        item_name = item_def['displayProperties'].get('name', 'Unknown item')

        # Filter navigation links and duplicates
        if self.is_navigation_link(item_name) or item_name in seen_items:
            return True

        seen_items.add(item_name)
        return False

    def _process_sale_item(self, sale_item: Dict[str, Any], response: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Process individual sale item."""
        item_hash = sale_item.get('itemHash')
        if not item_hash:
            return None

        instance_key = str(sale_item.get('vendorItemIndex', 0))

        # Get instance data
        item_instance_data = self._get_response_data(response, 'itemInstances', instance_key)
        sockets_data = self._get_response_data(response, 'itemSockets', instance_key)
        stats_data = self._get_response_data(response, 'itemStats', instance_key)

        # Get detailed item information
        detailed_info = self.get_item_detailed_info(item_hash, item_instance_data, sockets_data, stats_data)

        if detailed_info:
            sale_item.update({
                'itemName': detailed_info['displayProperties'].get('name', ''),
                'itemDescription': detailed_info['displayProperties'].get('description', ''),
                'itemIcon': detailed_info['displayProperties'].get('icon', ''),
                'rarity': detailed_info['rarity'],
                'classType': detailed_info['classType'],
                'supportedClasses': detailed_info['supportedClasses'],
                'flavorText': detailed_info['flavorText'],
                'perks': detailed_info['perks']
            })
        else:
            # Fallback to basic information
            item_def = self.get_item_definition(item_hash)
            if item_def:
                sale_item.update({
                    'itemName': item_def['displayProperties'].get('name', ''),
                    'itemDescription': item_def['displayProperties'].get('description', ''),
                    'itemIcon': item_def['displayProperties'].get('icon', ''),
                    'rarity': self.get_rarity_name(item_def.get('inventory', {}).get('tierType', 0)),
                    'classType': item_def.get('classType', self.CLASS_ALL),
                    'supportedClasses': self.get_supported_classes(item_def),
                    'flavorText': item_def.get('flavorText', ''),
                    'perks': []
                })

        return sale_item

    def _get_response_data(self, response: Dict[str, Any], data_type: str, instance_key: str) -> Optional[Dict[str, Any]]:
        """Helper to get response data by type and key."""
        return response.get(data_type, {}).get('data', {}).get(instance_key)

    # === Utility Methods ===

    def get_rarity_name(self, tier_type: int) -> str:
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

    def get_class_name(self, class_type: int) -> str:
        """Converts class type to class name."""
        classes = {
            self.CLASS_TITAN: "Titan",
            self.CLASS_HUNTER: "Hunter",
            self.CLASS_WARLOCK: "Warlock",
            self.CLASS_ALL: "All Classes"
        }
        return classes.get(class_type, "Unknown")

    def get_supported_classes(self, item_def: Dict[str, Any]) -> List[str]:
        """
        Determines the classes supported by an item.
        Returns a list of classes that can use this item.
        """
        if not item_def:
            return []

        class_type = item_def.get('classType', self.CLASS_ALL)

        # If classType is 3, the item is available for all classes
        if class_type == self.CLASS_ALL:
            return ["Titan", "Hunter", "Warlock"]

        # Otherwise, return the specific class
        class_name = self.get_class_name(class_type)
        return [class_name] if class_name != "Unknown" else []

    def is_navigation_link(self, item_name: str) -> bool:
        """
        Determines if an item is a useless navigation link in Xur's menu.
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
