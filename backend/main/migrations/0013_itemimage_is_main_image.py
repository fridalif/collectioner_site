# Generated by Django 5.1.1 on 2024-09-19 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_customuser_city'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemimage',
            name='is_main_image',
            field=models.BooleanField(default=False, verbose_name='Основное изображение'),
        ),
    ]
