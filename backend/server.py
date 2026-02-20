from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'popp-secret-key-2024')
JWT_ALGORITHM = 'HS256'

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ─── Models ───

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None

class ProductResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    brand: str
    category: str
    category_slug: str
    price: float
    original_price: Optional[float] = None
    description: str
    short_description: str
    specs: dict = {}
    images: List[str] = []
    featured: bool = False
    in_stock: bool = True
    tags: List[str] = []

class CategoryResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    slug: str
    description: str
    image: str
    product_count: int = 0

class ConsultationCreate(BaseModel):
    full_name: str
    company: Optional[str] = None
    phone: str
    email: str
    location: Optional[str] = None
    application_type: Optional[str] = None
    installation_type: Optional[str] = None
    flow_rate: Optional[str] = None
    pressure_head: Optional[str] = None
    power_supply: Optional[str] = None
    water_source: Optional[str] = None
    pipe_size: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    description: Optional[str] = None

class QuoteRequestCreate(BaseModel):
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    message: Optional[str] = None
    items: List[dict]

class QuoteResponse(BaseModel):
    id: str
    status: str
    message: str

# ─── Auth Helpers ───

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {'user_id': user_id, 'email': email, 'exp': datetime.now(timezone.utc).timestamp() + 86400 * 7}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(token: str = None):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        token = token.replace("Bearer ", "")
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload['user_id']}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ─── Auth Routes ───

@api_router.post("/auth/register")
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "password": hash_password(data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    token = create_token(user_id, data.email)
    return {"token": token, "user": {"id": user_id, "name": data.name, "email": data.email, "phone": data.phone}}

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user['id'], user['email'])
    return {"token": token, "user": {"id": user['id'], "name": user['name'], "email": user['email'], "phone": user.get('phone')}}

@api_router.get("/auth/me")
async def get_me(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = await get_current_user(authorization)
    return user

# ─── Products Routes ───

@api_router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    featured: Optional[bool] = None,
    sort: Optional[str] = "name_asc",
    limit: int = Query(default=50, le=100),
    skip: int = 0
):
    query = {}
    if category:
        query["category_slug"] = category
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    if min_price is not None:
        query["price"] = query.get("price", {})
        query["price"]["$gte"] = min_price
    if max_price is not None:
        query["price"] = query.get("price", {})
        query["price"]["$lte"] = max_price
    if featured is not None:
        query["featured"] = featured

    sort_field, sort_dir = "name", 1
    if sort == "price_asc":
        sort_field, sort_dir = "price", 1
    elif sort == "price_desc":
        sort_field, sort_dir = "price", -1
    elif sort == "name_desc":
        sort_field, sort_dir = "name", -1
    elif sort == "name_asc":
        sort_field, sort_dir = "name", 1

    products = await db.products.find(query, {"_id": 0}).sort(sort_field, sort_dir).skip(skip).limit(limit).to_list(limit)
    return products

