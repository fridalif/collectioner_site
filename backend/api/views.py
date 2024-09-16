from django.shortcuts import render
from rest_framework.response import Response
from django.http import JsonResponse
from django.http import HttpRequest
from django.db.models import Q
from rest_framework.decorators import api_view
from typing import List
from django.contrib.auth import authenticate, login, logout
from main.models import Glue, Color, Stamp, Format, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item, Country, HistroryMoment, UserItem, CustomUser
from api.serializers import ItemSerializer, CountrySerializer,HistoryMomentSerializer, GlueSerializer, ColorSerialzier, StampSerializer, FormatSerializer, ThemeSerializer, PressSerialzier, EmissionSerializer, DesignerSerializer, CatalogSerializer, CurrencySerializer, WatermarkSerializer, UserItemSerializer, CustomUserSerializer
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.utils.crypto import get_random_string
from django.contrib.sessions.models import Session

"""
    Валидаторы
"""
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



"""
    GET
"""

def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response

@api_view(['GET'])
def is_logged_in(request:HttpRequest)->Response:
    try:
        if request.session.get('user_id') is not None:
            users = User.objects.filter(id=request.session.get('user_id'))
            if len(users) == 0:
                return Response({'status':'ok', 'data':{'is_logged_in':False, 'is_superuser':False}}) 
            user = users[0]
            if not user.is_active:
                return Response({'status':'ok', 'data':{'is_logged_in':False, 'is_superuser':False}})
            return Response({'status':'ok', 'data':{'is_logged_in':True, 'is_superuser':user.is_superuser}})
        return Response({'status':'ok', 'data':{'is_logged_in':False, 'is_superuser':False}})
    except:
        return Response({'status':'error', 'message':'Не удалось проверить авторизацию'})


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

        return Response({'status':'ok','data':ItemSerializer(items[offset:offset+limit].data,many=True)})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})

@api_view(['GET'])
def get_countries(request:HttpRequest,id=None)->Response:
    try:
        if id is not None:
            try:
                country = Country.objects.get(id=id)
                return Response({'status':'ok','data':CountrySerializer(country).data})
            except Country.DoesNotExist:
                return Response({'status':'error','message':'Нет страны с таким id'})
            except:
                return Response({'status':'error','message':'Неизвестная ошибка'})
            
        world_part = request.GET.get('world_part')
        if world_part is not None:
            try:
                countries = Country.objects.filter(world_part=world_part)
                return Response({'status':'ok','data':CountrySerializer(countries,many=True).data})
            except: 
                return Response({'status':'error','message':'Ошибка получения стран'})
        countries = Country.objects.all()
        data = CountrySerializer(countries,many=True)
        data = data.data
        return Response({'status':'ok','data':data})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})
    

@api_view(['GET'])
def get_history_moments(request:HttpRequest,id=None)->Response:
    try:
        if id is not None:
            try:
                history_moment = HistroryMoment.objects.get(id=id)
                return Response({'status':'ok','data':HistoryMomentSerializer(history_moment).data})
            except HistroryMoment.DoesNotExist:
                return Response({'status':'error','message':'Нет исторического момента с таким id'})
            except:
                return Response({'status':'error','message':'Неизвестная ошибка'})
        country_id = request.GET.get('country_id')
        if not is_int(country_id):
            return Response({'status':'error','message':'Не указана страна'})
        try:
            history_moment = HistroryMoment.objects.filter(country__id=int(country_id))
            return Response({'status':'ok','data':HistoryMomentSerializer(history_moment,many=True).data})
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
                'glues':GlueSerializer(glues,many=True).data,
                'colors':ColorSerialzier(colors,many=True).data,
                'stamps':StampSerializer(stamps,many=True).data,
                'formats':FormatSerializer(formats,many=True).data,
                'themes':ThemeSerializer(themes,many=True).data,
                'press':PressSerialzier(press,many=True).data,
                'emissions': EmissionSerializer(emissions,many=True).data,
                'catalogs':CatalogSerializer(catalogs,many=True).data,
                'currencies':CurrencySerializer(currencies,many=True).data,
                'watermarks':WatermarkSerializer(watermarks,many=True).data
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
                    'data':DesignerSerializer(designers,many=True).extend(DesignerSerializer(fullnamed_designers,many=True)).data[1:10:]
                })
        except:
            return Response({'status':'error','message':'Ошибка при получении дизайнеров'})    
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})
    
