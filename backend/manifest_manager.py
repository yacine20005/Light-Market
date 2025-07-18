import asyncio
import json
import os
import zipfile
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv()

BUNGIE_API_KEY = os.getenv("BUNGIE_API_KEY")
BUNGIE_API_URL = "https://www.bungie.net/Platform"

MANIFEST_DIRECTORY = Path(__file__).parent / "manifest"
MANIFEST_DB_FILE = MANIFEST_DIRECTORY / "manifest.sqlite"
MANIFEST_INFO_FILE = MANIFEST_DIRECTORY / "manifest_info.json"
MANIFEST_DIRECTORY.mkdir(exist_ok=True)

async def get_manifest_metadata():
    """
    Fetches the metadata for the Destiny 2 Manifest from the Bungie API.
    This tells us where to download the latest version of the manifest.
    """
    if BUNGIE_API_KEY is None:
        raise ValueError("BUNGIE_API_KEY environment variable is not set.")

    headers = {"X-API-Key": BUNGIE_API_KEY}
    endpoint = "/Destiny2/Manifest/"
    url = f"{BUNGIE_API_URL}{endpoint}"

    print("Fetching manifest metadata from Bungie.net...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            print("Successfully fetched metadata.")
            return response.json()
    except httpx.HTTPStatusError as exc:
        print(f"Error fetching manifest metadata: {exc.response.status_code} - {exc.response.text}")
        return None
    except httpx.RequestError as exc:
        print(f"A network error occurred while fetching manifest metadata: {exc}")
        return None

async def download_and_unzip_manifest(url: str, dest_path: Path):
    """
    Downloads a file from a URL, unzips it, finds the .content file,
    and renames it to our standard database name.
    """
    print(f"Downloading manifest from: https://www.bungie.net{url}")
    try:
        async with httpx.AsyncClient(timeout=360.0) as client:
            response = await client.get(f"https://www.bungie.net{url}")
            response.raise_for_status()

        zip_path = MANIFEST_DIRECTORY / "manifest.zip"
        zip_path.write_bytes(response.content)
        print("Download complete. Unzipping...")

        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            # Find the .content file name inside the zip archive
            content_filename = next(
                (name for name in zip_ref.namelist() if name.endswith('.content')),
                None
            )
            if not content_filename:
                raise FileNotFoundError("Could not find the .content file inside the manifest zip.")

            zip_ref.extract(content_filename, path=MANIFEST_DIRECTORY)

            extracted_file = MANIFEST_DIRECTORY / content_filename
            if dest_path.exists():
                os.remove(dest_path)
            extracted_file.rename(dest_path)

        os.remove(zip_path)
        print(f"Manifest successfully extracted to: {dest_path}")

    except httpx.RequestError as exc:
        print(f"Failed to download manifest: {exc}")
    except zipfile.BadZipFile as e:
        print(f"An error occurred during extraction (bad zip file): {e}")
    except FileNotFoundError as e:
        print(f"An error occurred (file not found): {e}")


async def update_manifest_if_needed():
    """
    Checks if the local manifest is outdated and updates it if necessary.
    """
    metadata = await get_manifest_metadata()
    if not metadata:
        return

    try:
        new_manifest_path = metadata['Response']['mobileWorldContentPaths']['en']
    except KeyError:
        print("Could not find the English manifest path in the API response.")
        return

    current_manifest_version = ""
    if MANIFEST_INFO_FILE.exists():
        with open(MANIFEST_INFO_FILE, 'r', encoding='utf-8') as f:
            try:
                info = json.load(f)
                current_manifest_version = info.get('version_path', '')
            except json.JSONDecodeError:
                print("Warning: Could not read current manifest info file. Forcing update.")

    if new_manifest_path == current_manifest_version and MANIFEST_DB_FILE.exists():
        print("Manifest is already up-to-date.")
    else:
        print(f"New manifest version detected. Current: '{current_manifest_version}', New: '{new_manifest_path}'")
        await download_and_unzip_manifest(new_manifest_path, MANIFEST_DB_FILE)

        with open(MANIFEST_INFO_FILE, 'w', encoding='utf-8') as f:
            json.dump({'version_path': new_manifest_path}, f)
        print("Manifest update process complete.")

if __name__ == "__main__":
    print("Running manifest update check...")
    asyncio.run(update_manifest_if_needed())
