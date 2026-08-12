import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_backend.settings')

import django
from django.contrib.auth import get_user_model

django.setup()

User = get_user_model()

username = os.getenv('ADMIN_USERNAME', 'admin')
email = os.getenv('ADMIN_EMAIL', 'admin@aysmartinvestmentltd.com')
password = os.getenv('ADMIN_PASSWORD')

if not password:
    try:
        import getpass
        password = getpass.getpass(f'Password for admin user "{username}": ')
    except Exception:
        password = input(f'Password for admin user "{username}": ')

if not password:
    print('Error: password is required.')
    sys.exit(1)

user, created = User.objects.get_or_create(username=username, defaults={'email': email, 'is_superuser': True, 'is_staff': True})
if created:
    user.set_password(password)
    user.save()
    print(f'Created admin user: {username} ({email})')
else:
    updated = False
    if not user.is_superuser or not user.is_staff:
        user.is_superuser = True
        user.is_staff = True
        updated = True
    if user.email != email:
        user.email = email
        updated = True
    if password:
        user.set_password(password)
        updated = True
    if updated:
        user.save()
        print(f'Updated existing admin user: {username}')
    else:
        print(f'Admin user already exists and was not changed: {username}')

print('Admin login ready. Use the credentials below to sign in to Django admin:')
print(f'  username: {username}')
print(f'  email:    {email}')
print('Keep the password safe and do not commit it to source control.')
