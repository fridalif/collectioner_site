# Generated by Django 5.1.1 on 2024-09-22 21:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_itemimage_is_main_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='description',
        ),
    ]
