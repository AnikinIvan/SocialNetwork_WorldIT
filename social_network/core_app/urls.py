from django.urls import path
from .views import *

urlpatterns = [
    path("", ShowAllPost.as_view(), name="home"),
]
