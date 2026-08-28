from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_api', '0030_alter_userprofile_identity_document_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='profile_avatars/'),
        ),
    ]