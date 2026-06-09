from django.views.generic import TemplateView
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from post_app.forms import PostForm
from post_app.models import Post
from django.core.paginator import Paginator
from django.template.loader import render_to_string


# Create your views here.

class ShowAllPost(ListView, LoginRequiredMixin):
    model = Post
    template_name = 'core_app/core.html' 
    context_object_name = 'posts'
    paginate_by = 5
    # 
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_create_post'] = PostForm()
        return context
    # 
    def get(self, request, *args, **kwargs):
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            queryset = self.get_queryset()        
            paginator = Paginator(queryset, self.paginate_by)
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
            if int(page_number) > paginator.num_pages:
                return JsonResponse({'success': False})
            return JsonResponse({
                'success': True,
                'html': render_to_string('post_app/particles/show_post.html', {'posts': page_obj.object_list})
            })
        
        return super().get(request, *args, **kwargs)

