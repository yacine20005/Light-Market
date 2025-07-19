
from fastapi import APIRouter, HTTPException
from backend import bungie_api
from backend.manifest_decoder import manifest_decoder

router = APIRouter()

@router.get("/xur")
async def get_xur_inventory():
    """
    Retrieves Xûr's inventory with decoded exotic items.
    
    Returns Xûr's location and exotic items currently for sale
    with detailed information including names, descriptions, stats and rarity.
    """
    # Hash de Xûr dans l'API Bungie
    XUR_VENDOR_HASH = "2190858386"

    params = {"components": "Vendors,VendorSales,ItemSockets,ItemCommonData,ItemStats"}
    endpoint = "/Destiny2/Vendors/"

    vendor_data = await bungie_api.make_bungie_request(endpoint, params=params)
    if vendor_data is None:
        raise HTTPException(status_code=502, detail="Upstream Bungie API error")

    # Check if Xûr is available
    response = vendor_data.get('Response', {})
    vendors = response.get('vendors', {}).get('data', {})

    if XUR_VENDOR_HASH not in vendors:
        raise HTTPException(status_code=404, detail="Xûr is not currently available")

    # Decode and filter for Xûr only
    try:
        decoded_data = manifest_decoder.decode_vendor_data(vendor_data)

        xur_response = {
            'vendor': decoded_data['Response']['vendors']['data'].get(XUR_VENDOR_HASH, {}),
            'sales': decoded_data['Response']['sales']['data'].get(XUR_VENDOR_HASH, {}),
            'isAvailable': True
        }

        return {
            'Response': xur_response,
            'ErrorCode': decoded_data.get('ErrorCode'),
            'ThrottleSeconds': decoded_data.get('ThrottleSeconds')
        }

    except Exception as e:
        print(f"Error decoding Xûr data: {e}")
        raise HTTPException(status_code=500, detail="Error processing Xûr data") from e

@router.get("/xur/debug")
async def debug_xur_data():
    """
    Debug endpoint to investigate Xûr data structure.
    """
    XUR_VENDOR_HASH = "2190858386"
    
    params = {
        "components": "Vendors,VendorSales,VendorCategories,ItemSockets,ItemCommonData,ItemStats"
    }
    endpoint = "/Destiny2/Vendors/"
    
    vendor_data = await bungie_api.make_bungie_request(endpoint, params=params)
    if not vendor_data:
        raise HTTPException(status_code=502, detail="Unable to retrieve data")
    
    response = vendor_data.get('Response', {})
    
    # Simplified debug structure
    debug_info = {
        'available_components': list(response.keys()),
        'xur_vendor_exists': XUR_VENDOR_HASH in response.get('vendors', {}).get('data', {}),
        'sales_structure': {},
        'exotic_items_analysis': {}
    }
    
    # Analyser les ventes
    if 'sales' in response and 'data' in response['sales']:
        xur_sales = response['sales']['data'].get(XUR_VENDOR_HASH, {})
        debug_info['sales_structure'] = {
            'has_saleItems': 'saleItems' in xur_sales,
            'sale_items_count': len(xur_sales.get('saleItems', {})),
            'sale_items_keys': list(xur_sales.get('saleItems', {}).keys())
        }
        
        # Analyze exotic items
        for item_key, item_data in xur_sales.get('saleItems', {}).items():
            item_hash = item_data.get('itemHash')
            item_def = manifest_decoder.get_item_definition(item_hash)
            
            if item_def:
                item_name = item_def.get('displayProperties', {}).get('name', '')
                tier_type = item_def.get('inventory', {}).get('tierType', 0)
                rarity = manifest_decoder.get_rarity_name(tier_type)
                
                # Keep only exotics (tierType 6) and special items
                if tier_type == 6 or 'Strange' in item_name or 'Xenology' in item_name:
                    debug_info['exotic_items_analysis'][item_key] = {
                        'name': item_name,
                        'hash': item_hash,
                        'itemType': item_def.get('itemType'),
                        'itemSubType': item_def.get('itemSubType'),
                        'classType': item_def.get('classType'),
                        'rarity': rarity,
                        'tierType': tier_type,
                        'costs': item_data.get('costs', []),
                        'quantity': item_data.get('quantity', 1)
                    }
    
    return debug_info

