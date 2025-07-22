import asyncio
import json
import os
import zipfile
import logging
from datetime import datetime
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv()

# Configuration du logging
logger = logging.getLogger(__name__)

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

    logger.info("📡 Récupération des métadonnées du manifest depuis Bungie.net...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            logger.info("✅ Métadonnées récupérées avec succès")
            return response.json()
    except httpx.HTTPStatusError as exc:
        error_msg = "❌ Erreur HTTP lors de la récupération des métadonnées: %d - %s"
        logger.error(error_msg, exc.response.status_code, exc.response.text)
        return None
    except httpx.RequestError as exc:
        error_msg = "❌ Erreur réseau lors de la récupération des métadonnées: %s"
        logger.error(error_msg, exc)
        return None

async def download_and_unzip_manifest(url: str, dest_path: Path):
    """
    Downloads a file from a URL, unzips it, finds the .content file,
    and renames it to our standard database name.
    """
    logger.info("📥 Téléchargement du manifest depuis: https://www.bungie.net%s", url)
    try:
        async with httpx.AsyncClient(timeout=360.0) as client:
            response = await client.get(f"https://www.bungie.net{url}")
            response.raise_for_status()

        zip_path = MANIFEST_DIRECTORY / "manifest.zip"
        zip_path.write_bytes(response.content)
        logger.info("✅ Téléchargement terminé (%d bytes). Extraction en cours...", len(response.content))

        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            # Find the .content file name inside the zip archive
            content_filename = next(
                (name for name in zip_ref.namelist() if name.endswith('.content')),
                None
            )
            if not content_filename:
                raise FileNotFoundError("Impossible de trouver le fichier .content dans l'archive zip du manifest.")

            zip_ref.extract(content_filename, path=MANIFEST_DIRECTORY)

            extracted_file = MANIFEST_DIRECTORY / content_filename
            if dest_path.exists():
                os.remove(dest_path)
            extracted_file.rename(dest_path)

        os.remove(zip_path)
        logger.info("✅ Manifest extrait avec succès vers: %s", dest_path)

    except httpx.RequestError as exc:
        error_msg = "❌ Échec du téléchargement du manifest: %s"
        logger.error(error_msg, exc)
        raise
    except zipfile.BadZipFile as e:
        error_msg = "❌ Erreur lors de l'extraction (fichier zip corrompu): %s"
        logger.error(error_msg, e)
        raise
    except FileNotFoundError as e:
        error_msg = "❌ Erreur (fichier non trouvé): %s"
        logger.error(error_msg, e)
        raise


async def update_manifest_if_needed():
    """
    Checks if the local manifest is outdated and updates it if necessary.
    """
    logger.info("🔍 Vérification des mises à jour du manifest...")
    metadata = await get_manifest_metadata()
    if not metadata:
        logger.error("❌ Impossible de récupérer les métadonnées du manifest")
        return

    try:
        new_manifest_path = metadata['Response']['mobileWorldContentPaths']['en']
        logger.info("📋 Version disponible: %s", new_manifest_path)
    except KeyError:
        logger.error("❌ Impossible de trouver le chemin du manifest anglais dans la réponse API")
        return

    current_manifest_version = ""
    if MANIFEST_INFO_FILE.exists():
        with open(MANIFEST_INFO_FILE, 'r', encoding='utf-8') as f:
            try:
                info = json.load(f)
                current_manifest_version = info.get('version_path', '')
                logger.info("📋 Version locale: %s", current_manifest_version)
            except json.JSONDecodeError:
                logger.warning("⚠️ Impossible de lire le fichier d'informations du manifest. Mise à jour forcée.")

    if new_manifest_path == current_manifest_version and MANIFEST_DB_FILE.exists():
        logger.info("✅ Le manifest est déjà à jour")
    else:
        logger.info("🔄 Nouvelle version détectée. Mise à jour en cours...")
        await download_and_unzip_manifest(new_manifest_path, MANIFEST_DB_FILE)

        # Sauvegarder les informations avec timestamp
        manifest_info = {
            'version_path': new_manifest_path,
            'last_update': datetime.now().isoformat(),
            'file_size': os.path.getsize(MANIFEST_DB_FILE) if MANIFEST_DB_FILE.exists() else 0
        }
        
        with open(MANIFEST_INFO_FILE, 'w', encoding='utf-8') as f:
            json.dump(manifest_info, f, indent=2)
        logger.info("✅ Processus de mise à jour du manifest terminé")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    logger.info("🔧 Exécution manuelle de la vérification du manifest...")
    asyncio.run(update_manifest_if_needed())
