from django.test import TestCase
from rest_framework.test import APIClient

from .models import InspectionBooking, Property


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
