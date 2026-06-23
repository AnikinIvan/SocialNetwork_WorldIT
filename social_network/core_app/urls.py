from django.urls import path
from .views import *

urlpatterns = [
    path("", ShowAllPost.as_view(), name="home"),
    path('profile/<int:user_id>/', view=UserProfileView.as_view(), name='user_profile'),
    path('', UserProfileView.as_view(), name="save_details")
]
