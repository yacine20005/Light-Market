import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import xur, general, manifest
from .manifest_manager import update_manifest_if_needed

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Variable globale pour la tâche périodique
periodic_task = None

async def periodic_manifest_update():
    """Tâche périodique pour mettre à jour le manifest chaque semaine"""
    while True:
        try:
            logger.info("🔄 Mise à jour périodique du manifest...")
            await update_manifest_if_needed()
            logger.info("✅ Mise à jour périodique terminée")
        except Exception as e:
            logger.error(f"❌ Erreur lors de la mise à jour périodique: {e}")
        
        # Attendre 7 jours (604800 secondes)
        await asyncio.sleep(604800)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestionnaire du cycle de vie de l'application"""
    global periodic_task
    
    # Startup
    logger.info("🚀 Démarrage de l'API Orbit Market...")
    
    # Télécharger le manifest au démarrage
    logger.info("📥 Téléchargement initial du manifest...")
    try:
        await update_manifest_if_needed()
        logger.info("✅ Manifest initialisé avec succès")
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'initialisation du manifest: {e}")
        logger.warning("⚠️ L'API continuera de fonctionner mais certaines fonctionnalités peuvent être limitées")
    
    # Démarrer la tâche périodique
    logger.info("⏰ Démarrage de la mise à jour hebdomadaire du manifest...")
    periodic_task = asyncio.create_task(periodic_manifest_update())
    
    yield
    
    # Shutdown
    logger.info("🛑 Arrêt de l'API...")
    if periodic_task:
        periodic_task.cancel()
        try:
            await periodic_task
        except asyncio.CancelledError:
            logger.info("✅ Tâche périodique arrêtée")

app = FastAPI(
    title="Orbit Market API",
    description="API pour récupérer les données des vendeurs de Destiny 2",
    version="1.0.0",
    lifespan=lifespan
)

# Configuration CORS pour Vercel
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
