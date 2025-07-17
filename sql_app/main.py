
from fastapi import FastAPI
from .routers import vendors

# Initialize the FastAPI application
app = FastAPI()

# Include the vendor router. This makes the endpoints defined in
# routers/vendors.py available in our application.
app.include_router(vendors.router)

# A simple root endpoint to confirm the server is running.
@app.get("/")
def read_root():
    return {"message": "Welcome to the Destiny 2 Vendor Checker API"}

# To run the application:
# 1. Make sure you have all the dependencies installed from requirements.txt
#    pip install -r requirements.txt
# 2. Run the following command in your terminal:
#    uvicorn sql_app.main:app --reload
#
# Uvicorn is an ASGI (Asynchronous Server Gateway Interface) server.
# It's responsible for running our FastAPI application and handling
# incoming HTTP requests. The --reload flag tells Uvicorn to automatically
# restart the server whenever you make changes to the code.
