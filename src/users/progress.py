from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Lesson(models.Model):
    title = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    url = models.URLField()

    def __str__(self):
        return self.title


class Section(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="sections")
    name = models.CharField(max_length=100)
    end_id = models.IntegerField()  # This is your new field

    def __str__(self):
        return f"{self.lesson.title} - {self.name} (End ID: {self.end_id})"



class LessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lesson_progress")
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'section')

    def __str__(self):
        return f"{self.user.email} - {self.section}"


class TestScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_scores')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    test_id = models.IntegerField()
    score = models.FloatField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson', 'test_id')

    def __str__(self):
        return f"{self.user.email} - {self.lesson.title} - Test {self.test_id}"
