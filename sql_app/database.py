
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the database URL from the environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# The engine is the entry point to the database. It's responsible for
# creating a connection pool to the database.
engine = create_engine(DATABASE_URL)

# A sessionmaker is a factory for creating new Session objects. A Session
# is the primary interface for interacting with the database. It represents
# a "unit of work" with the database.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is a class that all of our SQLAlchemy models will inherit from.
# It's used to create the database tables for our models.
Base = declarative_base()

# Dependency to get a database session.
# This function will be used in our API endpoints to get a database session.
# Using a dependency allows us to easily manage the lifecycle of the session,
# ensuring that it's properly closed after each request.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
