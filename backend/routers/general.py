"""
Routes for general API information
"""
from fastapi import APIRouter

router = APIRouter(tags=["general"])


@router.get("/")
def read_root():
    """
    Root API endpoint
    
    Returns:
        dict: Welcome message
    """
    return {
        "message": "Welcome to the Orbit Market API",
        "description": "API to retrieve Destiny 2 vendor data",
        "version": "1.0.0",
        "endpoints": {
            "/health": "API health check",
            "/xur": "Xûr inventory",
            "/xur/debug": "Xûr data debug",
            "/manifest/status": "Manifest status",
            "/manifest/update": "Update manifest",
            "/manifest/info": "Detailed manifest information"
        }
    }


@router.get("/health")
def health_check():
    """
    API health check endpoint
    
    Returns:
        dict: API health status
    """
    return {
        "status": "healthy",
        "message": "Orbit Market API is running",
        "version": "1.0.0",
        "service": "Destiny 2 Vendor Checker API"
    }
