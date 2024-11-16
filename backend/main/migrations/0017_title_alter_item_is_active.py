# Generated by Django 5.1.1 on 2024-10-15 20:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_remove_item_user_counter_item_is_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='Title',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('header', models.CharField(max_length=100, verbose_name='Заголовок')),
                ('text', models.TextField(verbose_name='Текст')),
            ],
            options={
                'verbose_name': 'Статья',
                'verbose_name_plural': 'Статьи',
                'db_table': 'title',
            },
        ),
        migrations.AlterField(
            model_name='item',
            name='is_active',
            field=models.BooleanField(default=False, verbose_name='Активировано'),
        ),
    ]