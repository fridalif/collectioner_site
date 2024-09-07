from django.db import models

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


