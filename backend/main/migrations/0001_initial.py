# Generated by Django 5.1.1 on 2024-09-10 07:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Catalog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Каталог',
                'verbose_name_plural': 'Каталоги',
                'db_table': 'catalog',
            },
        ),
        migrations.CreateModel(
            name='Color',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Цвет',
                'verbose_name_plural': 'Цвета',
                'db_table': 'color',
            },
        ),
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
                ('flag', models.ImageField(blank=True, null=True, upload_to='flags', verbose_name='Флаг')),
                ('world_part', models.CharField(choices=[('eu', 'Европа'), ('as', 'Азия'), ('af', 'Африка'), ('am', 'Америка'), ('oc', 'Океания')], max_length=100, verbose_name='Часть света')),
            ],
            options={
                'verbose_name': 'Страна',
                'verbose_name_plural': 'Страны',
                'db_table': 'country',
            },
        ),
        migrations.CreateModel(
            name='Currency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Валюта',
                'verbose_name_plural': 'Валюты',
                'db_table': 'currency',
            },
        ),
        migrations.CreateModel(
            name='Designer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Имя')),
                ('surname', models.CharField(max_length=100, verbose_name='Фамилия')),
            ],
            options={
                'verbose_name': 'Дизайнер',
                'verbose_name_plural': 'Дизайнеры',
                'db_table': 'designer',
            },
        ),
        migrations.CreateModel(
            name='Emission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Эмиссия',
                'verbose_name_plural': 'Эмиссии',
                'db_table': 'emission',
            },
        ),
        migrations.CreateModel(
            name='Format',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Формат',
                'verbose_name_plural': 'Форматы',
                'db_table': 'format',
            },
        ),
        migrations.CreateModel(
            name='Glue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Клей',
                'verbose_name_plural': 'Клей',
                'db_table': 'glue',
            },
        ),
        migrations.CreateModel(
            name='Press',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Типография',
                'verbose_name_plural': 'Типографии',
                'db_table': 'press',
            },
        ),
        migrations.CreateModel(
            name='Stamp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Печать',
                'verbose_name_plural': 'Печати',
                'db_table': 'stamp',
            },
        ),
        migrations.CreateModel(
            name='Theme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Тема',
                'verbose_name_plural': 'Темы',
                'db_table': 'theme',
            },
        ),
        migrations.CreateModel(
            name='Watermark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Водяной знак',
                'verbose_name_plural': 'Водяные знаки',
                'db_table': 'watermark',
            },
        ),
        migrations.CreateModel(
            name='HistroryMoment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
                ('start_year', models.IntegerField(blank=True, null=True, verbose_name='Начало')),
                ('end_year', models.IntegerField(blank=True, null=True, verbose_name='Конец')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.country', verbose_name='Страна')),
            ],
            options={
                'verbose_name': 'Исторический момент',
                'verbose_name_plural': 'Исторические моменты',
                'db_table': 'histrory_moment',
            },
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_counter', models.IntegerField(auto_created=True, default=0, verbose_name='В наличии у пользователей')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
                ('description', models.TextField(blank=True, null=True, verbose_name='Описание')),
                ('year', models.IntegerField(blank=True, null=True, verbose_name='Год')),
                ('category', models.CharField(choices=[('mark', 'Марка'), ('philatel', 'Филателистический продукт')], max_length=100, verbose_name='Категория')),
                ('nominal', models.FloatField(blank=True, null=True, verbose_name='Номинал')),
                ('height', models.FloatField(blank=True, null=True, verbose_name='Высота')),
                ('width', models.FloatField(blank=True, null=True, verbose_name='Ширина')),
                ('catalog', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.catalog', verbose_name='Каталог')),
                ('color', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.color', verbose_name='Цвет')),
                ('currency', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.currency', verbose_name='Валюта')),
                ('designer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.designer', verbose_name='Дизайнер')),
                ('emission', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.emission', verbose_name='Эмиссия')),
                ('format', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.format', verbose_name='Формат')),
                ('glue', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.glue', verbose_name='Клей')),
                ('histrory_moment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.histrorymoment', verbose_name='Исторический момент')),
                ('press', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.press', verbose_name='Типография')),
                ('stamp', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stamp', verbose_name='Печать')),
                ('theme', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.theme', verbose_name='Тема')),
                ('watermark', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.watermark', verbose_name='Водяной знак')),
            ],
            options={
                'verbose_name': 'Предмет',
                'verbose_name_plural': 'Предметы',
                'db_table': 'item',
            },
        ),
        migrations.CreateModel(
            name='ItemImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images/', verbose_name='Изображение')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.item', verbose_name='Предмет')),
            ],
            options={
                'verbose_name': 'Изображение предмета',
                'verbose_name_plural': 'Изображения предметов',
                'db_table': 'item_image',
            },
        ),
        migrations.CreateModel(
            name='UserItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quality', models.CharField(choices=[('good', 'Хорошее'), ('bad', 'Плохое')], max_length=100, verbose_name='Качество')),
                ('count', models.IntegerField(default=0, verbose_name='Количество')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.item', verbose_name='Предмет')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Пользовательский предмет',
                'verbose_name_plural': 'Пользовательские предметы',
                'db_table': 'user_item',
            },
        ),
    ]