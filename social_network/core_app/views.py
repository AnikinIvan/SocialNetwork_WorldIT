from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from post_app.forms import PostForm
from post_app.models import Post
from django.core.paginator import Paginator
from django.template.loader import render_to_string

from .forms import UserDetailsForm
from chat_app.models import Chat
from user_app.models import Friendship

from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from user_app.models import User

class ShowAllPost(ListView, LoginRequiredMixin):
    model = Post
    template_name = 'core_app/core.html' 
    context_object_name = 'posts'
    paginate_by = 5
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_create_post'] = PostForm()
        
        if self.request.user.is_authenticated:
            context["personal_chats"] = Chat.objects.filter(
                users=self.request.user, 
                is_group=False
            ).order_by("id")

            friend_requests = Friendship.objects.filter(
                to_user=self.request.user,
                status='pending'
            ).select_related('from_user')

            if self.request.session.pop('show_details_modal', False):
                context['show_details_modal'] = True
            
            context["followers"] = [fr.from_user for fr in friend_requests]
            context['form_details'] = UserDetailsForm(instance=self.request.user)
            if self.request.session.pop('show_details_modal', False):
                context['show_details_modal'] = True
        return context
    
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
    



class UserProfileView(LoginRequiredMixin, ListView):
    model = Post
    template_name = 'core_app/profile.html'
    context_object_name = 'posts'
    paginate_by = 5
    login_url = reverse_lazy('auth')

    def get_queryset(self):
        self.profile_user = get_object_or_404(User, id=self.kwargs['user_id'])
        # ЗАМІНИ 'author' на реальну назву поля в Post,
        # яке посилається на користувача-автора
        return Post.objects.filter(author=self.profile_user).order_by('-id')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['profile_user'] = self.profile_user
        context['form_create_post'] = PostForm()

        current_user = self.request.user
        context['is_own_profile'] = current_user.id == self.profile_user.id

        if not context['is_own_profile']:
            friendship = Friendship.objects.filter(
                from_user=current_user, to_user=self.profile_user
            ).first() or Friendship.objects.filter(
                from_user=self.profile_user, to_user=current_user
            ).first()
            context['friendship_status'] = friendship.status if friendship else None

        return context

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