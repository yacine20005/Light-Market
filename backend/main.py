from fastapi import FastAPI
from .routers import xur

app = FastAPI(
    title="Light Market API",
    description="API pour récupérer les données des vendeurs de Destiny 2",
    version="1.0.0"
)
app.include_router(xur.router)

@app.get("/")
def read_root():
    """Root endpoint for the API.

    Returns:
        dict: A welcome message.
    """
    return {"message": "Welcome to the Destiny 2 Vendor Checker API"}

@app.get("/health")
def health_check():
    """Health check endpoint.
    
    Returns:
        dict: Health status of the API
    """
    return {
        "status": "healthy",
        "message": "Light Market API is running",
        "version": "1.0.0"
    }
