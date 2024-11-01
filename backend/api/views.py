from django.shortcuts import render
from rest_framework.response import Response
from django.http import JsonResponse
from django.http import HttpRequest
from django.db.models import Q
from rest_framework.decorators import api_view
from typing import List
from django.contrib.auth import authenticate, login, logout
from main.models import Glue, Color, Stamp, Format, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item, Country, HistroryMoment, CustomUser, ItemImage, Collection, CollectionItem, UserCollection, Title, News
from api.serializers import ItemSerializer, CountrySerializer,HistoryMomentSerializer, GlueSerializer, ColorSerialzier, StampSerializer, FormatSerializer, ThemeSerializer, PressSerialzier, EmissionSerializer, DesignerSerializer, CatalogSerializer, CurrencySerializer, WatermarkSerializer, CustomUserSerializer, ItemListSerializer, ItemImageSerializer, UserCollectionSerializer, CustomUserListSerializer, TitleSerializer, NewsSerializer
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
@api_view(['GET'])
def get_titles(request, item_id=None):
    try:
        if item_id is not None:
            try:
                title = News.objects.get(id=int(item_id))
                return Response({'status':'ok', 'data':NewsSerializer(title).data})
            except News.DoesNotExist:
                return Response({'status':'error', 'message':'Нет названия с таким id'})
            except Exception as e:
                print(e)
                return Response({'status':'error', 'message':'Неизвестная ошибка'})
        limit = request.GET.get('limit')
        offset = request.GET.get('offset')
        if not is_int(limit) or int(limit)<=0:
            limit = 10
        limit = int(limit)
        if not is_int(offset) or int(offset)<0:
            offset = 0
        offset = int(offset)
        titles = News.objects.all().order_by('-id')[offset:offset+limit]
        return Response({'status':'ok', 'data':NewsSerializer(titles, many=True).data, 'total':len(News.objects.all())})
    except Exception as e:
        print(e)
        return Response({'status':'error', 'message':'Неизвестная ошибка'})

@api_view(['GET'])
def get_articles(request):
    try:
        data = request.GET
        ids_list = data.getlist('item_ids[]')
        if len(ids_list) == 0:
            return Response({'status':'ok', 'data':[]})
        articles = Titles.objects.filter(item__id__in=ids_list)
        limit = request.GET.get('limit')
        offset = request.GET.get('offset')
        if not is_int(limit) or int(limit)<=0:
            limit = 10
        limit = int(limit)
        if not is_int(offset) or int(offset)<0:
            offset = 0
        offset = int(offset)
        articles = articles.order_by('-id')
        articles = articles[offset:offset+limit]
        return Response({'status':'ok', 'data':TitleSerializer(articles, many=True).data, 'total':len(Titles.objects.all())})
    except Exception as e:
        print(e)
        return Response({'status':'error', 'message':'Неизвестная ошибка'})
