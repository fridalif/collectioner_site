from main.models import Glue, Color, Stamp, Format, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item, Country, HistroryMoment, CollectionItem, CustomUser, ItemImage, UserCollection
from rest_framework.serializers import ModelSerializer, CharField, IntegerField, DateField
from django.contrib.auth.models import User


class UserCollectionSerializer(ModelSerializer):
    collection_name = CharField(source="collection.name")
    collection_id = IntegerField(source="collection.id")
    class Meta:
        model = UserCollection
        fields = ['collection_id','collection_name','can_see_other']

class ItemListSerializer(ModelSerializer):
    class Meta:
        model = Item
        fields = ['id','name']

class CustomUserListSerializer(ModelSerializer):
    username = CharField(source='user.username')
    flag = CharField(source='country.flag.url', allow_null=True)
    country = CharField(source='country.name', allow_null=True)
    avatar_url = CharField(source='avatar.url')
    class Meta:
        model = CustomUser
        fields = ['id','username','country','flag','avatar_url']

class CustomUserSerializer(ModelSerializer):
    username = CharField(source='user.username')
    email = CharField(source='user.email')
    country = CharField(source='country.name', allow_null=True)
    avatar_url = CharField(source='avatar.url')
    birth_date = DateField(source='birth_date',format='%d.%m.%Y', allow_null=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','city', 'fullname', 'birth_date','country','avatar_url','languages', 'about_me', 'show_my_collection', 'show_fullname', 'show_birth_date']

class ItemSerializer(ModelSerializer):
    history_moment_name = CharField(source="histrory_moment.name")
    country_name = CharField(source='histrory_moment.country.name')
    emission_name = CharField(source='emission.name', allow_null=True)
    format_name = CharField(source='format.name', allow_null=True)
    stamp_name = CharField(source='stamp.name', allow_null=True)
    color_name = CharField(source='color.name', allow_null=True)
    glue_name = CharField(source='glue.name', allow_null=True)
    designer_name = CharField(source='designer.name', allow_null=True)
    press_name = CharField(source='press.name', allow_null=True)
    watermark_name = CharField(source='watermark.name', allow_null=True)
    currency_name = CharField(source='currency.name', allow_null=True)
    theme_name = CharField(source='theme.name', allow_null=True)
    country_flag = CharField(source='histrory_moment.country.flag.url', allow_null=True)

    class Meta:
        model = Item
        fields = ['id','country_flag','name','history_moment_name','country_name','emission_name','format_name','stamp_name', 'color_name', 'glue_name', 'designer_name', 'press_name', 'watermark_name', 'currency_name','theme_name','nominal','height','width','year']

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