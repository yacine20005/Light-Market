from fastapi import FastAPI
from .routers import xur

app = FastAPI()
app.include_router(xur.router)

@app.get("/")
def read_root():
    """Root endpoint for the API.

    Returns:
        dict: A welcome message.
    """
    return {"message": "Welcome to the Destiny 2 Vendor Checker API"}