@api_view(['GET'])
def get_my_collection_counters(request:HttpRequest)->Response:
    try:
        if not request.user.is_authenticated:
            return Response({'status':'error','message':'Необходима авторизация'})
        ids = request.GET.getlist('ids')
        if ids is None:
            return Response({'status':'error','message':'Не указаны id предметов'})
        try:
            items = Item.objects.filter(id__in=ids)
            user_items = UserItem.objects.filter(user=request.user, item__in=items)
            qualities = ['good','bad']
            counters = {}
            for item in items:
                item_qualities = user_items.filter(item=item)
                if str(item.id) not in counters.keys():
                    counters[str(item.id)] = {}
                for quality in qualities:
                    item_quality = item_qualities.filter(quality=quality)
                    if len(item_quality) == 0:
                        counters[str(item.id)][quality] = 0
                        continue
                    counters[str(item.id)][quality] = item_quality[0].count
            return Response({'status':'ok','data':counters})                  
        except:
            return Response({'status':'error','message':'Ошибка получения счётчиков предметов'})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})
    

@api_view(["GET"])
def get_user(request:HttpRequest, id = None) -> Response:
    try:
        user_id = request.session.get('user_id')

        if id is None:
            if not is_int(user_id):
                return Response({'status':'error', 'message':'Не указан пользователь'})
            try:
                user = CustomUser.objects.get(user__id=int(user_id))
            except CustomUser.DoesNotExist:
                return Response({'status':'error', 'message':'Пользователь не найден'})
            except Exception as e:
                print('{e}')
                return Response({'status':'error', 'message':'Неизвестная ошибка'})
            return Response({'status':'ok', 'data':{'user':CustomUserSerializer(user).data, 'isMyAccount':True}})
        try:
            user = CustomUser.objects.get(id=int(id))
        except CustomUser.DoesNotExist:
            return Response({'status':'error', 'message':'Пользователь не найден'})
        except:
            return Response({'status':'error', 'message':'Неизвестная ошибка'})
        if is_int(user_id):
            request_user = User.objects.get(id=int(user_id))
            if user.user == request_user or request_user.is_superuser:
                return Response({'status':'ok', 'data':{'user':CustomUserSerializer(user).data, 'isMyAccount':user.user==request_user}})
        if not user.show_birth_date:
            user.birth_date = None
        if not user.show_fullname:
            user.fullname = 'Пользователь ограничил доступ'
        return Response({'status':'ok', 'data':CustomUserSerializer(user).data})
    except Exception as e:
        print(e)
        return Response({'status':'error','message': 'Неизвестная ошибка'})


@api_view(['GET'])
def activate_user(request: HttpRequest, hash: str) -> Response:
    try:
        if len(CustomUser.objects.filter(activate_hash=hash)) != 0:
            user = CustomUser.objects.get(activate_hash=hash)
            user.user.is_active = True
            user.user.save()
            user.save()
            request.session['user_id'] = user.user.id
            return Response({'status':'ok','data':user.user.username})
        return Response({'status':'error','message':'Неверная ссылка активации'})
    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Неизвестная ошибка'})
    
    

"""
    POST
"""

@api_view(['POST'])
def add_new_item(request:HttpRequest) -> Response:
    try:
        if not request.user.is_superuser:
            return Response({'status':'error','message':'Доступ запрещён'})
        data = request.data
        try:
            serializer = ItemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({'status':'ok','data':serializer.data})
        except:
            return Response({'status':'error','message':'Не удалось добавить предмет'})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})
    
