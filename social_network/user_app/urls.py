from django.urls import path
from .views import *

urlpatterns = [
    path(route='', view= AuthTemplateView.as_view(), name= 'auth'),
    path(route='register/', view= RegisterForm.as_view(), name= 'register'),
    path(route='login/', view= AuthForm.as_view(), name= 'login'),
    path(route='confirm/', view= ConfirmPasswordForm.as_view(), name= 'confirm'),
]
