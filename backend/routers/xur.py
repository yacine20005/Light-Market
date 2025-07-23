
"""
Routes for Xûr (Agent of the Nine) data
"""
import logging
from fastapi import APIRouter, HTTPException
from backend import bungie_api
from backend.manifest_decoder import manifest_decoder

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/xur", tags=["xur"])

@router.get("/")
async def get_xur_inventory():
    """
    Get Xûr's inventory with decoded exotic items
    
    Returns Xûr's location and currently available exotic items
    with detailed information including names, descriptions, stats and rarity.
    Always returns HTTP 200 with isAvailable flag indicating Xûr's availability.
    
    Returns:
        dict: Complete Xûr inventory with availability status
    
    Raises:
        HTTPException: 502 if Bungie API is unavailable
        HTTPException: 500 if error processing data
    """
    # Xûr's vendor hash in Bungie API
    XUR_VENDOR_HASH = "2190858386"

    params = {"components": "Vendors,VendorSales,ItemSockets,ItemCommonData,ItemStats,ItemInstances,ItemPerks,ItemPlugStates"}
    endpoint = "/Destiny2/Vendors/"

    vendor_data = await bungie_api.make_bungie_request(endpoint, params=params)
    if vendor_data is None:
        raise HTTPException(status_code=502, detail="Upstream Bungie API error")

    # Check if Xûr is available in current vendors
    response = vendor_data.get('Response', {})
    vendors = response.get('vendors', {}).get('data', {})
    bungie_has_xur = XUR_VENDOR_HASH in vendors

    # Check if Xûr should be available based on schedule (Paris time)
    from datetime import datetime, timezone, timedelta
    
    # Paris timezone (UTC+1 or UTC+2 depending on daylight saving)
    # For simplicity, assuming UTC+2 (summer time)
    paris_offset = timedelta(hours=2)
    paris_tz = timezone(paris_offset)
    now_paris = datetime.now(paris_tz)
    current_day = now_paris.weekday()  # 0 = Monday, 1 = Tuesday, ..., 4 = Friday, 5 = Saturday, 6 = Sunday
    current_hour = now_paris.hour
    
    # Xûr is available from Friday 18h to Tuesday 18h (Paris time)
    # Friday = 4, Saturday = 5, Sunday = 6, Monday = 0, Tuesday = 1
    is_xur_scheduled = False
    if current_day == 4 and current_hour >= 18:  # Friday after 18h
        is_xur_scheduled = True
    elif current_day in [5, 6, 0]:  # Saturday, Sunday, Monday
        is_xur_scheduled = True
    elif current_day == 1 and current_hour < 18:  # Tuesday before 18h
        is_xur_scheduled = True
    
    # Use schedule-based availability (more reliable than Bungie API vendor list)
    is_xur_currently_available = is_xur_scheduled

    # Always try to get Xûr data - Bungie API keeps the last inventory even when he's gone
    try:
        decoded_data = manifest_decoder.decode_vendor_data(vendor_data)
        
        # Try to get Xûr data from the decoded response
        xur_vendor_data = decoded_data['Response']['vendors']['data'].get(XUR_VENDOR_HASH, {})
        xur_sales_data = decoded_data['Response']['sales']['data'].get(XUR_VENDOR_HASH, {})
        
        # If we have vendor data but no sales data, Xûr is not available but we can show his info
        if not xur_vendor_data:
            # No Xûr data at all - create basic structure
            xur_vendor_data = {
                'vendorHash': int(XUR_VENDOR_HASH),
                'nextRefreshDate': '',
                'enabled': False,
                'name': 'Xûr',
                'description': 'Agent of the Nine'
            }
        
        if not xur_sales_data:
            # No sales data - create empty sales structure
            xur_sales_data = {'saleItems': {}}

        xur_response = {
            'vendor': xur_vendor_data,
            'sales': xur_sales_data,
            'isAvailable': is_xur_currently_available,
            'message': 'Xûr is currently available' if is_xur_currently_available else 'Xûr is not currently available (showing last inventory)'
        }

        return {
            'Response': xur_response,
            'ErrorCode': decoded_data.get('ErrorCode', 0),
            'ThrottleSeconds': decoded_data.get('ThrottleSeconds', 0)
        }

    except Exception as e:
        logger.error("Error decoding Xûr data: %s", e)
        
        # Return error but still with valid structure
        xur_response = {
            'vendor': {
                'vendorHash': int(XUR_VENDOR_HASH),
                'nextRefreshDate': '',
                'enabled': False,
                'name': 'Xûr',
                'description': 'Agent of the Nine'
            },
            'sales': {
                'saleItems': {}
            },
            'isAvailable': False,
            'message': f'Error fetching Xûr data: {str(e)}'
        }

        return {
            'Response': xur_response,
            'ErrorCode': 1,
            'ThrottleSeconds': 0
        }


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