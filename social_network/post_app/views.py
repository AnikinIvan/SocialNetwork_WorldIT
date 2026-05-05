from django.views.generic import FormView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import PostForm
from django.urls import reverse_lazy


class PostAppView(TemplateView):
    template_name = "post_app/post.html"


class PostCreateView(LoginRequiredMixin, FormView):
    template_name = "post_app/create_post.html"
    form_class = PostForm
    login_url = reverse_lazy("auth")
    success_url = reverse_lazy("create_post")

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()

        if self.request.method == "POST":
            kwargs["links"] = self.request.POST.getlist("links")
            kwargs["images"] = self.request.FILES.getlist("images")

        return kwargs

    def form_valid(self, form):
        form.save(author=self.request.user)
        return super().form_valid(form)