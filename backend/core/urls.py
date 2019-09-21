from django.urls import re_path
from .views import  FolderCreateView, FolderUpdateView,\
                    ImageView, ImageCreateView, ImageUpdateView, ImageDeleteView,\
                    SearchView

urlpatterns = [
    re_path(r'^folder/create/$', FolderCreateView.as_view()),
    re_path(r'^folder/update/(?P<key>[0-9a-f]{32})/$', FolderUpdateView.as_view()),

    re_path(r'^image/(?P<key>[0-9a-f]{32})/$', ImageView.as_view()),
    re_path(r'^image/create/$', ImageCreateView.as_view()),
    re_path(r'^image/update/(?P<key>[0-9a-f]{32})/$', ImageUpdateView.as_view()),
    re_path(r'^image/delete/(?P<key>[0-9a-f]{32})/$', ImageDeleteView.as_view()),

    re_path(r'^search/$', SearchView.as_view()),
]
