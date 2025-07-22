"""
Routes for Destiny 2 manifest management
"""
import os
import json
import logging
import time
from pathlib import Path
from fastapi import APIRouter, HTTPException
from backend.manifest_manager import update_manifest_if_needed

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/manifest", tags=["manifest"])


@router.get("/status")
async def get_manifest_status():
    """
    Check local manifest status
    
    Returns:
        dict: Information about manifest status (existence, size, version, etc.)
    """
    manifest_dir = Path(__file__).parent.parent / "manifest"
    manifest_db_file = manifest_dir / "manifest.sqlite"
    manifest_info_file = manifest_dir / "manifest_info.json"
    
    status = {
        "manifest_exists": manifest_db_file.exists(),
        "manifest_size": os.path.getsize(manifest_db_file) if manifest_db_file.exists() else 0,
        "last_update": None,
        "version_path": None,
        "status": "unknown"
    }
    
    if manifest_info_file.exists():
        try:
            with open(manifest_info_file, 'r', encoding='utf-8') as f:
                info = json.load(f)
                status.update(info)
        except Exception as e:
            logger.error("Error reading info file: %s", e)
    
    if manifest_db_file.exists():
        status["last_update"] = os.path.getmtime(manifest_db_file)
        status["status"] = "available"
    else:
        status["status"] = "missing"
    
    return status


@router.post("/update")
async def force_manifest_update():
    """
    Force manifest update
    
    Returns:
        dict: Update result
    """
    try:
        logger.info("Forced manifest update requested...")
        await update_manifest_if_needed()
        logger.info("Forced update completed")
        return {
            "status": "success", 
            "message": "Manifest updated successfully",
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error("Error during forced update: %s", e)
        raise HTTPException(
            status_code=500, 
            detail=f"Error updating manifest: {str(e)}"
        )


@router.get("/info")
async def get_manifest_info():
    """
    Get detailed manifest information
    
    Returns:
        dict: Detailed manifest information
    """
    manifest_dir = Path(__file__).parent.parent / "manifest"
    manifest_db_file = manifest_dir / "manifest.sqlite"
    manifest_info_file = manifest_dir / "manifest_info.json"
    
    if not manifest_db_file.exists():
        raise HTTPException(
            status_code=404, 
            detail="Manifest not found. Please download the manifest first."
        )
    
    info = {
        "file_path": str(manifest_db_file),
        "file_size": os.path.getsize(manifest_db_file),
        "file_modified": os.path.getmtime(manifest_db_file),
        "is_readable": os.access(manifest_db_file, os.R_OK)
    }
    
    if manifest_info_file.exists():
        try:
            with open(manifest_info_file, 'r', encoding='utf-8') as f:
                stored_info = json.load(f)
                info.update(stored_info)
        except Exception as e:
            logger.error("Error reading metadata: %s", e)
    
    return info