@api_view(['GET'])
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
                item = Item.objects.get(id=id, is_active=True)
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
            items = Item.objects.filter(is_active=True)
        except:
            return Response({'status':'error', 'message':'Не удалось получить предметы'})

        # Получение + валидация фильтров
        query = request.GET.get('query')
        if query is not None:
            items = items.filter(name__icontains=query)
            
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
def get_items_from_collection(request:HttpRequest):
    try:
        collection_id = request.GET.get('collection_id')
        if not is_int(collection_id):
            return Response({'status':'error','message':'Не указана коллекция'})
        user_id = request.GET.get('user_id')
        if not is_int(user_id):
            user_id = request.session.get('user_id')
            if not is_int(user_id):
                return Response({'status':'error','message':'Не указан пользователь'})
            try:
                user_id = CustomUser.objects.get(user__id=int(user_id)).id
            except CustomUser.DoesNotExist:
                return Response({'status':'error','message':'Не указан пользователь'})
        try:
            user = CustomUser.objects.get(id=int(user_id))
        except CustomUser.DoesNotExist:
            return Response({'status':'error','message':'Пользователь не найден'})

        try:
            collection = Collection.objects.get(id=int(collection_id))
        except Collection.DoesNotExist:
            return Response({'status':'error','message':'Коллекция не найдена'})
        
        limit = request.GET.get('limit')
        if not is_int(limit) or int(limit)<=0:
            limit = 10
        offset = request.GET.get('offset')
        if not is_int(offset) or int(offset)<0:
            offset=0
        
        try:
            user_collection = UserCollection.objects.get(user=user,collection=collection)
            if not user_collection.can_see_other:
                if not is_int(request.session.get('user_id')):
                    return Response({'status':'error','message':'Пользователь не авторизован'})
                if int(user.user.id) != int(request.session.get('user_id')) and  not User.objects.get(id=int(request.session.get('user_id'))).is_superuser:
                    return Response({'status':'error','message':'Коллекция не принадлежит пользователю'})
        except UserCollection.DoesNotExist:
            return Response({'status':'error','message':'Коллекция не принадлежит пользователю'})
        
        collection_items = CollectionItem.objects.filter(user_collection=user_collection,count__gt=0)
        items_unit = list(set([item.item for item in collection_items]))
        total = len(items_unit)
        items_unit = items_unit[int(offset):int(offset)+int(limit)]
        response_data = []
        for item in items_unit:
            item_data = {}
            item_data['id'] = item.id
            item_data['name'] = item.name
            image = ItemImage.objects.filter(item=item,is_main_image=True)
            if len(image) > 0:
                item_data['image'] = image[0].image.url
            else:
                item_data['image'] = None
            qualities_counters = {}
            for quality in ['good','bad']:
                quality_item = collection_items.filter(item=item,quality=quality)
                if len(quality_item) == 0:
                    qualities_counters[quality] = 0
                    continue
                qualities_counters[quality] = quality_item[0].count
            item_data['qualities_counters'] = qualities_counters
            response_data.append(item_data)
        return Response({'status':'ok','data':{'items':response_data,'total':total}})
                
    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Неизвестная ошибка'})
@api_view(['GET'])
def get_item_image_urls(request:HttpRequest)->Response:
    try:
        items_ids = request.GET.getlist('items_ids[]')
        if len(items_ids) == 0:
            return Response({'status':'ok','data':[]})
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
        if world_part == 'all':
            try:
                countries = Country.objects.filter()
                return Response({'status':'ok','data':CountrySerializer(countries,many=True).data})
            except: 
                return Response({'status':'error','message':'Ошибка получения стран'})
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

@api_view(['GET'])
def get_users_list(request: HttpRequest) -> Response:
    try:
        query = request.GET.get('query')
        limit = request.GET.get('limit')
        if not is_int(limit) or int(limit)<=0:
            limit = 30
        else:
            limit = int(limit)
        offset = request.GET.get('offset')
        if not is_int(offset) or int(offset)<0:
            offset = 0
        else:
            offset = int(offset)
        users = CustomUser.objects.all()
        if query is not None:
            users = users.filter(user__username__icontains=query)
        total = len(users)
        users = users[offset:offset+limit]
        return Response({'status':'ok','data':CustomUserListSerializer(users,many=True).data,'total':total})
    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Неизвестная ошибка'})

@api_view(['GET'])
def get_my_private_settings(request:HttpRequest)->Response:
    try:
        user_id = request.session.get('user_id')
        if not is_int(user_id):
            return Response({'status':'error','message':'Пользователь не авторизован'})
        try:
            user = CustomUser.objects.get(user__id=int(user_id))
        except CustomUser.DoesNotExist:
            return Response({'status':'error','message':'Пользователь не найден'})
        return Response({'status':'ok','data':{'show_birth_date':user.show_birth_date, 'show_fullname':user.show_fullname}})
    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Неизвестная ошибка'})

@api_view(['GET'])
def get_user_collections(request: HttpRequest, user_id = None) -> Response:
    try:
        current_user_id = request.session.get('user_id')
        if not is_int(current_user_id):
            return Response({'status':'error', 'message':'Пользователь не авторизован'})
        
        current_user_id = int(current_user_id)
        
        if user_id is None:
            user_id = current_user_id
        else:
            user_id = CustomUser.objects.get(id=int(user_id)).user.id
        
        if not is_int(user_id):
            return Response({'status':'error', 'message':'Не указан пользователь'})
        
        try:
            user = CustomUser.objects.get(user__id=int(user_id))
        except CustomUser.DoesNotExist:
            return Response({'status':'error','message':'Пользователь не найден'})
        
        collections = UserCollection.objects.filter(user=user)
        if int(user_id) != current_user_id and not User.objects.get(id=current_user_id).is_superuser:
            collections = collections.filter(can_see_other=True)
        if len(collections) == 0:
            return Response({'status':'ok', 'data':[]})
        return Response({'status':'ok', 'data': UserCollectionSerializer(collections, many=True).data})
    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Неизвестная ошибка'})

