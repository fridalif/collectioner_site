
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
import backend.settings as settings

urlpatterns = [
    path('admin-panel-collectioner/', admin.site.urls),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)