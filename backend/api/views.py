from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpRequest
from rest_framework.decorators import api_view
from typing import List
from main.models import Glue, Color, Stamp, Format, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item
from api.serializers import ItemSerializer

def is_int(obj)->bool:
    if obj is None:
        return False
    try:
        obj = int(obj)
        return True
    except:
        return False

def is_float(obj)->bool:
    if obj is None:
        return False
    try:
        obj = float(obj)
        return True
    except:
        return False

def validate_model_ids(model, ids)->List:
    if ids is None:
        return model.objects.all()
    if not isinstance(ids, list):
        return []
    return model.objects.filter(id__in=ids)


@api_view(['GET'])
def get_items(request:HttpRequest)->Response:
    # Пагинация + валидация limit и offset
    limit = request.GET.get('limit')
    offset = request.GET.get('offset')
    if not is_int(limit):
        limit = 10
    else:
        limit = int(limit)
    if limit > 100:
        limit = 100
    if not is_int(offset) or int(offset)<0:
        offset = 0
    else:
        offset = int(offset)

    items = Item.objects.all()

    # Получение + валидация фильтров в которых может быть много выборов
    glues_id = request.GET.getlist('glues')
    if glues_id is not None:
        glues = validate_model_ids(Glue, glues_id)
        items = items.filter(glue__in=glues)
    
    colors_id = request.GET.getlist('colors')
    if colors_id is not None:
        colors = validate_model_ids(Color, colors_id)
        items = items.filter(color__in=colors)

    stamps_id = request.GET.getlist('stamps')
    if stamps_id is not None:
        stamps = validate_model_ids(Stamp, stamps_id)
        items = items.filter(stamp__in=stamps)

    formats_id = request.GET.getlist('formats')
    if formats_id is not None:
        formats = validate_model_ids(Format, formats_id)
        items = items.filter(format__in=formats)
    
    themes_id = request.GET.getlist('themes')
    if themes_id is not None:
        themes = validate_model_ids(Theme, themes_id)
        items = items.filter(theme__in=themes)

    presses_id = request.GET.getlist('presses')
    if presses_id is not None:
        presses = validate_model_ids(Press, presses_id)
        items = items.filter(press__in=presses)

    emissions_id = request.GET.getlist('emissions')
    if emissions_id is not None:
        emissions = validate_model_ids(Emission, emissions_id)
        items = items.filter(emission__in=emissions)

    designers_id = request.GET.getlist('designers')
    if designers_id is not None:
        designers = validate_model_ids(Designer, designers_id)
        items = items.filter(designer__in=designers)

    catalogs_id = request.GET.getlist('catalogs')
    if catalogs_id is not None:
        catalogs = validate_model_ids(Catalog, catalogs_id)
        items = items.filter(catalog__in=catalogs)

    currencies_id = request.GET.getlist('currencies')
    if currencies_id is not None:
        currencies = validate_model_ids(Currency, currencies_id)
        items = items.filter(currency__in=currencies)
    
    watermarks_id = request.GET.getlist('watermarks')
    if watermarks_id is not None:
        watermarks = validate_model_ids(Watermark, watermarks_id)
        items = items.filter(watermark__in=watermarks)
    
    # Получение + валидация фильтров в которых есть только 1 выбор
    history = request.GET.get('history_moment')
    if history is not None and is_int(history):
        items = items.filter(history_moment__id=int(history))
    
    nominal_ge = request.GET.get('nominal_ge')
    if nominal_ge is not None and is_float(nominal_ge):
        items = items.filter(nominal__ge=float(nominal_ge))

    nominal_le = request.GET.get('nominal_le')
    if nominal_le is not None and is_float(nominal_le):
        items = items.filter(nominal__le=float(nominal_le))

    year_ge = request.GET.get('year_ge')
    if year_ge is not None and is_int(year_ge):
        items = items.filter(year__ge=int(year_ge))

    year_le = request.GET.get('year_le')
    if year_le is not None and is_int(year_le):
        items = items.filter(year__le=int(year_le))

    # Сортировка
    items = items.order_by('-user_counter')

    # Пагинация
    items = items[offset:offset+limit]

    return Response(ItemSerializer(items[offset:offset+limit]))