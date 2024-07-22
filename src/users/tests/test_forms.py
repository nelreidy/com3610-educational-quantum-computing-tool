from django.test import TestCase
from django.contrib.auth import get_user_model
from users.forms import CustomUserCreationForm, CustomUserChangeForm, ChangeEmailForm

User = get_user_model()

class UserFormsTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(first_name='john', last_name='doe', email='john@example.com', password='testpassword123')
        User.objects.create_user(first_name='jane', last_name='doe', email='jane@example.com', password='testpassword123')

    def test_custom_user_creation_form_valid_data(self):
        form = CustomUserCreationForm(data={
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john_doe@example.com',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
        })
        self.assertTrue(form.is_valid())

    def test_custom_user_creation_form_password_mismatch(self):
        form = CustomUserCreationForm(data={
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john_doe@example.com',
            'password1': 'testpassword123',
            'password2': 'testpassword321',
        })
        self.assertFalse(form.is_valid())
        self.assertIn('password2', form.errors)

    def test_custom_user_change_form(self):
        form = CustomUserChangeForm(instance=self.user, data={'email': 'newjohn@example.com'})
        self.assertTrue(form.is_valid())

    def test_change_email_form_valid_data(self):
        form = ChangeEmailForm(data={'email': 'uniquejohn@example.com'})
        self.assertTrue(form.is_valid())

    def test_change_email_form_duplicate_email(self):
        form = ChangeEmailForm(data={'email': 'jane@example.com'})
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors)
        self.assertEqual(form.errors['email'], ['This email address is already in use.'])
