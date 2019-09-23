from .settings import MEDIA_URL, MEDIA_ROOT

from django.contrib import admin
from django.urls import re_path, include
from django.conf.urls.static import static

urlpatterns = [
    re_path('admin/', admin.site.urls),
    re_path(r'^core/', include('core.urls')),
]

urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
