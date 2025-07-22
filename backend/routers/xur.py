
"""
Routes for Xûr (Agent of the Nine) data
"""
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException
from backend import bungie_api
from backend.manifest_decoder import manifest_decoder

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/xur", tags=["xur"])

def is_xur_currently_available() -> bool:
    """
    Check if Xûr should be available based on current time.
    Xûr is available from Friday 18:00 to Tuesday 18:00 (local time).
    """
    now = datetime.now()
    current_day = now.weekday()  # 0 = Monday, 1 = Tuesday, ..., 4 = Friday, 5 = Saturday, 6 = Sunday
    current_hour = now.hour
    
    XUR_HOUR = 18
    
    # Convert to same format as frontend (0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday)
    frontend_day = (current_day + 1) % 7
    
    # Xûr is present from Friday 18h to Tuesday 18h
    if frontend_day == 5 and current_hour >= XUR_HOUR:  # Friday after 18h
        return True
    elif frontend_day in [6, 0, 1]:  # Weekend (Saturday, Sunday) and Monday
        return True
    elif frontend_day == 2 and current_hour < XUR_HOUR:  # Tuesday before 18h
        return True
    else:
        return False

@router.get("/")
async def get_xur_inventory():
    """
    Get Xûr's inventory with decoded exotic items
    
    Returns Xûr's location and currently available exotic items
    with detailed information including names, descriptions, stats and rarity.
    
    Returns:
        dict: Complete Xûr inventory
    
    Raises:
        HTTPException: 502 if Bungie API is unavailable
        HTTPException: 404 if Xûr is not currently available
        HTTPException: 500 if error processing data
    """
    # Xûr's vendor hash in Bungie API
    XUR_VENDOR_HASH = "2190858386"

    params = {"components": "Vendors,VendorSales,ItemSockets,ItemCommonData,ItemStats,ItemInstances,ItemPerks,ItemPlugStates"}
    endpoint = "/Destiny2/Vendors/"

    vendor_data = await bungie_api.make_bungie_request(endpoint, params=params)
    if vendor_data is None:
        raise HTTPException(status_code=502, detail="Upstream Bungie API error")

    # Check if Xûr is available
    response = vendor_data.get('Response', {})
    vendors = response.get('vendors', {}).get('data', {})

    # First check if it's the right time for Xûr
    if not is_xur_currently_available():
        raise HTTPException(status_code=404, detail="Xûr is not currently available (outside schedule)")

    if XUR_VENDOR_HASH not in vendors:
        raise HTTPException(status_code=404, detail="Xûr is not currently available")

    # Decode and filter for Xûr only
    try:
        decoded_data = manifest_decoder.decode_vendor_data(vendor_data)

        xur_response = {
            'vendor': decoded_data['Response']['vendors']['data'].get(XUR_VENDOR_HASH, {}),
            'sales': decoded_data['Response']['sales']['data'].get(XUR_VENDOR_HASH, {}),
            'isAvailable': is_xur_currently_available()
        }

        return {
            'Response': xur_response,
            'ErrorCode': decoded_data.get('ErrorCode'),
            'ThrottleSeconds': decoded_data.get('ThrottleSeconds')
        }

    except Exception as e:
        logger.error("Error decoding Xûr data: %s", e)
        raise HTTPException(status_code=500, detail="Error processing Xûr data") from e


@router.get("/debug")
async def debug_xur_data():
    """
    Debug endpoint to investigate Xûr data structure
    
    This endpoint provides detailed information about the data structure
    returned by Bungie API for Xûr, useful for debugging and development.
    
    Returns:
        dict: Debug information about Xûr data
    
    Raises:
        HTTPException: 502 if unable to retrieve data
    """
    XUR_VENDOR_HASH = "2190858386"
    
    params = {
        "components": "Vendors,VendorSales,VendorCategories,ItemSockets,ItemCommonData,ItemStats,ItemInstances,ItemPerks,ItemPlugStates"
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
    
    # Analyze sales
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
                        'supportedClasses': manifest_decoder.get_supported_classes(item_def),
                        'rarity': rarity,
                        'tierType': tier_type,
                        'costs': item_data.get('costs', []),
                        'quantity': item_data.get('quantity', 1)
                    }
    
    return debug_info

