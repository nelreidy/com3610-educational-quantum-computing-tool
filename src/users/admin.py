from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser
from .progress import LessonProgress, TestScore, Lesson, Section


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("email", "is_staff", "is_active",)
    list_filter = ("email", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)



admin.site.register(CustomUser, CustomUserAdmin)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "url")
    search_fields = ("title",)


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("name", "lesson", "end_id")
    list_filter = ("lesson",)


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "section", "is_completed", "last_updated")
    list_filter = ("is_completed", "section__lesson")


@admin.register(TestScore)
class TestScoreAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "test_id", "score", "completed", "last_updated")
    list_filter = ("lesson", "completed")
    search_fields = ("user__email",)