@api_view(['POST','DELETE'])
def add_or_remove_item_in_my_collection(request:HttpRequest) -> Response:
    try:
        if not request.user.is_authenticated:
            return Response({'status':'error','message':'Необходима авторизация'})
        data = request.data
        data['user'] = request.user
        is_add = data.get('is_add')
        if is_add is None:
            return Response({'status':'error','message':'Не указано действие'})
        data.pop('is_add',None)
        try:
            item = Item.objects.get(id=data['item_id'])
        except Item.DoesNotExist:
            return Response({'status':'error','message':'Нет предмета с таким id'})
        except:
            return Response({'status':'error','message':'Неизвестная ошибка'})
        data['item'] = item    
        records = UserItem.objects.filter(user=request.user, item=item, quality=data['quality'])
        if len(records) != 0:
            record = record[0]
            if is_add:
                record.count += 1
                record.save()
                return Response({'status':'ok','data':UserItemSerializer(record).data})
            if record.count <= 0:
                return Response({'status':'error','message':'Коллекция пуста'})
            record.count -= 1
            record.save()
            return Response({'status':'ok','data':UserItemSerializer(record).data})
        try:
            if not is_add:
                return Response({'status':'error','message':'Коллекция пуста'})
            data['count'] = 1
            serializer = UserItemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({'status':'ok','data':serializer.data})
        except:
            return Response({'status':'error','message':'Не удалось добавить предмет в коллекцию'})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})


@api_view(['POST'])
def login_user(request: HttpRequest) -> Response:
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        if username is None or password is None:
            return Response({'status':'error','message':'Не указаны логин или пароль'})
        user = authenticate(username=username, password=password)
        if user is not None:
            if not user.is_active:
                return Response({'status':'error','message':'Пользователь не активирован или заблокирован'})
            request.session['user_id'] = user.id
            return Response({'status':'ok','data':user.username})
        user = User.objects.filter(email=username)
        if len(user) != 0:
            user = user[0]
            if not user.check_password(password):
                return Response({'status':'error','message':'Неверные логин или пароль'})
            if not user.is_active:
                return Response({'status':'error','message':'Пользователь не активирован или заблокирован'})
            request.session['user_id'] = user.id
            return Response({'status':'ok','data':user.username})
        return Response({'status':'error','message':'Неверные логин или пароль'})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})

@api_view(['POST'])
def register_user(request: HttpRequest) -> Response:
    try:
        username = str(request.data.get('username'))
        email = str(request.data.get('email'))
        password = str(request.data.get('password'))
        fullname = str(request.data.get('fullname'))
        username = username.replace('<','')
        email = email.replace('<','')
        fullname = fullname.replace('<','')
        if username == '':
            return Response({'status':'error','message':'Не указан логин'})
        if email == '':
            return Response({'status':'error','message':'Не указан email'})
        if password == '':
            return Response({'status':'error','message':'Не указан пароль'})
        if fullname == '':
            return Response({'status':'error','message':'Не указано имя'})
        if User.objects.filter(username=username).exists():
            return Response({'status':'error','message':'Пользователь с таким логином уже существует'})
        if User.objects.filter(email=email).exists():
            return Response({'status':'error','message':'Пользователь с таким email уже существует'})
        date_of_birth = request.data.get('date_of_birth')
        if date_of_birth is None:
            return Response({'status':'error','message':'Не указана дата рождения'})
        
        show_fullname = request.data.get('show_fullname')
        show_birth_date = request.data.get('show_birth_date')
        if show_fullname is None:
            show_fullname = False
        if show_birth_date is None:
            show_birth_date = False
        country = request.data.get('country')
        if not is_int(country):
            return Response({'status':'error','message':'Не указана страна'})
        try:
            country = Country.objects.get(id=int(country))
            user = User.objects.create_user(username, email, password)
            activate_hash = get_random_string(length=100)
            custom_user = CustomUser.objects.create(user=user, fullname=fullname, birth_date=date_of_birth, show_fullname=show_fullname, show_birth_date=show_birth_date, country=country, activate_hash=activate_hash)
            custom_user.save()
            user.is_active = False
            user.save()
            request.session['user_id'] = user.id
            return Response({'status':'ok','data':user.username})
        except Country.DoesNotExist:
            return Response({'status':'error','message':'Неизвестная страна'})
        except Exception as e:
            print(e)
            return Response({'status':'error','message':'Неизвестная ошибка'})


    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})
    
@api_view(['POST'])
def logout_user(request: HttpRequest) -> Response:
    try:
        request.session['user_id'] =  -1
        return Response({'status':'ok'})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})