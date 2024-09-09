from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpRequest
from django.db.models import Q
from rest_framework.decorators import api_view
from typing import List
from main.models import Glue, Color, Stamp, Format, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item, Country, HistroryMoment
from api.serializers import ItemSerializer, CountrySerializer,HistoryMomentSerializer, GlueSerializer, ColorSerialzier, StampSerializer, FormatSerializer, ThemeSerializer, PressSerialzier, EmissionSerializer, DesignerSerializer, CatalogSerializer, CurrencySerializer, WatermarkSerializer

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

    try:
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
        try:
            items = Item.objects.all()
        except:
            return Response({'status':'error', 'message':'Не удалось получить предметы'})
        # Получение + валидация фильтров в которых может быть много выборов
        category = request.GET.get('category')
        if category is None:
            return Response({'status':'error', 'message':'Не указан тип предмета'})
        items = items.filter(category = category)
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

        # Фильтрация по историческим моментам, странам и частям света
        history = request.GET.get('history_moment')
        if history is not None and is_int(history):
            items = items.filter(history_moment__id=int(history))
        else:
            country = request.GET.get('country')
            if country is not None and is_int(country):
                items = items.filter(history_moment__country__id=int(country))
            else:
                world_part = request.GET.get('world_part')
                if world_part is not None:
                    countries = Country.objects.filter(world_part)
                    items = items.filter(history_moment__country__in=countries)


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

        return Response({'status':'ok','data':ItemSerializer(items[offset:offset+limit],many=True)})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})

@api_view(['GET'])
def get_countries(request:HttpRequest,id=None)->Response:
    try:
        if id is not None:
            try:
                country = Country.objects.get(id=id)
                return Response({'status':'ok','data':CountrySerializer(country)})
            except Country.DoesNotExist:
                return Response({'status':'error','message':'Нет страны с таким id'})
            except:
                return Response({'status':'error','message':'Неизвестная ошибка'})
            
        world_part = request.GET.get('world_part')
        if world_part is not None:
            try:
                countries = Country.objects.filter(world_part=world_part)
                return Response({'status':'ok','data':CountrySerializer(countries,many=True)})
            except: 
                return Response({'status':'error','message':'Ошибка получения стран'})
        return Response({'status':'error','message':'Не указана часть света'})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})
    

@api_view(['GET'])
def get_history_moments(request:HttpRequest,id=None)->Response:
    try:
        if id is not None:
            try:
                history_moment = HistroryMoment.objects.get(id=id)
                return Response({'status':'ok','data':HistoryMomentSerializer(history_moment)})
            except HistroryMoment.DoesNotExist:
                return Response({'status':'error','message':'Нет исторического момента с таким id'})
            except:
                return Response({'status':'error','message':'Неизвестная ошибка'})
        country_id = request.GET.get('country_id')
        if not is_int(country_id):
            return Response({'status':'error','message':'Не указана страна'})
        try:
            history_moment = HistroryMoment.objects.filter(country__id=int(country_id))
            return Response({'status':'ok','data':HistoryMomentSerializer(history_moment,many=True)})
        except:
            return Response({'status':'error','message':'Ошибка получения исторических моментов'})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})
    

@api_view(['GET'])
def get_other_filters_except_designers(request:HttpRequest)->Response:
    try:
        glues = Glue.objects.all()
        colors = Color.objects.all()
        stamps = Stamp.objects.all()
        formats = Format.objects.all()
        themes = Theme.objects.all()
        press = Press.objects.all()
        emissions = Emission.objects.all()
        catalogs = Catalog.objects.all()
        currencies = Currency.objects.all()
        watermarks = Watermark.objects.all()
        return Response({
            'status':'ok',
            'data':{
                'glues':GlueSerializer(glues,many=True),
                'colors':ColorSerialzier(colors,many=True),
                'stamps':StampSerializer(stamps,many=True),
                'formats':FormatSerializer(formats,many=True),
                'themes':ThemeSerializer(themes,many=True),
                'press':PressSerialzier(press,many=True),
                'emissions': EmissionSerializer(emissions,many=True),
                'catalogs':CatalogSerializer(catalogs,many=True),
                'currencies':CurrencySerializer(currencies,many=True),
                'watermarks':WatermarkSerializer(watermarks,many=True)
            }
        })
    except:
        return Response({'status':'error','message':'Ошибка при получении фильтров'})

@api_view(['GET'])
def get_designers(request:HttpRequest)->Response:
    try:
        query = request.GET.get('query')
        if query is None or len(query)==0:
            return Response({'status':'error','message':'Фильтраия пуста'})
        try:
            designers = Designer.objects.filter(Q(name__istartswith=query)|Q(surname__istartswith=query))
            fullnamed_designers = []
            if ' ' in query:
                name = ' '.join(query.strip(' ')[1::])
                surname = query.strip(' ')[0]
                fullnamed_designers = Designer.objects.filter(Q(Q(name__icontains=name)&Q(surname__icontains=surname)|(Q(name__icontains=surname)&Q(surname__icontains=name))))
                return Response({
                    'status':'ok',
                    'data':DesignerSerializer(designers,many=True).extend(DesignerSerializer(fullnamed_designers,many=True))[1:10:]
                })
        except:
            return Response({'status':'error','message':'Ошибка при получении дизайнеров'})    
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})