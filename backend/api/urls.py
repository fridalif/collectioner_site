from django.urls import path
from api.views import get_items, get_countries, get_history_moments, get_designers,  get_other_filters_except_designers
from api.views import add_new_item, is_logged_in, get_csrf, login_user, register_user, activate_user, get_user, get_item_image_urls
from api.views import logout_user, change_avatar, change_other_user_info
urlpatterns = [
    path('get_items/',get_items,name='get_items'),
    path('get_items/<int:id>/',get_items,name='get_item'),
    path('get_item_image_urls/',get_item_image_urls,name='get_item_image_urls'),
    path('get_csrf/', get_csrf, name='get_csrf'),
    path('get_countries/',get_countries,name='get_countries'),
    path('get_countries/<int:id>/',get_countries, name='get_country'),
    path('get_history_moments/',get_history_moments,name='get_history_moments'),
    path('get_history_moments/<int:id>/',get_history_moments, name='get_history_moment'),
    path('get_designers/',get_designers,name='get_designers'),
    path('get_other_filters/',get_other_filters_except_designers,name='get_other_filters'),
  #  path('get_my_collection_counters/',get_my_collection_counters,name='get_my_collection_counters'),
    path('get_user/', get_user, name='get_users'),
    path('get_user/<int:id>/', get_user, name='get_user'),
    path('is_logged_in/',is_logged_in,name='is_logged_in'),
    path('add_new_item/',add_new_item,name='add_new_item'),
    #path('add_or_remove_item_in_my_collection/',add_or_remove_item_in_my_collection,name='add_or_remove_item_in_my_collection'),
    path('login/',login_user,name='login'),
    path('register/',register_user,name='register'),
    path('activate_user/<str:hash>/',activate_user,name='activate_user'),
    path('logout/',logout_user,name='logout'),
    path('change_avatar/',change_avatar,name='change_avatar'),
    path('change_other_user_info/',change_other_user_info,name='change_other_user_info'),
]