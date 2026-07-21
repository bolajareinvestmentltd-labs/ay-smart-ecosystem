import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_backend.settings')
django.setup()

from core_api.models import BranchLocation, Property, Vehicle

print("🌱 Seeding AY'SMART Ecosystem with test data...")

# 1. Create or Get Default Branch Location
branch, _ = BranchLocation.objects.get_or_create(
    name="Victoria Island HQ",
    defaults={
        "address": "15 Ozumba Mbadiwe Ave, Victoria Island, Lagos",
        "contact_phone": "+234 800 AYSMART"
    }
)

# 2. Seed Luxury Real Estate Properties
properties_data = [
    {
        "title": "5-Bedroom Luxury Smart Duplex",
        "property_type": "RESIDENTIAL",
        "price": "850000000.00",
        "location_address": "Lekki Phase 1, Lagos Nigeria",
        "is_for_lease": False,
        "virtual_tour_url": "https://my.matterport.com/show/?m=sample1",
        "main_image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "is_available": True
    },
    {
        "title": "1000sqm Beachfront Commercial Land",
        "property_type": "COMMERCIAL",
        "price": "1200000000.00",
        "location_address": "Eko Atlantic City, Lagos",
        "is_for_lease": False,
        "virtual_tour_url": None,
        "main_image_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "is_available": True
    },
    {
        "title": "4-Bedroom Penthouse with Marina View",
        "property_type": "RESIDENTIAL",
        "price": "15000000.00",
        "location_address": "Banana Island, Ikoyi",
        "is_for_lease": True,
        "virtual_tour_url": "https://my.matterport.com/show/?m=sample2",
        "main_image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        "is_available": True
    },
    {
        "title": "Executive 3-Bed Mini Duplex",
        "property_type": "RESIDENTIAL",
        "price": "350000000.00",
        "location_address": "Ikeja GRA, Lagos",
        "is_for_lease": False,
        "virtual_tour_url": None,
        "main_image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "is_available": True
    }
]

for p_data in properties_data:
    Property.objects.get_or_create(title=p_data["title"], defaults=p_data)

# 3. Seed Automotive Luxury Fleet
vehicles_data = [
    {
        "title": "Mercedes-Benz G63 AMG (Armored)",
        "brand": "Mercedes-Benz",
        "model_year": 2025,
        "outright_price": "450000000.00",
        "daily_hire_rate": "1500000.00",
        "status": "AVAILABLE",
        "main_image_url": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
        "assigned_branch": branch
    },
    {
        "title": "Rolls-Royce Cullinan Series II",
        "brand": "Rolls-Royce",
        "model_year": 2025,
        "outright_price": "1100000000.00",
        "daily_hire_rate": "3000000.00",
        "status": "AVAILABLE",
        "main_image_url": "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80",
        "assigned_branch": branch
    },
    {
        "title": "Lexus LX 600 VIP Executive",
        "brand": "Lexus",
        "model_year": 2024,
        "outright_price": "280000000.00",
        "daily_hire_rate": "800000.00",
        "status": "AVAILABLE",
        "main_image_url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
        "assigned_branch": branch
    },
    {
        "title": "Range Rover SV Autobiography",
        "brand": "Land Rover",
        "model_year": 2025,
        "outright_price": "380000000.00",
        "daily_hire_rate": "1200000.00",
        "status": "AVAILABLE",
        "main_image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
        "assigned_branch": branch
    }
]

for v_data in vehicles_data:
    Vehicle.objects.get_or_create(title=v_data["title"], defaults=v_data)

print("✅ Seeding complete! Database is now hydrated with luxury assets.")
