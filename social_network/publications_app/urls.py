from django.urls import path
from .views import PublicationsAppView

urlpatterns = [
    path("publications/", PublicationsAppView.as_view(), name = "publications")
]