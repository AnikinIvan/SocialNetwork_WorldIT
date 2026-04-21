from django.shortcuts import render, redirect
from django.views.generic import TemplateView, FormView
from .forms import *
from django.urls import reverse_lazy

# Create your views here.
class AuthTemplateView(TemplateView):
    template_name = 'user_app/auth.html'
    
    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        context["form_register"] = UserRegisterForm()
        context["form_login"] = UserAutrForm()
        context["form_confirm"] = UserConfirmPasswordForm()
        return context

class RegisterForm(FormView):
    form_class = UserRegisterForm
    template_name = 'user_app/auth.html'
    success_url = reverse_lazy('auth')
    def form_valid(self, form):
        email = form.cleaned_data.get('email')
        password = form.cleaned_data.get('password')
        confirm_password = form.cleaned_data.get('confirm_password')
        return super().form_valid(form)
    
class AuthForm(FormView):
    form_class = UserAutrForm
    template_name = 'user_app/auth.html'
    success_url = reverse_lazy('auth')
    def form_valid(self, form):
        email = form.cleaned_data.get('email')
        password = form.cleaned_data.get('password')
        return super().form_valid(form)
    
class ConfirmPasswordForm(FormView):
    form_class = UserConfirmPasswordForm
    template_name = 'user_app/auth.html'
    success_url = reverse_lazy('auth')
    def form_valid(self, form):
        confirm_password = form.cleaned_data.get('confirm_password')
        return super().form_valid(form)
    