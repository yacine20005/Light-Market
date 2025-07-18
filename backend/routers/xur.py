
from fastapi import APIRouter, HTTPException
from backend import bungie_api
from backend.manifest_decoder import manifest_decoder

router = APIRouter()

@router.get("/xur")
async def get_xur_inventory():
    """
    Fetches Xûr's current inventory with decoded item names and descriptions.
    
    Returns Xûr's location and current exotic items for sale with detailed
    information including names, descriptions, stats, and rarity.
    """
    # Hash de Xûr dans l'API Bungie
    XUR_VENDOR_HASH = "2190858386"

    params = {"components": "Vendors,VendorSales,ItemSockets,ItemCommonData,ItemStats"}
    endpoint = "/Destiny2/Vendors/"

    vendor_data = await bungie_api.make_bungie_request(endpoint, params=params)
    if vendor_data is None:
        raise HTTPException(status_code=502, detail="Upstream Bungie API error")

    # Vérifier si Xûr est disponible
    response = vendor_data.get('Response', {})
    vendors = response.get('vendors', {}).get('data', {})

    if XUR_VENDOR_HASH not in vendors:
        raise HTTPException(status_code=404, detail="Xûr n'est pas disponible actuellement")

    # Décoder et filtrer pour Xûr uniquement
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
        print(f"Erreur lors du décodage des données Xûr: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors du traitement des données Xûr") from e

