from decimal import Decimal
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit

from django.test import TestCase, override_settings
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from django.contrib.auth.models import User

from .models import InspectionBooking, Listing, PaymentTransaction, Property, Referral, SupportRequest, UserProfile, Wallet, WalletTransaction, HostelBooking
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

    def test_authenticated_user_can_create_hostel_booking_with_frontend_payload(self):
        user = User.objects.create_user(username="hostelbuyer", email="hostel@example.com", password="secret123")
        self.client.force_authenticate(user=user)
        listing = Listing.objects.create(
            user=user,
            title="Student Bay Hostel",
            category='Hostel',
            location='Abuja',
            price='200000',
            service_fee='1500',
            description='Good accommodation',
            status='LIVE',
        )

        response = self.client.post(
            "/api/hostel-bookings/",
            {
                "listing": listing.id,
                "hostel_id": listing.id,
                "student_name": "Ada Lovelace",
                "student_phone": "+2348000000000",
                "check_in_date": "2026-08-20",
                "student_email": "ada@example.com",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        booking = HostelBooking.objects.get(student_name="Ada Lovelace")
        self.assertEqual(booking.listing, listing)
        self.assertEqual(booking.total_amount, 201500)


class ReferralWalletTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch('core_api.views.requests.post')
    @override_settings(DOJAH_APP_ID='test-app', DOJAH_SECRET_KEY='test-secret', DOJAH_FACE_MATCH_THRESHOLD=85)
    def test_verified_seller_is_auto_approved_but_listing_stays_pending(self, provider_post):
        provider_post.return_value.ok = True
        provider_post.return_value.json.return_value = {
            'entity': {'selfie_verification': {'match': True, 'confidence_value': 97.4}}
        }
        user = User.objects.create_user(username='verifiedseller', email='seller@example.com', password='secret123')
        profile = user.profile
        profile.role = 'seller'
        profile.identity_document_type = 'Voters Card'
        profile.identity_document_number = 'VC-001'
        profile.identity_document = SimpleUploadedFile('voters-card.jpg', b'fake-image', content_type='image/jpeg')
        profile.save(update_fields=['role', 'identity_document_type', 'identity_document_number', 'identity_document'])
        self.client.force_authenticate(user=user)

        response = self.client.post(
            '/api/kyc/approve/',
            {'nin': '70123456789', 'selfie_image': 'data:image/jpeg;base64,ZmFrZQ==', 'identity_document_type': 'Voters Card', 'identity_document_number': 'VC-001'},
            format='json',
        )

        self.assertEqual(response.status_code, 200, response.data)
        profile.refresh_from_db()
        self.assertTrue(profile.is_kyc_verified)
        self.assertTrue(profile.is_admin_approved)
        self.assertEqual(profile.kyc_status, 'VERIFIED')
        self.assertEqual(profile.kyc_face_match_score, Decimal('97.40'))

        listing = Listing.objects.create(
            user=user,
            title='Pending Seller Listing',
            category='Property',
            location='Lagos',
            price='1000000',
        )
        self.assertEqual(listing.status, 'PENDING')
        self.assertEqual(self.client.get('/api/listings/published/').status_code, 200)
        self.assertFalse(any(item['id'] == listing.id for item in self.client.get('/api/listings/published/').data))

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

    def test_authenticated_user_cannot_create_wallet_transaction(self):
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

        self.assertEqual(response.status_code, 403, response.data)
        wallet = Wallet.objects.get(user=user)
        self.assertEqual(wallet.balance, 0)
        self.assertFalse(WalletTransaction.objects.filter(user=user, description="Inspection booking").exists())

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

    def test_identity_documents_are_staff_only(self):
        user = User.objects.create_user(username='documentowner', email='documentowner@example.com', password='secret123')
        profile = UserProfile.objects.get(user=user)

        anonymous_response = self.client.get(f'/api/admin/identity-documents/{profile.id}/identity/')
        self.assertIn(anonymous_response.status_code, {401, 403})

        self.client.force_authenticate(user=user)
        user_response = self.client.get(f'/api/admin/identity-documents/{profile.id}/identity/')
        self.assertEqual(user_response.status_code, 403)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    @patch('core_api.views.send_mail')
    def test_verification_email_uses_resend_configured_sender(self, mock_send_mail):
        user = User.objects.create_user(username='resendtest', email='resendtest@example.com', password='secret123')

        send_verification_email(user)

        self.assertTrue(mock_send_mail.called)
        args, kwargs = mock_send_mail.call_args
        self.assertEqual(args[2], settings.DEFAULT_FROM_EMAIL)
        self.assertIn('verify your', args[0].lower())
        self.assertIn('SMART VERIFY', kwargs['html_message'])
        self.assertIn('/auth/verify-email?uid=', kwargs['html_message'])

    @patch('core_api.views.send_mail')
    def test_password_reset_endpoint_updates_user_password(self, mock_send_mail):
        user = User.objects.create_user(username='resetuser', email='resetuser@example.com', password='oldsecret123')

        response = self.client.post(
            '/api/auth/password-reset/',
            {
                'email': 'resetuser@example.com',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(mock_send_mail.called)
        reset_message = mock_send_mail.call_args.args[1]
        reset_url = next(line for line in reset_message.splitlines() if 'uid=' in line and 'token=' in line)
        reset_parts = parse_qs(urlsplit(reset_url).query)
        response = self.client.post(
            '/api/auth/password-reset/',
            {'uid': reset_parts['uid'][0], 'token': reset_parts['token'][0], 'new_password': 'newsecret456'},
            format='json',
        )
        self.assertEqual(response.status_code, 200, response.data)
        user.refresh_from_db()
        self.assertTrue(user.check_password('newsecret456'))

    def test_authenticated_user_can_delete_account_with_confirmation(self):
        user = User.objects.create_user(username='deleteuser', email='delete@example.com', password='secret123')
        self.client.force_authenticate(user=user)

        response = self.client.delete('/api/auth/profile/', {'confirmation': 'DELETE'}, format='json')

        self.assertEqual(response.status_code, 204, response.data)
        self.assertFalse(User.objects.filter(pk=user.pk).exists())

    def test_invalid_refresh_cookie_returns_session_expired_message(self):
        self.client.cookies['refresh'] = 'not.a.valid.jwt'

        response = self.client.post('/api/auth/refresh-cookie/', format='json')

        self.assertEqual(response.status_code, 401, response.data)
        self.assertEqual(response.data.get('detail'), 'Session expired. Please sign in again.')

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
        profile = UserProfile.objects.get(user=user)
        profile.is_kyc_verified = True
        profile.is_admin_approved = True
        profile.kyc_status = 'VERIFIED'
        profile.save()

        image_file = SimpleUploadedFile(
            "test.jpg",
            b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xFF\xFF\xFF\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3B",
            content_type="image/gif",
        )

        listing_response = self.client.post(
            "/api/listings/",
            {
                "title": "Luxury Villa",
                "category": "Property",
                "location": "Lekki",
                "price": "5000000",
                "plan": "basic",
                "duration_days": 30,
                "images": [image_file, image_file, image_file, image_file, image_file],
            },
            format="multipart",
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

    def test_authenticated_user_can_submit_kyc_for_admin_review(self):
        user = User.objects.create_user(username="kycuser", email="kyc@example.com", password="secret123")
        profile = UserProfile.objects.get(user=user)
        profile.role = 'student'
        profile.student_matric_number = 'MAT-001'
        profile.student_email = 'student@school.example'
        profile.student_id_image = SimpleUploadedFile('student-id.jpg', b'fake-image', content_type='image/jpeg')
        profile.save(update_fields=['role', 'student_matric_number', 'student_email', 'student_id_image'])
        self.client.force_authenticate(user=user)

        response = self.client.post("/api/kyc/approve/", format="json")

        self.assertEqual(response.status_code, 202, response.data)
        profile.refresh_from_db()
        self.assertFalse(profile.is_kyc_verified)
        self.assertFalse(profile.is_admin_approved)
        self.assertEqual(profile.kyc_status, 'PENDING')

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

    @override_settings(PAYSTACK_SECRET_KEY='', PAYSTACK_PUBLIC_KEY='')
    def test_authenticated_user_cannot_initiate_unconfigured_provider_payment(self):
        user = User.objects.create_user(username="payone", email="payone@example.com", password="secret123")
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/payments/initiate/",
            {"plan": "basic", "amount": "3500"},
            format="json",
        )

        self.assertEqual(response.status_code, 503, response.data)
        self.assertFalse(PaymentTransaction.objects.filter(user=user, plan="basic").exists())

    @patch('core_api.views.requests.get')
    def test_authenticated_user_can_verify_provider_payment(self, mock_get):
        mock_get.return_value.ok = True
        mock_get.return_value.json.return_value = {'data': {'status': 'success'}}
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

    @patch('core_api.views.requests.get')
    def test_referral_reward_issued_on_first_successful_payment(self, mock_get):
        mock_get.return_value.ok = True
        mock_get.return_value.json.return_value = {'data': {'status': 'success'}}
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

    @patch('core_api.views.requests.get')
    def test_payment_verify_is_idempotent_and_credits_only_once(self, mock_get):
        mock_get.return_value.ok = True
        mock_get.return_value.json.return_value = {'data': {'status': 'success'}}
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

    def test_student_kyc_approval_requires_student_fields(self):
        user = User.objects.create_user(username="studuser", email="stud@example.com", password="secret123")
        profile = UserProfile.objects.get(user=user)
        profile.role = "student"
        profile.save()
        self.client.force_authenticate(user=user)

        response = self.client.post("/api/kyc/approve/", format="json")
        self.assertEqual(response.status_code, 400, response.data)
        self.assertIn("matric number", str(response.data.get("detail", "")).lower())

    def test_listing_creation_requires_at_least_five_images(self):
        user = User.objects.create_user(username="listingimg", email="listingimg@example.com", password="secret123")
        profile = UserProfile.objects.get(user=user)
        profile.role = 'agent'
        profile.is_kyc_verified = True
        profile.is_admin_approved = True
        profile.kyc_status = 'VERIFIED'
        profile.save()
        self.client.force_authenticate(user=user)

        image_file = SimpleUploadedFile(
            "test.jpg",
            b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xFF\xFF\xFF\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3B",
            content_type="image/gif",
        )

        response = self.client.post(
            "/api/listings/",
            {
                "title": "Luxury Villa",
                "category": "Property",
                "location": "Lekki",
                "price": "5000000",
                "plan": "basic",
                "duration_days": 30,
                "images": [image_file, image_file, image_file, image_file],
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertIn("at least 5", str(response.data.get("detail", "")).lower())

    def test_authenticated_user_can_upload_property_image(self):
        user = User.objects.create_user(username="imageuser", email="image@example.com", password="secret123")
        self.client.force_authenticate(user=user)
        property_obj = Property.objects.create(
            title="Image Villa",
            property_type="RESIDENTIAL",
            price="2500000",
            location_address="Ikoyi",
            virtual_tour_url="https://example.com/tour",
            main_image_url="https://example.com/main.jpg",
        )

        image_file = SimpleUploadedFile(
            "test.jpg",
            b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xFF\xFF\xFF\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3B",
            content_type="image/gif",
        )

        response = self.client.post(
            f"/api/properties/{property_obj.id}/upload_image/",
            {"image": image_file},
            format="multipart",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(property_obj.images.filter(image__isnull=False).exists())


class MarketplaceFoundationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='marketuser', email='market@example.com', password='secret123')
        self.listing = Listing.objects.create(
            user=self.user,
            title='Beachfront Plot',
            category='Property',
            location='Lekki',
            price='25000000',
            plan='standard',
            duration_days=30,
            status='LIVE',
        )

    def test_user_can_create_saved_search(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/saved-searches/', {
            'name': 'Lekki duplex',
            'location': 'Lekki',
            'property_type': 'RESIDENTIAL',
            'min_price': '20000000',
            'max_price': '50000000',
        }, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(response.data['id'])

    def test_user_can_toggle_favorite_and_hidden_listing(self):
        self.client.force_authenticate(user=self.user)
        fav = self.client.post('/api/favorites/', {'listing': self.listing.id}, format='json')
        self.assertEqual(fav.status_code, 201, fav.data)
        hidden = self.client.post('/api/hidden-listings/', {'listing': self.listing.id}, format='json')
        self.assertEqual(hidden.status_code, 201, hidden.data)

    def test_user_can_start_inbox_conversation(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/conversations/', {
            'subject': 'Question on listing',
            'listing': self.listing.id,
            'message': 'Can I arrange a viewing this week?'
        }, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['subject'], 'Question on listing')
