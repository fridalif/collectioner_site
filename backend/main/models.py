from django.db import models
from django.contrib.auth.models import  User

class Country(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')
    flag = models.ImageField(verbose_name='Флаг', null=True, blank=True, upload_to='flags')
    world_part = models.CharField(max_length=100, verbose_name='Часть света', 
                                  choices=[('eu', 'Европа'), ('as', 'Азия'), ('af', 'Африка'), ('am', 'Америка'), ('oc', 'Океания')])

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Страна'
        verbose_name_plural = 'Страны'
        db_table = 'country'


class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='Пользователь в джанго')
    activate_hash = models.CharField(max_length=100, verbose_name='Хэш активации', null=True, blank=True)
    fullname = models.CharField(max_length=100, verbose_name='ФИО', null=True, blank=True)
    show_fullname = models.BooleanField(verbose_name='Показывать ФИО', default=False)
    birth_date = models.DateField(verbose_name='Дата рождения', null=True, blank=True)
    show_birth_date = models.BooleanField(verbose_name='Показывать дату рождения', default=False)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name='Страна')
    languages = models.CharField(max_length=100, verbose_name='Языки', null=True, blank=True)
    about_me = models.TextField(verbose_name='О себе', null=True, blank=True)
    show_my_collection = models.BooleanField(verbose_name='Показывать мою коллекцию', default=False)
    avatar = models.ImageField(verbose_name='Аватар', default='avatar.png', upload_to='avatars')
    sended_message = models.DateTimeField(verbose_name='Время отправки', null=True, blank=True)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        db_table = 'custom_user'


class HistroryMoment(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name='Страна')
    start_year = models.IntegerField(verbose_name='Начало', null=True, blank=True)
    end_year = models.IntegerField(verbose_name='Конец', null=True, blank=True)

    def __str__(self):
        return f'{self.name}({self.start_year}-{self.end_year})' 
    
    class Meta:
        verbose_name = 'Исторический момент'
        verbose_name_plural = 'Исторические моменты'
        db_table = 'histrory_moment'


class Emission(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Эмиссия'
        verbose_name_plural = 'Эмиссии'
        db_table = 'emission'

class Format(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Формат'
        verbose_name_plural = 'Форматы'
        db_table = 'format'

class Stamp(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Печать'
        verbose_name_plural = 'Печати'
        db_table = 'stamp'

class Color(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Цвет'
        verbose_name_plural = 'Цвета'
        db_table = 'color'

class Glue(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Клей'
        verbose_name_plural = 'Клей'
        db_table = 'glue'

class Designer(models.Model):
    name = models.CharField(max_length=100, verbose_name='Имя')
    surname = models.CharField(max_length=100, verbose_name='Фамилия')
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Дизайнер'
        verbose_name_plural = 'Дизайнеры'
        db_table = 'designer'

class Press(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Типография'
        verbose_name_plural = 'Типографии'
        db_table = 'press'

class Watermark(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Водяной знак'
        verbose_name_plural = 'Водяные знаки'
        db_table = 'watermark'

class Currency(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Валюта'
        verbose_name_plural = 'Валюты'
        db_table = 'currency'

class Theme(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'
        db_table = 'theme'

class Catalog(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Каталог'
        verbose_name_plural = 'Каталоги'
        db_table = 'catalog'

class Item(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')
    description = models.TextField(verbose_name='Описание', null=True, blank=True)
    year = models.IntegerField(verbose_name='Год', null=True, blank=True)
    histrory_moment = models.ForeignKey(HistroryMoment, on_delete=models.CASCADE, verbose_name='Исторический момент')
    category = models.CharField(max_length=100, verbose_name='Категория', choices=[('mark', 'Марка'), ('philatel', 'Филателистический продукт')])

    emission = models.ForeignKey(Emission, on_delete=models.CASCADE, verbose_name='Эмиссия', null=True, blank=True)
    format = models.ForeignKey(Format, on_delete=models.CASCADE, verbose_name='Формат', null=True, blank=True)
    stamp = models.ForeignKey(Stamp, on_delete=models.CASCADE, verbose_name='Печать', null=True, blank=True)
    color = models.ForeignKey(Color, on_delete=models.CASCADE, verbose_name='Цвет', null=True, blank=True)
    glue = models.ForeignKey(Glue, on_delete=models.CASCADE, verbose_name='Клей', null=True, blank=True)
    designer = models.ForeignKey(Designer, on_delete=models.CASCADE, verbose_name='Дизайнер', null=True, blank=True)
    press = models.ForeignKey(Press, on_delete=models.CASCADE, verbose_name='Типография', null=True, blank=True)
    watermark = models.ForeignKey(Watermark, on_delete=models.CASCADE, verbose_name='Водяной знак', null=True, blank=True)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, verbose_name='Валюта', null=True, blank=True)
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, verbose_name='Тема', null=True, blank=True)
    catalog = models.ForeignKey(Catalog, on_delete=models.CASCADE, verbose_name='Каталог', null=True, blank=True)
    nominal = models.FloatField(verbose_name='Номинал', null=True, blank=True)
    height = models.FloatField(verbose_name='Высота', null=True, blank=True)
    width = models.FloatField(verbose_name='Ширина', null=True, blank=True)

    user_counter = models.IntegerField(default=0,auto_created=True,verbose_name='В наличии у пользователей')
    def __str__(self):
        return f'{self.name}({self.year})'
    
    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'
        db_table = 'item'

class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, verbose_name='Предмет')
    image = models.ImageField(upload_to='images/', verbose_name='Изображение')

    def __str__(self):
        return f'{self.item.name}({self.item.year})'
    
    class Meta:
        verbose_name = 'Изображение предмета'
        verbose_name_plural = 'Изображения предметов'
        db_table = 'item_image'

class UserItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, verbose_name='Предмет')
    quality = models.CharField(max_length=100, verbose_name='Качество', choices=[('good', 'Хорошее'), ('bad', 'Плохое')])
    count = models.IntegerField(verbose_name='Количество', default=0)

    def __str__(self):
        return f'{self.user.username}({self.item.name})'
    
    class Meta:
        verbose_name = 'Пользовательский предмет'
        verbose_name_plural = 'Пользовательские предметы'
        db_table = 'user_item'