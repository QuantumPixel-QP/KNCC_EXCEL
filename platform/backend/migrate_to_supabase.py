import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path to allow importing from app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import Base
from app.config import DB_PATH
from app.models.organization import Organization
from app.models.user import User
from app.models.project import Project
from app.models.material import Material
from app.models.document import Document
from app.models.vpo import VPO
from app.models.activity import Activity
from app.models.delivery import Delivery
from app.models.inventory import Inventory

# Get Supabase URL from environment
SUPABASE_URL = os.environ.get("SUPABASE_URL")
if not SUPABASE_URL:
    print("Error: SUPABASE_URL environment variable is not set.")
    sys.exit(1)

# SQLite (Source) Setup
sqlite_url = f"sqlite:///{DB_PATH}"
sqlite_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
SqliteSession = sessionmaker(bind=sqlite_engine)

# Supabase (Destination) Setup
supabase_engine = create_engine(SUPABASE_URL)
SupabaseSession = sessionmaker(bind=supabase_engine)

# Define models in dependency order (parents before children)
# This prevents foreign key constraint errors during insertion
MODELS_TO_MIGRATE = [
    Organization,
    User,
    Project,
    Material,
    Document,
    VPO,
    Activity,
    Delivery,
    Inventory
]

def migrate():
    print("Connecting to Supabase and creating tables...")
    # Create all tables in Supabase (if they don't exist)
    Base.metadata.create_all(bind=supabase_engine)
    
    sqlite_session = SqliteSession()
    supabase_session = SupabaseSession()
    
    try:
        for model in MODELS_TO_MIGRATE:
            print(f"Migrating {model.__name__}...")
            
            # Fetch all records from SQLite
            records = sqlite_session.query(model).all()
            print(f"  Found {len(records)} records.")
            
            if not records:
                continue
                
            # To insert them into postgres cleanly, we merge or add them.
            # Using expunge removes them from the sqlite session so they can be added to the postgres session.
            for record in records:
                sqlite_session.expunge(record)
                # Ensure the postgres session merges the state
                supabase_session.merge(record)
                
            supabase_session.commit()
            print(f"  Successfully migrated {model.__name__}.")
            
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        supabase_session.rollback()
    finally:
        sqlite_session.close()
        supabase_session.close()

if __name__ == "__main__":
    migrate()
