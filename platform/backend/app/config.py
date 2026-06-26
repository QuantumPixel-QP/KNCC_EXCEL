"""
KNCC Platform Configuration
"""
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLATFORM_DIR = os.path.dirname(BASE_DIR)
PROJECT_ROOT = os.path.dirname(PLATFORM_DIR)

# Database
DB_PATH = os.path.join(BASE_DIR, "kncc_platform.db")
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}")

# Upload storage
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Excel output
EXPORT_DIR = os.path.join(BASE_DIR, "exports")
os.makedirs(EXPORT_DIR, exist_ok=True)

# Legacy data paths (for importing existing data)
LEGACY_CLIENT_DIR = os.path.join(PROJECT_ROOT, "Client")
LEGACY_EXCEL = os.path.join(LEGACY_CLIENT_DIR, "Client_Requirments_Doc.xlsx")

# Auth Configuration
SECRET_KEY = "super_secret_jwt_key_for_development_change_in_prod"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week
