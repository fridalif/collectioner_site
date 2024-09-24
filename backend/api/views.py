from django.shortcuts import render
from rest_framework.response import Response
from django.http import JsonResponse
from django.http import HttpRequest
from django.db.models import Q
from rest_framework.decorators import api_view
from typing import List
from django.contrib.auth import authenticate, login, logout
from main.models import Glue, Color, Stamp, Format, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item, Country, HistroryMoment, CustomUser, ItemImage, Collection, CollectionItem, UserCollection
from api.serializers import ItemSerializer, CountrySerializer,HistoryMomentSerializer, GlueSerializer, ColorSerialzier, StampSerializer, FormatSerializer, ThemeSerializer, PressSerialzier, EmissionSerializer, DesignerSerializer, CatalogSerializer, CurrencySerializer, WatermarkSerializer, CustomUserSerializer, ItemListSerializer, ItemImageSerializer
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
def get_items(request:HttpRequest, id=None)->Response:

    try:
        if id is not None:
            try:
                item = Item.objects.get(id=id)
                return Response({'status':'ok', 'data':ItemSerializer(item).data})
            except Item.DoesNotExist:
                return Response({'status':'error', 'message':'Нет предмета с таким id'})
            except Exception as e:
                print(e)
                return Response({'status':'error', 'message':'Неизвестная ошибка'})
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

        # Получение + валидация фильтров
        category = request.GET.get('category')
        if category is not None:
            items = items.filter(category = category)
        
        glues_id = request.GET.get('glues')
        if is_int(glues_id):
            items = items.filter(glue__id=int(glues_id))
        
        colors_id = request.GET.get('colors')
        if is_int(colors_id):
            items = items.filter(color__id=int(colors_id))

        stamps_id = request.GET.get('stamps')
        if is_int(stamps_id):
            items = items.filter(stamp__id=int(stamps_id))

        formats_id = request.GET.get('formats')
        if is_int(formats_id):
            items = items.filter(format__id=int(formats_id))
        
        themes_id = request.GET.get('themes')
        if is_int(themes_id):
            items = items.filter(theme__id=int(themes_id))

        presses_id = request.GET.get('presses')
        if is_int(presses_id):
            items = items.filter(press__id=int(presses_id))

        emissions_id = request.GET.get('emissions')
        if is_int(emissions_id):
            items = items.filter(emission__id=int(emissions_id))

        designers_id = request.GET.get('designers')
        if is_int(designers_id):
            items = items.filter(designer__id=int(designers_id))

        catalogs_id = request.GET.get('catalogs')
        if is_int(catalogs_id):
            items = items.filter(catalog__id=int(catalogs_id))

        currencies_id = request.GET.get('currencies')
        if is_int(currencies_id):
            items = items.filter(currency__id=int(currencies_id))
        
        watermarks_id = request.GET.get('watermarks')
        if is_int(watermarks_id):
            items = items.filter(watermark__id=int(watermarks_id))


        # Фильтрация по историческим моментам, странам и частям света
        history = request.GET.get('history_moment')
        if history is not None and is_int(history):
            items = items.filter(histrory_moment__id=int(history))
        else:
            country = request.GET.get('country')
            if country is not None and is_int(country):
                items = items.filter(histrory_moment__country__id=int(country))
            else:
                world_part = request.GET.get('world_part')
                if world_part is not None:
                    countries = Country.objects.filter(world_part=world_part)
                    items = items.filter(histrory_moment__country__in=countries)


        nominal_ge = request.GET.get('nominal_ge')
        if is_float(nominal_ge):
            items = items.filter(nominal__gte=float(nominal_ge))

        nominal_le = request.GET.get('nominal_le')
        if is_float(nominal_le):
            items = items.filter(nominal__lte=float(nominal_le))

        year_ge = request.GET.get('year_ge')
        if is_int(year_ge):
            items = items.filter(year__gte=int(year_ge))

        year_le = request.GET.get('year_le')
        if is_int(year_le):
            items = items.filter(year__lte=int(year_le))

        # Сортировка
        items = items.order_by('-id')
        total = len(items)
        # Пагинация
        items = items[offset:offset+limit]

        return Response({'status':'ok','data':ItemListSerializer(items,many=True).data,'total':total})
    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Неизвестная ошибка'})


