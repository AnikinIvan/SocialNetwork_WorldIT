from django.views.generic.base import TemplateView

class PostAppView(TemplateView):
    template_name = "post_app/post.html"