@api_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/products/{product_id}/related", response_model=List[ProductResponse])
async def get_related_products(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        return []
    related = await db.products.find(
        {"category_slug": product["category_slug"], "id": {"$ne": product_id}},
        {"_id": 0}
    ).limit(4).to_list(4)
    return related

# ─── Categories Routes ───

@api_router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(20)
    for cat in categories:
        count = await db.products.count_documents({"category_slug": cat["slug"]})
        cat["product_count"] = count
    return categories

# ─── Brands Route ───

@api_router.get("/brands")
async def get_brands():
    brands = await db.products.distinct("brand")
    return brands

# ─── Quote Routes ───

@api_router.post("/quotes", response_model=QuoteResponse)
async def create_quote(data: QuoteRequestCreate):
    quote_id = str(uuid.uuid4())
    quote_doc = {
        "id": quote_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "company": data.company,
        "message": data.message,
        "items": data.items,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.quotes.insert_one(quote_doc)
    return {"id": quote_id, "status": "pending", "message": "Quote request submitted successfully. We will contact you shortly."}

# ─── Consultation Routes ───

@api_router.post("/consultations")
async def create_consultation(data: ConsultationCreate):
    consult_id = str(uuid.uuid4())
    consult_doc = {
        "id": consult_id,
        "full_name": data.full_name,
        "company": data.company,
        "phone": data.phone,
        "email": data.email,
        "location": data.location,
        "application_type": data.application_type,
        "installation_type": data.installation_type,
        "flow_rate": data.flow_rate,
        "pressure_head": data.pressure_head,
        "power_supply": data.power_supply,
        "water_source": data.water_source,
        "pipe_size": data.pipe_size,
        "budget": data.budget,
        "timeline": data.timeline,
        "description": data.description,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.consultations.insert_one(consult_doc)
    return {"id": consult_id, "status": "pending", "message": "Consultation request submitted. Our technical team will respond within 24-48 hours."}

# ─── Seed Data ───

@api_router.post("/seed")
async def seed_data():
    existing = await db.products.count_documents({})
    if existing > 0:
        return {"message": f"Database already seeded with {existing} products"}

    categories = [
        {"id": str(uuid.uuid4()), "name": "Booster Pumps", "slug": "booster-pumps", "description": "Pressure booster systems for homes and businesses", "image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400"},
        {"id": str(uuid.uuid4()), "name": "Submersible Pumps", "slug": "submersible-pumps", "description": "Submersible pumps for wells, boreholes and drainage", "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400"},
        {"id": str(uuid.uuid4()), "name": "Borehole Pumps", "slug": "borehole-pumps", "description": "Deep well and borehole pump systems", "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400"},
        {"id": str(uuid.uuid4()), "name": "Self-Priming Pumps", "slug": "self-priming-pumps", "description": "Self-priming pumps for irrigation and transfer", "image": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400"},
        {"id": str(uuid.uuid4()), "name": "Water Tanks", "slug": "water-tanks", "description": "Storage tanks for rainwater harvesting and backup supply", "image": "https://images.unsplash.com/photo-1638294834907-d11608bc11d2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Accessories", "slug": "accessories", "description": "Fittings, controllers, and pump accessories", "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400"},
    ]
    await db.categories.insert_many(categories)

    products = [
        # Booster Pumps
        {"id": str(uuid.uuid4()), "name": "DAB E.SYBOX Mini 3", "brand": "DAB", "category": "Booster Pumps", "category_slug": "booster-pumps", "price": 12500.00, "original_price": 14200.00, "description": "The DAB E.SYBOX Mini 3 is a compact, fully integrated electronic booster system with inverter technology. Ideal for domestic water pressure boosting with up to 4 taps simultaneously. Features include dry-run protection, anti-cycling, anti-freeze, and anti-blocking functions. Easy installation and quiet operation.", "short_description": "Compact electronic booster system with inverter, 0.8kW 220V", "specs": {"power": "0.8 kW", "voltage": "220V", "max_flow": "80 L/min", "max_head": "55m", "inlet_outlet": "1 inch", "weight": "12.7 kg"}, "images": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600"], "featured": True, "in_stock": True, "tags": ["booster", "inverter", "domestic", "pressure"]},
        {"id": str(uuid.uuid4()), "name": "Grundfos SCALA2 3-45", "brand": "Grundfos", "category": "Booster Pumps", "category_slug": "booster-pumps", "price": 15800.00, "original_price": None, "description": "The Grundfos SCALA2 is a fully integrated water booster pump providing perfect water pressure. With its intelligent pump control, it ensures constant pressure regardless of inlet conditions. Built-in sensor technology and water-cooled motor for whisper-quiet operation.", "short_description": "Intelligent water booster pump with constant pressure, 0.55kW", "specs": {"power": "0.55 kW", "voltage": "220V", "max_flow": "45 L/min", "max_head": "45m", "inlet_outlet": "1 inch", "weight": "9.5 kg"}, "images": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600"], "featured": True, "in_stock": True, "tags": ["booster", "intelligent", "constant pressure"]},
        {"id": str(uuid.uuid4()), "name": "Zilmet Magic Box 0.65kW", "brand": "Zilmet", "category": "Booster Pumps", "category_slug": "booster-pumps", "price": 7176.00, "original_price": 11960.00, "description": "Zilmet Magic Box intelligent and efficient 0.65kW 220V booster system maintaining constant pressure water supply. Average energy saving of more than 30% compared to same power asynchronous motor. Compact all-in-one design.", "short_description": "Intelligent booster system, 0.65kW 220V, 30% energy saving", "specs": {"power": "0.65 kW", "voltage": "220V", "max_flow": "60 L/min", "max_head": "42m", "inlet_outlet": "1 inch", "weight": "15 kg"}, "images": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600"], "featured": False, "in_stock": True, "tags": ["booster", "energy saving", "compact"]},
        {"id": str(uuid.uuid4()), "name": "Pascali PM45 Peripheral Pump", "brand": "Pascali", "category": "Booster Pumps", "category_slug": "booster-pumps", "price": 2450.00, "original_price": None, "description": "Pascali PM45 peripheral booster pump suitable for clean water domestic boosting. Reliable and affordable solution for basic pressure boosting needs. Cast iron body with brass impeller for durability.", "short_description": "Peripheral booster pump, 0.37kW, affordable domestic solution", "specs": {"power": "0.37 kW", "voltage": "220V", "max_flow": "35 L/min", "max_head": "35m", "inlet_outlet": "1 inch", "weight": "5.2 kg"}, "images": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600"], "featured": False, "in_stock": True, "tags": ["booster", "peripheral", "affordable"]},

        # Submersible Pumps
        {"id": str(uuid.uuid4()), "name": "DAB ESYBOX Diver 55/120", "brand": "DAB", "category": "Submersible Pumps", "category_slug": "submersible-pumps", "price": 25553.00, "original_price": 34070.00, "description": "DAB Esybox Diver multi-stage electronic pump with variable speed drive for clean water. Designed for use in wells or tanks. Can be used submerged, partially submerged or on the surface. Suitable for pressurization, rainwater reuse, gardening and irrigation.", "short_description": "Multi-stage electronic submersible pump with VSD, 1.2kW", "specs": {"power": "1.2 kW", "voltage": "220V", "max_flow": "120 L/min", "max_head": "55m", "diameter": "6 inch", "cable_length": "15m"}, "images": ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600"], "featured": True, "in_stock": True, "tags": ["submersible", "variable speed", "electronic"]},
        {"id": str(uuid.uuid4()), "name": "Zilmet V250FC Dirty Water Pump", "brand": "Zilmet", "category": "Submersible Pumps", "category_slug": "submersible-pumps", "price": 2003.30, "original_price": 3082.00, "description": "0.25kW 220V submersible pump with float switch for industrial draining and emptying. Suitable for sewage treatment plants and agricultural irrigation. Max liquid temperature 40 degrees Celsius.", "short_description": "Dirty water submersible pump with float switch, 0.25kW", "specs": {"power": "0.25 kW", "voltage": "220V", "max_flow": "150 L/min", "max_head": "8m", "diameter": "3 inch", "cable_length": "10m"}, "images": ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600"], "featured": False, "in_stock": True, "tags": ["submersible", "dirty water", "drainage"]},
        {"id": str(uuid.uuid4()), "name": "HT HQB2500 Fountain Pump", "brand": "HT", "category": "Submersible Pumps", "category_slug": "submersible-pumps", "price": 740.60, "original_price": 846.40, "description": "HT HQB2500 submersible fountain pump with 10m cable. 55 Watts power consumption. Ideal for garden features and small water displays. 2.5m max head, 2000 L/h max flow.", "short_description": "Small submersible fountain pump, 55W, 10m cable", "specs": {"power": "55 W", "voltage": "220V", "max_flow": "33 L/min", "max_head": "2.5m", "cable_length": "10m", "weight": "1.2 kg"}, "images": ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600"], "featured": False, "in_stock": True, "tags": ["submersible", "fountain", "garden"]},

        # Borehole Pumps
        {"id": str(uuid.uuid4()), "name": "Grundfos SQFlex 2.5-2", "brand": "Grundfos", "category": "Borehole Pumps", "category_slug": "borehole-pumps", "price": 28500.00, "original_price": None, "description": "Grundfos SQFlex solar-compatible submersible borehole pump. Designed for water supply in remote areas using renewable energy. Can be powered by solar panels or wind turbines. Multi-stage centrifugal pump with built-in motor protection.", "short_description": "Solar-compatible borehole pump for remote water supply", "specs": {"power": "1.4 kW", "voltage": "30-300V DC / 90-240V AC", "max_flow": "42 L/min", "max_head": "80m", "diameter": "3 inch", "stages": "8"}, "images": ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"], "featured": True, "in_stock": True, "tags": ["borehole", "solar", "remote"]},
        {"id": str(uuid.uuid4()), "name": "DAB S4E 8M 1.5kW Borehole Pump", "brand": "DAB", "category": "Borehole Pumps", "category_slug": "borehole-pumps", "price": 9800.00, "original_price": None, "description": "DAB S4E 8M 4-inch submersible borehole pump. Suitable for domestic water supply and irrigation from boreholes. Stainless steel construction for long life. Built-in check valve and sand guard.", "short_description": "4-inch borehole pump, 1.5kW, stainless steel construction", "specs": {"power": "1.5 kW", "voltage": "220V", "max_flow": "120 L/min", "max_head": "62m", "diameter": "4 inch", "stages": "8"}, "images": ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"], "featured": False, "in_stock": True, "tags": ["borehole", "4-inch", "domestic"]},
        {"id": str(uuid.uuid4()), "name": "Pascali Deep Well 3SDM 2/14", "brand": "Pascali", "category": "Borehole Pumps", "category_slug": "borehole-pumps", "price": 5200.00, "original_price": 6100.00, "description": "Pascali 3-inch deep well submersible pump. 14-stage multi-stage pump for medium depth boreholes. Ideal for domestic water supply and small-scale irrigation. Includes 30m submersible cable.", "short_description": "3-inch deep well pump, 14 stages, includes 30m cable", "specs": {"power": "0.55 kW", "voltage": "220V", "max_flow": "30 L/min", "max_head": "70m", "diameter": "3 inch", "stages": "14"}, "images": ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"], "featured": False, "in_stock": True, "tags": ["borehole", "3-inch", "deep well"]},

        # Self-Priming Pumps
        {"id": str(uuid.uuid4()), "name": "Zilmet ZIL 10H Self-Priming System", "brand": "Zilmet", "category": "Self-Priming Pumps", "category_slug": "self-priming-pumps", "price": 3019.90, "original_price": 4646.00, "description": "Zilmet ZIL 10H + ZIL01 Controller 0.75kW 220V automatic booster pump. Delivers 50 L/min max and 5.1 bar max operating pressure. Ideal for 2-3 taps simultaneously. Assembly required.", "short_description": "Automatic self-priming booster, 0.75kW, 50 L/min max", "specs": {"power": "0.75 kW", "voltage": "220V", "max_flow": "50 L/min", "max_pressure": "5.1 bar", "suction_depth": "8m", "weight": "11 kg"}, "images": ["https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600"], "featured": True, "in_stock": True, "tags": ["self-priming", "automatic", "domestic"]},
        {"id": str(uuid.uuid4()), "name": "DAB JET 132M Self-Priming", "brand": "DAB", "category": "Self-Priming Pumps", "category_slug": "self-priming-pumps", "price": 4850.00, "original_price": None, "description": "DAB JET 132M self-priming centrifugal pump. Cast iron body with technopolymer impeller. Suitable for domestic water supply, irrigation, and pressure boosting from rainwater tanks.", "short_description": "Self-priming centrifugal pump, 1kW, cast iron body", "specs": {"power": "1.0 kW", "voltage": "220V", "max_flow": "80 L/min", "max_head": "48m", "suction_depth": "8m", "weight": "9.8 kg"}, "images": ["https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600"], "featured": False, "in_stock": True, "tags": ["self-priming", "centrifugal", "irrigation"]},

        # Water Tanks
        {"id": str(uuid.uuid4()), "name": "JoJo 2500L Vertical Tank", "brand": "JoJo", "category": "Water Tanks", "category_slug": "water-tanks", "price": 4200.00, "original_price": None, "description": "JoJo 2500 litre vertical water storage tank. UV-stabilized polyethylene construction. Suitable for rainwater harvesting and domestic backup water storage. Includes inlet strainer and overflow fitting.", "short_description": "2500L vertical tank, UV-stabilized, rainwater harvesting", "specs": {"capacity": "2500 L", "diameter": "1420mm", "height": "1760mm", "material": "Polyethylene", "colour": "Green", "warranty": "8 years"}, "images": ["https://images.unsplash.com/photo-1638294834907-d11608bc11d2?w=600"], "featured": True, "in_stock": True, "tags": ["tank", "vertical", "rainwater"]},
        {"id": str(uuid.uuid4()), "name": "JoJo 5000L Vertical Tank", "brand": "JoJo", "category": "Water Tanks", "category_slug": "water-tanks", "price": 6800.00, "original_price": None, "description": "JoJo 5000 litre vertical water storage tank. Heavy-duty UV-stabilized polyethylene. Ideal for larger households and commercial backup water storage. Fitted with brass outlet and overflow.", "short_description": "5000L vertical tank, heavy-duty, brass fittings", "specs": {"capacity": "5000 L", "diameter": "1800mm", "height": "2200mm", "material": "Polyethylene", "colour": "Green", "warranty": "8 years"}, "images": ["https://images.unsplash.com/photo-1638294834907-d11608bc11d2?w=600"], "featured": False, "in_stock": True, "tags": ["tank", "vertical", "large"]},
        {"id": str(uuid.uuid4()), "name": "JoJo 10000L Vertical Tank", "brand": "JoJo", "category": "Water Tanks", "category_slug": "water-tanks", "price": 12500.00, "original_price": 13800.00, "description": "JoJo 10000 litre vertical water storage tank. Premium grade polyethylene with UV stabilization. Perfect for farm use, large households, and commercial installations. Multiple inlet/outlet options.", "short_description": "10000L vertical tank, premium grade, multi-use", "specs": {"capacity": "10000 L", "diameter": "2300mm", "height": "2600mm", "material": "Polyethylene", "colour": "Green", "warranty": "8 years"}, "images": ["https://images.unsplash.com/photo-1638294834907-d11608bc11d2?w=600"], "featured": False, "in_stock": True, "tags": ["tank", "vertical", "farm", "commercial"]},
        {"id": str(uuid.uuid4()), "name": "Slimline 1000L Tank", "brand": "JoJo", "category": "Water Tanks", "category_slug": "water-tanks", "price": 3200.00, "original_price": None, "description": "JoJo 1000 litre slimline water tank. Space-saving design perfect for narrow areas and against walls. UV-stabilized polyethylene construction with 8-year warranty.", "short_description": "1000L slimline tank, space-saving design", "specs": {"capacity": "1000 L", "dimensions": "1800 x 560 x 1400mm", "material": "Polyethylene", "colour": "Green", "warranty": "8 years"}, "images": ["https://images.unsplash.com/photo-1638294834907-d11608bc11d2?w=600"], "featured": False, "in_stock": True, "tags": ["tank", "slimline", "space-saving"]},
        {"id": str(uuid.uuid4()), "name": "DAB E.Sysolution Tank & Pump", "brand": "DAB", "category": "Water Tanks", "category_slug": "water-tanks", "price": 17940.00, "original_price": 21160.00, "description": "DAB E.Sysolution complete backup water solution. Includes E.SYBOX mini 0.8kW 220V pump and 1100L water tank with internal plumbing. Plug-and-play system for immediate backup water.", "short_description": "Complete tank & pump backup solution, 1100L with E.SYBOX", "specs": {"tank_capacity": "1100 L", "pump_power": "0.8 kW", "voltage": "220V", "max_flow": "80 L/min", "max_head": "55m"}, "images": ["https://images.unsplash.com/photo-1638294834907-d11608bc11d2?w=600"], "featured": True, "in_stock": True, "tags": ["tank", "pump", "complete solution", "backup"]},

        # Accessories
        {"id": str(uuid.uuid4()), "name": "Pressure Control Switch", "brand": "Pascali", "category": "Accessories", "category_slug": "accessories", "price": 450.00, "original_price": None, "description": "Automatic pressure control switch for water pumps. Adjustable cut-in and cut-out pressures. Protects pump from dry running. Compatible with most domestic pump systems.", "short_description": "Auto pressure switch, adjustable, dry-run protection", "specs": {"cut_in": "1.5 bar", "cut_out": "3.0 bar", "max_pressure": "6 bar", "connection": "1/4 inch BSP"}, "images": ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600"], "featured": False, "in_stock": True, "tags": ["accessory", "pressure switch", "control"]},
        {"id": str(uuid.uuid4()), "name": "24L Pressure Vessel", "brand": "Zilmet", "category": "Accessories", "category_slug": "accessories", "price": 1250.00, "original_price": None, "description": "Zilmet 24 litre pressure vessel / expansion tank. Pre-charged to 1.5 bar. Suitable for use with booster pump systems to reduce pump cycling and maintain consistent pressure.", "short_description": "24L pressure vessel, reduces pump cycling", "specs": {"capacity": "24 L", "pre_charge": "1.5 bar", "max_pressure": "10 bar", "connection": "1 inch BSP", "material": "Steel with rubber membrane"}, "images": ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600"], "featured": False, "in_stock": True, "tags": ["accessory", "pressure vessel", "expansion tank"]},
    ]
    await db.products.insert_many(products)
    return {"message": f"Seeded {len(products)} products and {len(categories)} categories"}

# ─── Health ───

@api_router.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
