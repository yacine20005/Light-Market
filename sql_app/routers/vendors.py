
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database
from .. import bungie_api

# Create a new router. A router is like a mini-FastAPI application.
# It allows us to group related endpoints together.
router = APIRouter()

@router.get("/vendors/public")
async def get_public_vendors(db: Session = Depends(database.get_db)):
    """
    Fetches public vendor data from the Bungie.net API.

    This endpoint demonstrates how to call the Bungie API using our helper
    function and return the raw JSON response.
    """
    # These are the components we need to get the vendor data.
    # You can find more information about these components in the Bungie API documentation.
    components = {
        "components": "Vendors,VendorSales,ItemSockets,ItemCommonData,ItemStats"
    }

    # The endpoint for getting public vendors.
    # The numbers in the URL are the Destiny 2 membership type (3 for Steam)
    # and a placeholder membership ID. For public vendors, the membership ID
    # doesn't matter.
    endpoint = "/Destiny2/3/Profile/4611686018467238913/Character/2305843009263349937/Vendors/"

    # Call the Bungie API using our helper function
    vendor_data = await bungie_api.make_bungie_request(endpoint, params=components)

    # For now, just return the raw JSON response.
    return vendor_data
