from django.shortcuts import render, redirect
from django.views.generic import TemplateView, FormView, View
from .forms import *
from django.urls import reverse_lazy
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login
from django.shortcuts import get_object_or_404
from .utils import send_verification_code_email

# Create your views here.
class AuthTemplateView(TemplateView):
    template_name = 'user_app/auth.html'
    
    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        context["form_register"] = UserCreationForm()
        context["form_login"] = LoginForm()
        context["form_confirm"] = EmailVerificationForm()
        return context

class RegisterView(View):
    def post(self, request, *args, **kwargs):
        form = UserCreationForm(self.request.POST)
        print('Користувач був збережений')
        if form.is_valid():
            user = form.save()

            try:
                send_verification_code_email(user)
                email_sent = True
            except:
                email_sent = False

            return JsonResponse({
                "success": True,
                "message": "Реєстрація успішна"
            })
        
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors.get_json_data(),
            },
            status = 400
            )
    
class LoginView(View):
    def post(self, request, *args, **kwargs):
        form = LoginForm(request = request, data = request.POST)
        if form.is_valid():
            user = form.get_user()
            print(user)
            login(request, user)
            return JsonResponse({
                "success": True,
                "message": "Користувач успішно залогінився"
            })
    
class ConfirmEmailView(View):
    def post(self, request, *args, **kwargs):
        form = EmailVerificationForm(request.POST) 
        email = request.POST.get("email")
        user = get_object_or_404(User, email = email)
        if user.email_confirmed:
            return JsonResponse({
                "success": False,
                "message": "E-mail вже підтверджено."
            }, status = 400 )
        if form.is_valid():
            entered_code = form.cleaned_data["code"]
            if user.confirmed_code == entered_code:
                user.email_confirmed = True
                user.is_active = True
                user.confirmed_code = None
                user.save()
                login(request, user)
                return JsonResponse({
                "success": True,
                "message": "E-mail підтверджено.",
                "redirect": "/"
            }) 
            else:
                return JsonResponse({
                "success": False,
                "message": "Код пітвердження невірний."
            }, status = 400 ) 