@api_view(['GET'])
def get_item_image_urls(request:HttpRequest)->Response:
    try:
        items_ids = request.GET.getlist('items_ids[]')
        if len(items_ids) == 0:
            return Response({'status':'error','message':'Не указаны id предметов'})
        item_images = ItemImage.objects.filter(item__id__in=items_ids)
        if request.GET.get('only_main') is not None:
            item_images = item_images.filter(is_main_image=True)
        return Response({'status':'ok','data':ItemImageSerializer(item_images,many=True).data})
    except Exception as e:
        print(e)
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
            except Exception as e:
                print(e)
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
    except Exception as e:
        print(e)
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
    except Exception as e:
        print(e)
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
        return Response({'status':'ok', 'data':{'user':CustomUserSerializer(user).data, 'isMyAccount':False}})
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
            if len(Collection.objects.filter(name='Моя коллекция')) == 0:
                collection = Collection(name='Моя коллекция')
                collection.save()
            collection = Collection.objects.get(name='Моя коллекция')
            UserCollection(user=user, collection=collection).save()
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

""" 
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
"""

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
        username = username.replace('<','')
        email = email.replace('<','')
        if username == '':
            return Response({'status':'error','message':'Не указан логин'})
        if email == '':
            return Response({'status':'error','message':'Не указан email'})
        if password == '':
            return Response({'status':'error','message':'Не указан пароль'})
        if User.objects.filter(username=username).exists():
            return Response({'status':'error','message':'Пользователь с таким логином уже существует'})
        if User.objects.filter(email=email).exists():
            return Response({'status':'error','message':'Пользователь с таким email уже существует'})
        
        try:
            user = User.objects.create_user(username, email, password)
            activate_hash = get_random_string(length=100)
            custom_user = CustomUser.objects.create(user=user, activate_hash=activate_hash)
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

@api_view(['POST'])
def change_avatar(request: HttpRequest) -> Response:
    try:
        if 'image' not in request.FILES:
            return Response({'status':'error','message':'Не указана картинка'})
        if not is_int(request.session.get('user_id')):
            return Response({'status':'error','message':'Пользователь не авторизован'})
        user = CustomUser.objects.get(user__id=int(request.session['user_id']))
        user.avatar = request.FILES['image']
        user.save()
        return Response({'status':'ok','data':{'avatar_url':user.avatar.url}})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})
    
@api_view(['POST'])
def change_other_user_info(request: HttpRequest) -> Response:
    try:

        if not is_int(request.session.get('user_id')):
            return Response({'status':'error','message':'Пользователь не авторизован'})
        user = CustomUser.objects.get(user__id=int(request.session['user_id']))
        fullname = request.data.get('fullname')
        birth_date = request.data.get('birth_date')
        country = request.data.get('country')
        languages = request.data.get('languages')
        about_me = request.data.get('about_me')
        city = request.data.get('city')
        username = request.data.get('username')
        new_password = request.data.get('new_password')
        email = request.data.get('email')
        if fullname is not None and fullname!=user.fullname:
            fullname = fullname.replace('<','')
            if fullname != '':
                user.fullname = fullname
        if birth_date is not None and birth_date!=user.birth_date:
            birth_date = birth_date.replace('<','')
            if birth_date != '':
                user.birth_date = birth_date
        if is_int(country):
            if int(country)!=user.country.id:
                try:
                    country = Country.objects.get(id=int(country))
                except:
                    return Response({'status':'error','message':'Неизвестная страна'})
                user.country = country
        if languages is not None and languages!=user.languages:
            languages = languages.replace('<','')
            if languages != '':
                user.languages = languages
        if about_me is not None and about_me!=user.about_me:
            about_me = about_me.replace('<','')
            if about_me != '':
                user.about_me = about_me
        if city is not None and city!=user.city:
            city = city.replace('<','')
            if city != '':
                user.city = city
        if username is not None and username!=user.user.username:
            username = username.replace('<','')
            if len(User.objects.filter(username=username))>0:
                return Response({'status':'error','message':'Пользователь с таким логином уже существует'})
            if username != '':
                user.user.username = username
        if new_password is not None and new_password!='':
            user.user.set_password(new_password)
        if email is not None and email!=user.user.email:
            email = email.replace('<','')
            if len(User.objects.filter(email=email))>0:
                return Response({'status':'error','message':'Пользователь с таким email уже существует'})
            if email != '':
                user.user.email = email
        user.user.save()
        user.save()

        return Response({'status':'ok','data':CustomUserSerializer(user).data})
    except:
        return Response({'status':'error','message':'Неизвестная ошибка'})