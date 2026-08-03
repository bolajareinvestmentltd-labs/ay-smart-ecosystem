import os
import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from core_api.models import Property, PropertyImage


class Command(BaseCommand):
    help = 'Seed PropertyImage entries for properties that have none and store images locally in MEDIA_ROOT.'

    def add_arguments(self, parser):
        parser.add_argument('--per-property', type=int, default=3, help='Number of images to add per property')

    def download_image(self, url):
        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            return response.content
        except Exception:
            return None

    def handle(self, *args, **options):
        per_property = options.get('per_property') or 3
        total_created = 0

        for prop in Property.objects.all():
            if prop.images.exists():
                continue

            source_urls = []
            if getattr(prop, 'main_image_url', None):
                source_urls.append(prop.main_image_url)

            while len(source_urls) < per_property:
                source_urls.append(f'https://picsum.photos/1200/800?random={len(source_urls) + 1}')

            for order, source_url in enumerate(source_urls):
                image_data = self.download_image(source_url)
                if image_data:
                    image_name = f'{prop.id}_{order}_{os.path.basename(source_url.split("?")[0]) or "image"}.jpg'
                    property_image = PropertyImage(property=prop, caption=(prop.title if order == 0 else ''), order=order)
                    property_image.image.save(image_name, ContentFile(image_data), save=True)
                    total_created += 1
                else:
                    PropertyImage.objects.create(property=prop, url=source_url, caption=(prop.title if order == 0 else ''), order=order)
                    total_created += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {total_created} PropertyImage records.'))
