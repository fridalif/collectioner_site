from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpRequest
from rest_framework.decorators import api_view

from main.models import Glue, Color, Stamp, Format, Country, Theme, Press, Emission, Designer, Catalog, Currency, Watermark, Item

def is_int(obj):
    if obj is None:
        return False
    try:
        obj = int(obj)
        return True
    except:
        return False

def is_float(obj):
    if obj is None:
        return False
    try:
        obj = float(obj)
        return True
    except:
        return False

@api_view(['GET'])
def get_items(request:HttpRequest)->Response:
    limit = request.GET.get('limit')
    offset = request.GET.get('offset')
    if limit is None:
        limit = 10
    if limit > 100:
        limit = 100
    if offset is None:
        offset = 0