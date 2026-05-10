from django.urls import path
from .views import PostAppView, PostCreateView

urlpatterns = [
    path("", PostAppView.as_view(), name="post_list"),
    path("create/", view=PostCreateView.as_view(), name='post_create'),
    
]