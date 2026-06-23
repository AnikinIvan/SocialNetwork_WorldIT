from django.urls import path
from .consumers import ChatConsumer, PresenceConsumer

websocket_urlpatterns = [
    path("chat/<int:chat_id>/", ChatConsumer.as_asgi()),
    path("presence/", PresenceConsumer.as_asgi()),
]