from django.urls import path
from .views import ChatAppView

urlpatterns = [ 
    path("chats/", ChatAppView.as_view(), name = 'chats')
]