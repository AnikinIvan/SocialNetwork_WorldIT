from django.urls import reverse
from user_app.models import Friendship


def add_friend_request(current_user, other_user):
    friendship = Friendship.objects.filter(
        from_user=other_user,
        to_user=current_user,
        status="pending"
    ).first()
    if friendship:
        friendship.status = "accepted"
        friendship.save()
        return {"label": "Друзі"}

    Friendship.objects.get_or_create(
        from_user=current_user,
        to_user=other_user,
        defaults={"status": "pending"}
    )
    return {"label": "Очікування"}


def dismiss_recommendation(current_user, other_user):
    Friendship.objects.get_or_create(
        from_user=current_user,
        to_user=other_user,
        defaults={"status": "dismissed"}
    )
    return {"remove": True}


def accept_friend_request(current_user, other_user):
    friendship = Friendship.objects.filter(
        from_user=other_user,
        to_user=current_user,
        status="pending"
    ).first()

    if not friendship:
        return {"success": False, "message": "Запит не знайдено або вже опрацьований"}

    friendship.status = "accepted"
    friendship.save()

    return {
        "success": True,
        "redirect": reverse("user_profile", kwargs={"user_id": other_user.id})
    }

def delete_friendship(current_user, other_user):
    friendship = (
        Friendship.objects.filter(from_user=current_user, to_user=other_user).first()
        or Friendship.objects.filter(from_user=other_user, to_user=current_user).first()
    )

    if not friendship:
        return {"remove": True}

    if friendship.status == "pending" and friendship.from_user_id == other_user.id:
        # Вхідний запит, який ми відхиляємо — не видаляємо рядок,
        # а позначаємо dismissed, щоб людина не з'являлась у рекомендаціях
        friendship.status = "dismissed"
        friendship.save()
    else:
        # Розриваємо вже існуючу дружбу (unfriend) — видаляємо повністю,
        # людина знову може з'явитись у рекомендаціях
        friendship.delete()

    return {"remove": True}