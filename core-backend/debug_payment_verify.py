import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_backend.settings')
import django

django.setup()

from django.contrib.auth.models import User
from core_api.models import PaymentTransaction
from rest_framework.test import APIRequestFactory, force_authenticate
from core_api.views import PaymentVerifyView


user = User.objects.create_user('paytwo', 'paytwo@example.com', 'secret123')
transaction = PaymentTransaction.objects.create(
    user=user,
    plan='standard',
    amount='5000',
    provider='paystack',
    provider_reference='mock-ref',
    status='PENDING',
)

factory = APIRequestFactory()
request = factory.post('/api/payments/verify/', {'reference': transaction.provider_reference}, format='json')
force_authenticate(request, user=user)

try:
    response = PaymentVerifyView.as_view()(request)
    print('status', response.status_code)
    if hasattr(response, 'data'):
        print('data:', response.data)
    else:
        print('content:', response.content.decode('utf-8', errors='replace'))
except Exception as exc:
    import traceback

    print('EXCEPTION:')
    traceback.print_exc()
