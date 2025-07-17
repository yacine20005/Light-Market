
from fastapi import APIRouter, HTTPException
from backend import bungie_api
from backend.manifest_decoder import manifest_decoder
import sqlite3
import json

router = APIRouter()

@router.get("/vendors")
async def get_public_vendors():
    """
    Fetches public vendor data from the Bungie.net API and decodes the hashes
    using the Destiny 2 manifest to provide human-readable names and descriptions.

    This endpoint uses the public vendors endpoint to get data for all
    publicly available vendors (like Xûr) and enriches the response with
    decoded manifest data.
    """

    params = {"components": "Vendors,VendorSales,ItemSockets,ItemCommonData,ItemStats"}
    endpoint = "/Destiny2/Vendors/"

    vendor_data = await bungie_api.make_bungie_request(endpoint, params=params)
    if vendor_data is None:
        raise HTTPException(status_code=502, detail="Upstream Bungie API error")

    # Décoder les hash en utilisant le manifeste
    try:
        decoded_data = manifest_decoder.decode_vendor_data(vendor_data)
        return decoded_data
    except (sqlite3.Error, json.JSONDecodeError, ValueError) as e:
        # En cas d'erreur de décodage, retourner les données brutes
        print(f"Erreur lors du décodage des données vendor: {e}")
        return vendor_data

@router.get("/vendors/all")
async def get_all_vendors():
    """
    Fetches all vendor definitions from the Destiny 2 manifest.
    
    This endpoint returns information about all vendors in the game,
    including their names, descriptions, and locations, decoded from
    the manifest data.
    """
    try:
        # Utiliser le décodeur de manifeste pour obtenir tous les vendeurs
        all_vendors = manifest_decoder.get_all_vendors()
        return {
            "Response": {
                "vendors": all_vendors
            },
            "ErrorCode": 1,
            "ThrottleSeconds": 0
        }
    except (sqlite3.Error, json.JSONDecodeError, ValueError) as e:
        print(f"Erreur lors de la récupération des vendeurs: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des données du manifeste") from e

