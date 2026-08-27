import os
from pathlib import Path

from django.conf import settings
from django.core.files.storage import FileSystemStorage

try:
    from cloudinary_storage.storage import MediaCloudinaryStorage
except ImportError:
    MediaCloudinaryStorage = None


if MediaCloudinaryStorage and settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'):
    class PrivateIdentityDocumentStorage(MediaCloudinaryStorage):
        """Store identity files as private Cloudinary resources."""

        def _upload(self, name, content):
            options = {
                'use_filename': True,
                'resource_type': 'raw',
                'type': 'private',
                'tags': 'identity_documents',
            }
            folder = os.path.dirname(name)
            if folder:
                options['folder'] = folder
            import cloudinary.uploader
            return cloudinary.uploader.upload(content, **options)

        def _get_resource_type(self, name):
            return 'raw'

        def _get_url(self, name):
            import cloudinary.utils
            public_id = self._prepend_prefix(name)
            extension = Path(name).suffix.lstrip('.') or 'bin'
            return cloudinary.utils.private_download_url(
                public_id,
                extension,
                resource_type='raw',
                type='private',
                attachment=False,
            )
else:
    class PrivateIdentityDocumentStorage(FileSystemStorage):
        """Fallback storage kept outside the public media directory."""

        def __init__(self):
            super().__init__(
                location=os.path.join(settings.BASE_DIR, 'private_media'),
                base_url=None,
            )
