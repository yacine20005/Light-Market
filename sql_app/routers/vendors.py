
from fastapi import APIRouter, HTTPException
from sql_app import bungie_api

router = APIRouter()

@router.get("/vendors/public")
async def get_public_vendors():
    """
    Fetches public vendor data from the Bungie.net API.

    This endpoint uses the public vendors endpoint to get data for all
    publicly available vendors (like Xûr).
    """

    # As per the Bungie API documentation, we need to specify which components
    # of data we want. We pass them as a single comma-separated string.
    # 400: Vendors - General information about the vendor.
    # 402: VendorSales - The items the vendor is selling.
    # 300: ItemCommonData - Basic info like rarity, class, etc.
    # 304: ItemStats - Detailed stats for the item (e.g., weapon stability, armor resilience).
    # 305: ItemSockets - Details about perks and mods on the item.

    params = {"components": "400,402,300,304,305"}
    endpoint = "/Destiny2/Vendors/"

    vendor_data = await bungie_api.make_bungie_request(endpoint, params=params)
    vendor_data = await bungie_api.make_bungie_request(endpoint, params=params)
    if vendor_data is None:
        raise HTTPException(status_code=502, detail="Upstream Bungie API error")
    return vendor_data
