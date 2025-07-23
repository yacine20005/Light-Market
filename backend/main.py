import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import xur, general, manifest
from .manifest_manager import update_manifest_if_needed

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variable for periodic task
periodic_task = None

async def periodic_manifest_update():
    """Periodic task to update the manifest every week"""
    while True:
        try:
            logger.info("🔄 Periodic manifest update...")
            await update_manifest_if_needed()
            logger.info("✅ Periodic update completed")
        except Exception as e:
            logger.error(f"❌ Error during periodic update: {e}")
        
        # Wait 7 days (604800 seconds)
        await asyncio.sleep(604800)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager"""
    global periodic_task
    
    # Startup
    logger.info("🚀 Starting Orbit Market API...")
    
    # Download manifest on startup
    logger.info("📥 Initial manifest download...")
    try:
        await update_manifest_if_needed()
        logger.info("✅ Manifest initialized successfully")
    except Exception as e:
        logger.error("❌ Error during manifest initialization: %s", e)
        logger.warning("⚠️ API will continue running but some features may be limited")
    
    # Start periodic task
    logger.info("⏰ Starting weekly manifest update...")
    periodic_task = asyncio.create_task(periodic_manifest_update())
    
    yield
    
    # Shutdown
    logger.info("🛑 Stopping API...")
    if periodic_task:
        periodic_task.cancel()
        try:
            await periodic_task
        except asyncio.CancelledError:
            logger.info("✅ Periodic task stopped")

app = FastAPI(
    title="Orbit Market API",
    description="API to retrieve Destiny 2 vendor data",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for production and development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(general.router)
app.include_router(xur.router)
app.include_router(manifest.router)
