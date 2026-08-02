from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from django.contrib.auth.models import User

from .models import InspectionBooking, Listing, PaymentTransaction, Property, Referral, SupportRequest, UserProfile, Wallet, WalletTransaction
from .views import send_verification_email


class InspectionBookingApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.property = Property.objects.create(
            title="Skyline Villa",
            property_type="RESIDENTIAL",
            price="500000000",
            location_address="Lekki Phase 1",
            virtual_tour_url="https://example.com/tour",
            main_image_url="https://example.com/image.jpg",
        )

    def test_public_can_create_inspection_booking_with_frontend_payload(self):
        response = self.client.post(
            "/api/inspections/",
            {
                "property": self.property.id,
                "client_name": "Ada Lovelace",
                "client_phone": "+2348000000000",
                "preferred_date": "2026-08-20",
                "status": "PENDING",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        booking = InspectionBooking.objects.get(client_name="Ada Lovelace")
        self.assertEqual(booking.property_to_view, self.property)
        self.assertEqual(booking.scheduled_date.date().isoformat(), "2026-08-20")
        self.assertEqual(booking.status, "PENDING")


class ReferralWalletTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_wallet_is_created_when_user_is_created(self):
        user = User.objects.create_user(username="newuser", email="new@example.com", password="secret123")

        self.assertTrue(Wallet.objects.filter(user=user).exists())

    def test_pending_referral_is_confirmed_when_matching_user_signs_up(self):
        referrer = User.objects.create_user(username="referrer", email="referrer@example.com", password="secret123")
        referral = Referral.objects.create(referrer=referrer, referred_email="new@example.com")

        User.objects.create_user(username="newuser", email="new@example.com", password="secret123")

        referral.refresh_from_db()
        referrer.refresh_from_db()
        self.assertEqual(referral.status, "CONFIRMED")
        self.assertEqual(referrer.wallet.balance, 200.00)

    def test_authenticated_user_can_create_wallet_transaction(self):
        user = User.objects.create_user(username="walletuser", email="wallet@example.com", password="secret123")
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/wallets/transactions/",
            {
                "amount": "-150.00",
                "kind": "DEBIT",
                "description": "Inspection booking",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        wallet = Wallet.objects.get(user=user)
        self.assertEqual(wallet.balance, -150.00)
        self.assertTrue(WalletTransaction.objects.filter(user=user, description="Inspection booking").exists())

    def test_registration_endpoint_creates_user_and_wallet(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "newreg",
                "email": "newreg@example.com",
                "password": "secret123",
                "first_name": "New",
                "last_name": "Reg",
                "phone": "+2348000000000",
                "location": "Lagos",
                "role": "student",
                "matric_number": "20231001",
                "student_email": "student@example.com",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(User.objects.filter(username="newreg").exists())
        self.assertTrue(Wallet.objects.filter(user__username="newreg").exists())
        profile = UserProfile.objects.get(user__username="newreg")
        self.assertEqual(profile.role, "student")
        self.assertEqual(profile.phone, "+2348000000000")
        self.assertEqual(profile.location, "Lagos")

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    @patch('core_api.views.send_mail')
    def test_verification_email_uses_resend_configured_sender(self, mock_send_mail):
        user = User.objects.create_user(username='resendtest', email='resendtest@example.com', password='secret123')

        send_verification_email(user)

        self.assertTrue(mock_send_mail.called)
        args, kwargs = mock_send_mail.call_args
        self.assertEqual(args[2], 'noreply@resend.dev')
        self.assertIn('verify your', args[0].lower())

    def test_password_reset_endpoint_updates_user_password(self):
        user = User.objects.create_user(username='resetuser', email='resetuser@example.com', password='oldsecret123')

        response = self.client.post(
            '/api/auth/password-reset/',
            {
                'email': 'resetuser@example.com',
                'new_password': 'newsecret456',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200, response.data)
        user.refresh_from_db()
        self.assertTrue(user.check_password('newsecret456'))

    def test_support_request_can_be_created(self):
        response = self.client.post(
            "/api/support/requests/",
            {
                "name": "Ada Lovelace",
                "email": "ada@example.com",
                "phone": "+2348000000000",
                "category": "complaint",
                "subject": "Payment issue",
                "message": "I need help with my subscription.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(SupportRequest.objects.filter(subject="Payment issue").exists())

    def test_authenticated_user_can_update_profile_and_create_listing(self):
        user = User.objects.create_user(username="profileuser", email="profile@example.com", password="secret123")
        self.client.force_authenticate(user=user)

        profile_response = self.client.put(
            "/api/auth/profile/",
            {
                "phone": "+2348000000000",
                "location": "Lekki Phase 1",
                "role": "agent",
            },
            format="json",
        )

        self.assertEqual(profile_response.status_code, 200, profile_response.data)

        listing_response = self.client.post(
            "/api/listings/",
            {
                "title": "Luxury Villa",
                "category": "Property",
                "location": "Lekki",
                "price": "5000000",
                "plan": "basic",
                "duration_days": 30,
            },
            format="json",
        )

        self.assertEqual(listing_response.status_code, 201, listing_response.data)
        self.assertTrue(Listing.objects.filter(user=user).exists())

    def test_checkout_debits_wallet_and_updates_subscription(self):
        user = User.objects.create_user(username="payuser", email="pay@example.com", password="secret123")
        wallet = Wallet.objects.get(user=user)
        wallet.credit(Decimal("10000.00"), reason="Top up")
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/payments/checkout/",
            {
                "plan": "basic",
                "amount": "3500",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal("6500.00"))

    def test_authenticated_user_can_approve_kyc(self):
        user = User.objects.create_user(username="kycuser", email="kyc@example.com", password="secret123")
        self.client.force_authenticate(user=user)

        response = self.client.post("/api/kyc/approve/", format="json")

        self.assertEqual(response.status_code, 200, response.data)
        profile = UserProfile.objects.get(user=user)
        self.assertTrue(profile.is_kyc_verified)
        self.assertTrue(profile.is_admin_approved)

    def test_staff_user_can_review_listing(self):
        owner = User.objects.create_user(username="owner", email="owner@example.com", password="secret123")
        admin = User.objects.create_user(username="admin", email="admin@example.com", password="secret123", is_staff=True)
        listing = Listing.objects.create(
            user=owner,
            title="Approved Villa",
            category="Property",
            location="Lekki",
            price="5000000",
            plan="basic",
            duration_days=30,
        )
        self.client.force_authenticate(user=admin)

        response = self.client.post(
            f"/api/listings/{listing.id}/review/",
            {"decision": "APPROVE"},
            format="json",
        )

        self.assertEqual(response.status_code, 200, response.data)
        listing.refresh_from_db()
        self.assertEqual(listing.status, "LIVE")

    def test_authenticated_user_can_initiate_provider_payment(self):
        user = User.objects.create_user(username="payone", email="payone@example.com", password="secret123")
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/payments/initiate/",
            {"plan": "basic", "amount": "3500"},
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(PaymentTransaction.objects.filter(user=user, plan="basic").exists())

    def test_authenticated_user_can_verify_provider_payment(self):
        user = User.objects.create_user(username="paytwo", email="paytwo@example.com", password="secret123")
        transaction = PaymentTransaction.objects.create(
            user=user,
            plan="standard",
            amount="5000",
            provider="paystack",
            provider_reference="mock-ref",
            status="PENDING",
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/payments/verify/",
            {"reference": transaction.provider_reference},
            format="json",
        )

        self.assertEqual(response.status_code, 200, response.data)
        transaction.refresh_from_db()
        self.assertEqual(transaction.status, "SUCCESS")

    def test_referral_reward_issued_on_first_successful_payment(self):
        referrer = User.objects.create_user(username="refpay_ref", email="refpay_ref@example.com", password="secret123")
        referral = Referral.objects.create(referrer=referrer, referred_email="newpayer@example.com")

        # Create the referred user which should confirm the referral and credit initial referral bonus
        referred = User.objects.create_user(username="newpayer", email="newpayer@example.com", password="secret123")
        referral.refresh_from_db()
        referrer.refresh_from_db()
        # initial referral credit
        self.assertEqual(referrer.wallet.balance, Decimal('200.00'))

        # create a pending payment for the referred user
        tx = PaymentTransaction.objects.create(user=referred, plan="basic", amount="3500", provider="paystack", provider_reference="refpay-ref-1", status="PENDING")
        self.client.force_authenticate(user=referred)

        resp = self.client.post("/api/payments/verify/", {"reference": tx.provider_reference}, format="json")
        self.assertEqual(resp.status_code, 200)

        # referrer should receive an additional one-time reward
        referrer.wallet.refresh_from_db()
        self.assertEqual(referrer.wallet.balance, Decimal('700.00'))
        referral.refresh_from_db()
        self.assertTrue(referral.rewarded)

    def test_payment_verify_is_idempotent_and_credits_only_once(self):
        user = User.objects.create_user(username="idempotent", email="idem@example.com", password="secret123")
        # ensure initial wallet balance is zero
        wallet = Wallet.objects.get(user=user)
        self.assertEqual(wallet.balance, 0)

        transaction = PaymentTransaction.objects.create(
            user=user,
            plan="basic",
            amount="3500",
            provider="paystack",
            provider_reference="idem-ref",
            status="PENDING",
        )
        self.client.force_authenticate(user=user)

        # first verification should succeed and credit wallet
        resp1 = self.client.post("/api/payments/verify/", {"reference": transaction.provider_reference}, format="json")
        self.assertEqual(resp1.status_code, 200)
        transaction.refresh_from_db()
        self.assertEqual(transaction.status, "SUCCESS")
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal('3500.00'))

        # second verification should be safe (no duplicate credit)
        resp2 = self.client.post("/api/payments/verify/", {"reference": transaction.provider_reference}, format="json")
        self.assertEqual(resp2.status_code, 200)
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal('3500.00'))

    def test_initiate_payment_rejects_invalid_amounts(self):
        user = User.objects.create_user(username="badamt", email="badamt@example.com", password="secret123")
        self.client.force_authenticate(user=user)

        # zero amount
        resp_zero = self.client.post("/api/payments/initiate/", {"plan": "basic", "amount": "0"}, format="json")
        self.assertEqual(resp_zero.status_code, 400)

        # negative amount
        resp_neg = self.client.post("/api/payments/initiate/", {"plan": "basic", "amount": "-100"}, format="json")
        self.assertEqual(resp_neg.status_code, 400)
