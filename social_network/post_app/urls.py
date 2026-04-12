from django.urls import path
from .views import PostAppView

urlpatterns = [
    path("post/", PostAppView.as_view(), name = "publications")
]