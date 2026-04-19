from django import forms

class UserRegisterForm(forms.Form):
    email = forms.EmailField(label='Електронна пошта')
    password = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput
    )
    confirm_password = forms.CharField(
        label="Підтверди пароль", 
        widget=forms.PasswordInput
    )

class UserAutrForm(forms.Form):
    email = forms.EmailField(
        label='Електронна пошта'
    )
    password = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput
        )

class UserConfirmPasswordForm(forms.Form):
    confirm_email = forms.CharField(
        label="Код підтвердження", 
        max_length=6, 
        min_length=6, 
        widget=forms.TextInput(
            attrs = {
                "placeholder": "confirm_email"
            }
        )
    )

