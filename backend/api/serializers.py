from main.models import Glue, Color, Stamp, Format, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item, Country, HistroryMoment, UserItem, CustomUser, ItemImage
from rest_framework.serializers import ModelSerializer, CharField, IntegerField
from django.contrib.auth.models import User


class ItemListSerializer(ModelSerializer):
    class Meta:
        model = Item
        fields = ['id','name']

class CustomUserSerializer(ModelSerializer):
    username = CharField(source='user.username')
    email = CharField(source='user.email')
    country = CharField(source='country.name', allow_null=True)
    avatar_url = CharField(source='avatar.url')
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','city', 'fullname', 'birth_date','country','avatar_url','languages', 'about_me', 'show_my_collection', 'show_fullname', 'show_birth_date']

class ItemSerializer(ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class CountrySerializer(ModelSerializer):
    image_url = CharField(source='flag.url')
    
    class Meta:
        model = Country
        fields = ['id', 'name', 'image_url']

class HistoryMomentSerializer(ModelSerializer):
    class Meta:
        model = HistroryMoment
        fields = '__all__'

class GlueSerializer(ModelSerializer):
    class Meta:
        model = Glue
        fields = '__all__'

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

class UserItemSerializer(ModelSerializer):
    class Meta:
        model = UserItem
        fields = ['id', 'user', 'item','quality']

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ItemImageSerializer(ModelSerializer):
    item_id = IntegerField(source='item.id')
    image_url = CharField(source='image.url')
    class Meta:
        model = ItemImage
        fields = ['item_id', 'image_url', 'is_main_image']