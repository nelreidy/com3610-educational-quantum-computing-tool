from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.user_login, name='login'),
    path('login', views.user_login, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('signup', views.user_signup, name='signup'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('password_change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('change_email/', views.change_email, name='change_email'),
    path('change_email_done/', auth_views.TemplateView.as_view(template_name='registration/change_email_done.html'), name='change_email_done'),
    path('profile', views.get_profile, name='profile'), 
    path('delete_account/', views.delete_account, name='delete_account'),
    path('dashboard', views.dash, name='dashboard'),
    path('circuit_table/', views.get_circuit_table, name='circuit_table'),
    path('builder', views.build, name='builder'),
    path('simulate', views.simulate, name='simulate'),
    path('save_circuit/', views.save_circuit, name='save_circuit'),
    path('download_circuit/<int:pk>/', views.download_circuit, name='download_circuit'),
    path('delete_circuit/<int:pk>/', views.delete_circuit, name='delete_circuit'),
    path('introduction-to-quantum-computing', views.intro, name='introduction-to-quantum-computing'),
    path('fundamentals-of-quantum-computing', views.fundamentals, name='fundamentals-of-quantum-computing'),
    path('quantum-circuits', views.quantum_circuits, name='quantum-circuits'),
    path('error-correction', views.error_correction, name='error-correction'),
    path('running-quantum-programs', views.running_programs, name='running-quantum-programs'),
    path('quantum-phenomena', views.quantum_phenomena, name='quantum-phenomena'),
    path('quantum-algorithms', views.quantum_algorithms, name='quantum-algorithms'),
    #progress 
    path('api/mark-progress/', views.mark_section_complete, name='mark_section_complete'),
    path("api/submit-test/", views.submit_test_score, name="submit_test_score")
]

if settings.DEBUG:
    # DONT DO IN PROD
    from django.conf.urls.static import static
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
