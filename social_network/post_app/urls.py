from django.urls import path
from .views import *

urlpatterns = [
    path("", PostListView.as_view(), name="post"),
    path("create/", view=PostCreateView.as_view(), name='post_create'),
    
]