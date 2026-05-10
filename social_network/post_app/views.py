from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views.generic import FormView, ListView

from .forms import PostForm
from .models import Post


class PostAppView(LoginRequiredMixin, ListView):
    """
    List view for user posts.
    """
    model = Post
    template_name = "post_app/post.html"
    context_object_name = "posts"
    ordering = ["-created_at"]
    login_url = reverse_lazy("auth")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = PostForm()
        return context


class PostCreateView(LoginRequiredMixin, FormView):
    """
    View для створення публікації.

    Сторінка доступна тільки авторизованому користувачу.
    Форма відправляється через fetch, тому вим повертає JSON,
    а не звичайний HTML redirect.
    """

    template_name = "post_app/create_post.html"
    form_class = PostForm
    success_url = reverse_lazy("post_list")
    login_url = reverse_lazy("auth")

    def get_form_kwargs(self):
        """
        Передає форму додатковий параметр links.

        Шаблоні може бути кілька полів input name="links".
        request.POST.getlist("links") збирає їх у всі один список.
        """
        kwargs = super().get_form_kwargs()

        if self.request.method == "POST":
            kwargs["links"] = self.request.POST.getlist("links")
            kwargs["images"] = self.request.FILES.getlist("photos")

        return kwargs

    def form_valid(self, form):
        """
        Обробляє валідну форму.

        Зберігає пост з поточним користувачем як автором
        і повертає JSON-відповідь для JavaScript.
        """
        post = form.save(author=self.request.user)
        return JsonResponse(
            {
                "success": True,
                "message": "Публікація створено успішно",
                "redirect_url": str(self.success_url),
                "post_id": post.id,
            }
        )

    def form_invalid(self, form):
        """
        Обробляє невалідну форму.

        Повертає помилки у JSON-форматі, щоб JavaScript
        міг показати їх без перезавантаження сторінки.
        """
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors.get_json_data(),
            },
            status=400,
        )