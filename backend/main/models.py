from django.db import models
from django.contrib.auth.models import User

class Country(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')
    flag = models.ImageField(verbose_name='Флаг', null=True, blank=True, upload_to='flags', verbose_name_plural='Флаги')
    world_part = models.CharField(max_length=100, verbose_name='Часть света', 
                                  choices=[('eu', 'Европа'), ('as', 'Азия'), ('af', 'Африка'), ('am', 'Америка'), ('oc', 'Океания')])

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Страна'
        verbose_name_plural = 'Страны'
        table_name = 'country'


class HistroryMoment(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name='Страна', verbose_name_plural='Страны')
    start_year = models.IntegerField(verbose_name='Начало', verbose_name_plural='Начало', null=True, blank=True)
    end_year = models.IntegerField(verbose_name='Конец', verbose_name_plural='Конец', null=True, blank=True)

    def __str__(self):
        return f'{self.name}({self.start_year}-{self.end_year})' 
    
    class Meta:
        verbose_name = 'Исторический момент'
        verbose_name_plural = 'Исторические моменты'
        table_name = 'histrory_moment'


class Emission(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Эмиссия'
        verbose_name_plural = 'Эмиссии'
        table_name = 'emission'

class Format(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Формат'
        verbose_name_plural = 'Форматы'
        table_name = 'format'

class Stamp(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Печать'
        verbose_name_plural = 'Печати'
        table_name = 'stamp'

class Color(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Цвет'
        verbose_name_plural = 'Цвета'
        table_name = 'color'

class Glue(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Клей'
        verbose_name_plural = 'Клей'
        table_name = 'glue'

class Designer(models.Model):
    name = models.CharField(max_length=100, verbose_name='Имя', verbose_name_plural='Имена')
    surname = models.CharField(max_length=100, verbose_name='Фамилия',verbose_name_plural='Фамилии')
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Дизайнер'
        verbose_name_plural = 'Дизайнеры'
        table_name = 'designer'

class Press(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Типография'
        verbose_name_plural = 'Типографии'
        table_name = 'press'

class Watermark(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Водяной знак'
        verbose_name_plural = 'Водяные знаки'
        table_name = 'watermark'

class Currency(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Валюта'
        verbose_name_plural = 'Валюты'
        table_name = 'currency'

class Theme(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'
        table_name = 'theme'

class Catalog(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Каталог'
        verbose_name_plural = 'Каталоги'
        table_name = 'catalog'

class Item(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название', verbose_name_plural='Названия')
    description = models.TextField(verbose_name='Описание', verbose_name_plural='Описания', null=True, blank=True)
    year = models.IntegerField(verbose_name='Год', verbose_name_plural='Год', null=True, blank=True)
    histrory_moment = models.ForeignKey(HistroryMoment, on_delete=models.CASCADE, verbose_name='Исторический момент', verbose_name_plural='Исторические моменты')
    category = models.CharField(max_length=100, verbose_name='Категория', verbose_name_plural='Категории', choices=[('mark', 'Марка'), ('philatel', 'Филателистический продукт')])

    emission = models.ForeignKey(Emission, on_delete=models.CASCADE, verbose_name='Эмиссия', verbose_name_plural='Эмиссии', null=True, blank=True)
    format = models.ForeignKey(Format, on_delete=models.CASCADE, verbose_name='Формат', verbose_name_plural='Форматы', null=True, blank=True)
    stamp = models.ForeignKey(Stamp, on_delete=models.CASCADE, verbose_name='Печать', verbose_name_plural='Печати', null=True, blank=True)
    color = models.ForeignKey(Color, on_delete=models.CASCADE, verbose_name='Цвет', verbose_name_plural='Цвета', null=True, blank=True)
    glue = models.ForeignKey(Glue, on_delete=models.CASCADE, verbose_name='Клей', verbose_name_plural='Клей', null=True, blank=True)
    designer = models.ForeignKey(Designer, on_delete=models.CASCADE, verbose_name='Дизайнер', verbose_name_plural='Дизайнеры', null=True, blank=True)
    press = models.ForeignKey(Press, on_delete=models.CASCADE, verbose_name='Типография', verbose_name_plural='Типографии', null=True, blank=True)
    watermark = models.ForeignKey(Watermark, on_delete=models.CASCADE, verbose_name='Водяной знак', verbose_name_plural='Водяные знаки', null=True, blank=True)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, verbose_name='Валюта', verbose_name_plural='Валюты', null=True, blank=True)
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, verbose_name='Тема', verbose_name_plural='Темы', null=True, blank=True)
    catalog = models.ForeignKey(Catalog, on_delete=models.CASCADE, verbose_name='Каталог', verbose_name_plural='Каталоги', null=True, blank=True)
    nominal = models.FloatField(verbose_name='Номинал', verbose_name_plural='Номиналы', null=True, blank=True)
    height = models.FloatField(verbose_name='Высота', verbose_name_plural='Высота', null=True, blank=True)
    width = models.FloatField(verbose_name='Ширина', verbose_name_plural='Ширина', null=True, blank=True)

    user_counter = models.IntegerField(default=0,auto_created=True)
    def __str__(self):
        return f'{self.name}({self.year})'
    
    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'
        table_name = 'item'

class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, verbose_name='Предмет', verbose_name_plural='Предметы')
    image = models.ImageField(upload_to='images/', verbose_name='Изображение', verbose_name_plural='Изображения')

    def __str__(self):
        return f'{self.item.name}({self.item.year})'
    
    class Meta:
        verbose_name = 'Изображение предмета'
        verbose_name_plural = 'Изображения предметов'
        table_name = 'item_image'

class UserItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь', verbose_name_plural='Пользователи')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, verbose_name='Предмет', verbose_name_plural='Предметы')
    quality = models.CharField(max_length=100, verbose_name='Качество', verbose_name_plural='Качества', choices=[('good', 'Хорошее'), ('bad', 'Плохое')])
    count = models.IntegerField(verbose_name='Количество', verbose_name_plural='Количество',default=0)

    def __str__(self):
        return f'{self.user.username}({self.item.name})'
    
    class Meta:
        verbose_name = 'Пользовательский предмет'
        verbose_name_plural = 'Пользовательские предметы'
        table_name = 'user_item'