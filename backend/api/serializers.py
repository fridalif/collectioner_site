from main.models import Item, Country, HistroryMoment
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