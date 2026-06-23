import random
from django.core.mail import send_mail
from django.conf import settings

def send_verification_code_email(user):
    code = str(random.randint(100000, 999999))
    user.confirmed_code = code
    user.save(update_fields=['confirmed_code'])
    try:
        send_mail(
            subject="Підтвердження e-mail адреси",
            message=f"Ваш код підтвердження: {code}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
    except Exception as e:
        user.confirmed_code = None
        user.save(update_fields=['confirmed_code'])
        raise e