@api_view(['GET'])
def get_collection_quility_count(request: HttpRequest) -> Response:
    try:
        current_user_id = request.session.get('user_id')
        if not is_int(current_user_id):
            return Response({'status':'error', 'message':'Пользователь не авторизован'})
        collection_id = request.GET.get('collection_id')
        if not is_int(collection_id):
            return Response({'status':'error', 'message':'Не указана коллекция'})
        try:
            custom_user = CustomUser.objects.get(user__id=int(current_user_id))
        except CustomUser.DoesNotExist:
            return Response({'status':'error', 'message':'Пользователь не найден'})
        try:
            collection = Collection.objects.get(id=int(request.GET.get('collection_id')))
        except Collection.DoesNotExist:
            return Response({'status':'error', 'message':'Коллекция не найдена'})
        quality = request.GET.get('quality')
        if quality not in ['bad','good']:
            return Response({'status':'error', 'message':'Неизвестное качество'})
        item_id = request.GET.get('item_id')
        if not is_int(item_id):
            return Response({'status':'error', 'message':'Не указан предмет'})
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'status':'error', 'message':'Предмет не найден'})
        try:
            user_collection = UserCollection.objects.get(user=custom_user, collection=collection)
        except UserCollection.DoesNotExist:
            return Response({'status':'error', 'message':'Коллекция не найдена'})
        if len(CollectionItem.objects.filter(user_collection=user_collection, item=item, quality=quality)) == 0:
            CollectionItem(user_collection=user_collection, item=item, quality=quality).save()
            return Response({'status':'ok', 'data':{'count':0}})
        return Response({'status':'ok', 'data':{'count':CollectionItem.objects.filter(user_collection=user_collection, item=item, quality=quality)[0].count}})
    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Неизвестная ошибка'})

"""
    POST
"""

@api_view(['POST'])
def add_collection(request:HttpRequest) -> Response:
    try:
        user_id = request.session.get('user_id')
        if not is_int(user_id):
            return Response({'status':'error', 'message':'Пользователь не авторизован'})
        custom_user = CustomUser.objects.get(user__id=int(user_id))
        data = request.data
        collection_name = data.get('collection_name')
        if collection_name is None:
            return Response({'status':'error', 'message': 'Не указано название коллекции'})
        collection_name = collection_name.replace('<','').replace('>','')
        if len(Collection.objects.filter(name=collection_name)) == 0:
            Collection(name=collection_name).save()
        collection = Collection.objects.get(name=collection_name)
        if len(UserCollection.objects.filter(user=custom_user, collection=collection)) != 0:
            return Response({'status':'error','message':'Такая коллекция уже существует'})
        UserCollection(user=custom_user, collection=collection).save()
        return Response({'status':'ok', 'data':UserCollectionSerializer(UserCollection.objects.get(user=custom_user, collection=collection)).data})
    except Exception as e:
        print(e)
        return Response({'status':'error', 'message':'Неизвестная ошиюка'})

@api_view(['POST'])
def change_private_settings(request:HttpRequest) -> Response:
    try:
        user_id = request.session.get('user_id')
        if not is_int(user_id):
            return Response({'status':'error', 'message':'Пользователь не авторизован'})
        try:
            custom_user = CustomUser.objects.get(user__id=int(user_id))
        except CustomUser.DoesNotExist:
            return Response({'status':'error', 'message':'Пользователь не найден'})
        data = request.data
        show_birth_date = data.get('show_birth_date')
        show_fullname = data.get('show_fullname')
        collection_id = data.get('collection_id')
        collection_can_see_other = data.get('collection_can_see_other')
        if show_birth_date is None or show_fullname is None or not is_int(collection_id) or collection_can_see_other is None:
            return Response({'status':'error', 'message':'Не достаточно данных'})
        try:
            user_collection = UserCollection.objects.get(user=custom_user, collection__id=int(collection_id))
        except UserCollection.DoesNotExist:
            return Response({'status':'error', 'message':'Коллекция не найдена'})
        custom_user.show_birth_date = show_birth_date
        custom_user.show_fullname = show_fullname
        user_collection.can_see_other = collection_can_see_other
        custom_user.save()
        user_collection.save()
        return Response({'status':'ok'})

    except Exception as e:
        print(e)
        return Response({'status':'error', 'message':'Неизвестная ошиюка'})

