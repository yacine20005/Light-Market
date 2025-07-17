import os
from typing import Optional

import httpx
from dotenv import load_dotenv

load_dotenv()
BUNGIE_API_KEY = os.getenv("BUNGIE_API_KEY")
if BUNGIE_API_KEY is None:
    raise ValueError("BUNGIE_API_KEY environment variable is not set.")

BUNGIE_API_URL = "https://www.bungie.net/Platform"

async_client = httpx.AsyncClient()
async def make_bungie_request(endpoint: str, params: Optional[dict] = None):
    """
    Makes an authenticated GET request to the Bungie.net API.

    Args:
        endpoint: The API endpoint path (e.g., "/Destiny2/Vendors/").
        params: A dictionary of query parameters.

    Returns:
        The JSON response from the API as a dictionary.
    """
    headers = {"X-API-Key": str(BUNGIE_API_KEY)}
    url = f"{BUNGIE_API_URL}{endpoint}"

    try:
        response = await async_client.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for non-200 status codes
        return response.json()
    except httpx.HTTPStatusError as exc:
        # Handle HTTP errors (e.g., 4xx, 5xx)
        print(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
        return None
    except httpx.RequestError as exc:
        # Handle other request errors (e.g., network issues)
        print(f"An error occurred while requesting {exc.request.url!r}.")
        return None
