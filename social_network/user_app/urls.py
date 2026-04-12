from django.urls import path
from .views import UserAppView

urlpatterns = [ 
    path("user/", UserAppView.as_view(), name = 'user')
]