@api_view(['POST'])
def add_new_item(request:HttpRequest) -> Response:
    try:
        data = request.data
        user_id = request.session.get('user_id')
        if not is_int(user_id):
            return Response({'status':'error', 'message':'Пользователь не авторизован'})
        history_moment_id = data.get('history_moment')
        if not is_int(history_moment_id):
            return Response({'status':'error', 'message':'Не указан исторический момент'})
        try:
            history_moment = HistroryMoment.objects.get(id=int(history_moment_id))
        except HistroryMoment.DoesNotExist:
            return Response({'status':'error', 'message':'Исторический момент не найден'})
        name = data.get('name')
        if name is None or name.replace('<','')=='':
            return Response({'status':'error','message':'Не указано название предмета'})
        name = name.replace('<','')
        if len(Item.objects.filter(name=name)) != 0:
            return Response({'status':'error','message':'Такой предмет уже существует'})
        category = data.get('category')
        if category is None:
            category = 'mark'
        images = []
        if data.get('file1') is not None:
            images.append(data.get('file1'))
        if data.get('file2') is not None:
            images.append(data.get('file2'))
        if data.get('file3') is not None:
            images.append(data.get('file3'))
        if data.get('file4') is not None:
            images.append(data.get('file4'))
        if data.get('file5') is not None:
            images.append(data.get('file5'))
        if len(images) == 0:
            return Response({'status':'error','message':'Загрузите хотя бы 1 изображение'})
        item = Item(histrory_moment=history_moment, name=name, category=category)
        year = data.get('year')
        if is_int(year) and int(year)>=0:
            item.year = int(year)
        emission = data.get('emission')
        if emission is not None and emission.replace('<','')!='':
            emission = emission.replace('<','')
            filtered_emission = Emission.objects.filter(name=emission)
            if len(filtered_emission)!=0:
                item.emission = filtered_emission[0]
            else:
                emission_object = Emission(name=emission)
                emission_object.save()
                item.emission = emission_object
        format = data.get('format')
        if format is not None and format.replace('<','')!='':
            format = format.replace('<','')
            filtered_format = Format.objects.filter(name=format)
            if len(filtered_format)!=0:
                item.format = filtered_format[0]
            else:
                format_object = Format(name=format)
                format_object.save()
                item.format = format_object
        stamp = data.get('stamp')
        if stamp is not None and stamp.replace('<','')!='':
            stamp = stamp.replace('<','')
            filtered_stamp = Stamp.objects.filter(name=stamp)
            if len(filtered_stamp)!=0:
                item.stamp = filtered_stamp[0]
            else:
                stamp_object = Stamp(name=stamp)
                stamp_object.save()
                item.stamp = stamp_object
        color = data.get('color')
        if color is not None and color.replace('<','')!='':
            color = color.replace('<','')
            filtered_color = Color.objects.filter(name=color)
            if len(filtered_color)!=0:
                item.color = filtered_color[0]
            else:
                color_object = Color(name=color)
                color_object.save()
                item.color = color_object
        glue = data.get('glue')
        if glue is not None and glue.replace('<','')!='':
            glue = glue.replace('<','')
            filtered_glue = Glue.objects.filter(name=glue)
            if len(filtered_glue)!=0:
                item.glue = filtered_glue[0]
            else:
                glue_object = Glue(name=glue)
                glue_object.save()
                item.glue = glue_object
        theme = data.get('theme')
        if theme is not None and theme.replace('<','')!='':
            theme = theme.replace('<','')
            filtered_theme = Theme.objects.filter(name=theme)
            if len(filtered_theme)!=0:
                item.theme = filtered_theme[0]
            else:
                theme_object = Theme(name=theme)
                theme_object.save()
                item.theme = theme_object
        watermark = data.get('watermark')
        if watermark is not None and watermark.replace('<','')!='':
            watermark = watermark.replace('<','')
            filtered_watermark = Watermark.objects.filter(name=watermark)
            if len(filtered_watermark)!=0:
                item.watermark = filtered_watermark[0]
            else:
                watermark_object = Watermark(name=watermark)
                watermark_object.save()
                item.watermark = watermark_object
        currency = data.get('currency')
        if currency is not None and currency.replace('<','')!='':
            currency = currency.replace('<','')
            filtered_currency = Currency.objects.filter(name=currency)
            if len(filtered_currency)!=0:
                item.currency = filtered_currency[0]
            else:
                currency_object = Currency(name=currency)
                currency_object.save()
                item.currency = currency_object
        press = data.get('pressure')
        if press is not None and press.replace('<','')!='':
            press = press.replace('<','')
            filtered_press = Press.objects.filter(name=press)
            if len(filtered_press)!=0:
                item.press = filtered_press[0]
            else:
                press_object = Press(name=press)
                press_object.save()
                item.press = press_object
        designer_surname = data.get('designer_surname')
        designer_name = data.get('designer_name') 
        if designer_name is not None and designer_surname is not None and designer_surname.replace('<','')!='' and designer_name.replace('<','')!='':
            designer_name = designer_name.replace('<','')
            designer_surname = designer_surname.replace('<','')
            designer_filtered = Designer.objects.filter(name=designer_name,surname=designer_surname)  
            if len(designer_filtered)!=0:
                item.designer = designer_filtered[0]
            else:
                designer_object = Designer(name=designer_name, surname=designer_surname)
                designer_object.save()
                item.designer = designer_object
        catalog = data.get('catalogure')
        if catalog is not None and catalog.replace('<','')!='':
            catalog = catalog.replace('<','')
            filtered_catalog = Catalog.objects.filter(name=catalog)
            if len(filtered_catalog)!=0:
                item.catalog = filtered_catalog[0]
            else:
                catalog_object = Catalog(name=catalog)
                catalog_object.save()
                item.catalog = catalog_object
        nominal = data.get('nominal')
        if is_float(nominal):
            item.nominal = float(nominal)
        width = data.get('width')
        if is_float(width):
            item.width = float(width)
        height = data.get('height')
        if is_float(height):
            item.height = height
        item.save()
        
        item_image_main = ItemImage(item=item,image=images[0],is_main_image=True)
        item_image_main.save()
        for image in images[1::]:
            item_image = ItemImage(item=item,image=image)
            item_image.save()
        return Response({'status':'ok'})
    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Неизвестная ошибка'})


