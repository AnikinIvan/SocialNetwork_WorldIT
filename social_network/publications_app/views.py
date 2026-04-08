from django.views.generic.base import TemplateView

class PublicationsAppView(TemplateView):
    template_name = "publications_app/publications.html"
