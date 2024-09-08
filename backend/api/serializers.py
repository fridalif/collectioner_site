from main.models import Glue, Color, Stamp, Format, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item, Country, HistroryMoment
from rest_framework.serializers import ModelSerializer, CharField

class ItemSerializer(ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class CountrySerializer(ModelSerializer):
    image_url = CharField(source='flag.url')
    
    class Meta:
        model = Country
        fields = ['id', 'name']

class HistoryMomentSerializer(ModelSerializer):
    class Meta:
        model = HistroryMoment
        fields = '__all__'

class GlueSerializer(ModelSerializer):
    class Meta:
        model = Glue
        fileds = '__all__'

class ColorSerialzier(ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'

class StampSerializer(ModelSerializer):
    class Meta:
        model = Stamp
        fields = '__all__'

class FormatSerializer(ModelSerializer):
    class Meta:
        model = Format
        fields = '__all__'

class ThemeSerializer(ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'

class PressSerialzier(ModelSerializer):
    class Meta:
        model = Press
        fields = '__all__'

class EmissionSerializer(ModelSerializer):
    class Meta:
        model = Emission
        fields = '__all__'

class DesignerSerializer(ModelSerializer):
    class Meta:
        model = Designer
        fields = '__all__'

class CatalogSerializer(ModelSerializer):
    class Meta:
        model = Catalog
        fields = '__all__'

class CurrencySerializer(ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'
        
class WatermarkSerializer(ModelSerializer):
    class Meta:
        model = Watermark
        fields = '__all__'