@api_view(['POST'])
def add_or_remove_item_in_my_collection(request:HttpRequest) -> Response:
    try:
        user_id = request.session.get('user_id')
        if not is_int(user_id):
            return Response({'status':'error', 'message':'Пользователь не авторизован'})
        user_id = int(user_id)
        data = request.data
        item_id = data.get('item_id')
        collection_id = data.get('collection_id')
        quality = data.get('quality')
        if not is_int(item_id) or not is_int(collection_id) or quality is None:
            return Response({'status':'error', 'message':'Не указаны id предмета или коллекции'})
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'status':'error', 'message':'Предмет не найден'})
        
        try:
            collection = Collection.objects.get(id=collection_id)
        except Collection.DoesNotExist:
            return Response({'status':'error', 'message':'Коллекция не найдена'})
        try:
            custom_user = CustomUser.objects.get(user__id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'status':'error', 'message':'Пользователь не найден'})
        try:
            user_collection = UserCollection.objects.get(user=custom_user, collection=collection)
        except UserCollection.DoesNotExist:
            return Response({'status':'error', 'message':'Предмет не находится в коллекции'})
        except:
            return Response({'status':'error', 'message':'Неизвестная ошибка'})
        
        if len(CollectionItem.objects.filter(item=item, user_collection=user_collection, quality=quality)) == 0:
            CollectionItem(item=item, user_collection=user_collection,quality=quality).save()

        collection_item = CollectionItem.objects.get(item=item, user_collection=user_collection,quality=quality)
        if data.get('isMinus') is None:
            collection_item.count +=1
            collection_item.save()
        else:
            if collection_item.count == 0:
                return Response({'status':'error','message':'Не может быть меньше 0'})
            collection_item.count-=1
            collection_item.save()
        return Response({'status':'ok','data':{'counter':collection_item.count}})
        

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
