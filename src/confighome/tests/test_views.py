"""
    File: test_views.py
    Author: Lea Button
    Date: 04-2024
"""
from contextlib import AbstractContextManager
from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
import json
import numpy as np
from django.contrib.auth import get_user_model
from users.forms import CustomUserCreationForm
from users.models import UserFile, CustomUser

class ViewTests(TestCase):
    """
    A class to test the Django Views
    """
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user('test@example.com', 'testpassword')
        self.client.login(email='test@example.com', password='testpassword')
        self.test_file = UserFile.objects.create(
            user=self.user,
            title="Test Circuit",
            description="A test circuit file.",
            uploaded_file='{"data": "This is a test file."}'
        )

    # -------------------------------------------------------------------------------------------
    # --------------------------------------- login TESTS ---------------------------------------
    # -------------------------------------------------------------------------------------------
    def test_login_get_request(self):
        """
        Test the login view with a GET request
        """
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/login.html')

    def test_login_success(self):
        """
        Test the login view with a valid POST request
        """
        response = self.client.post(reverse('login'), {
            'email': 'test@example.com',
            'password': 'testpassword'
        })
        self.assertRedirects(response, '/dashboard')

    def test_login_failure(self):
        """
        Test the login view with incorrect credentials
        """
        response = self.client.post(reverse('login'), {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/login.html')

    def test_login_no_data_post(self):
        """
        Test the login view with no POST data
        """
        response = self.client.post(reverse('login'), {})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/login.html')

    # -------------------------------------------------------------------------------------------
    # --------------------------------------- signup TESTS --------------------------------------
    # -------------------------------------------------------------------------------------------
    def test_signup_get_request(self):
        """
        Test the signup view with a GET request
        """
        response = self.client.get(reverse('signup'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/signup.html')
        self.assertIsInstance(response.context['form'], CustomUserCreationForm)

    def test_successful_signup(self):
        """
        Test successful user registration
        """
        response = self.client.post(reverse('signup'), {
            'first_name': 'Test',
            'last_name': 'Example',
            'email': 'test@example2.com',
            'password1': 'testpassword123',
            'password2': 'testpassword123'
        })
        self.assertRedirects(response, reverse('login'))
        self.assertTrue(get_user_model().objects.filter(email='test@example2.com').exists())

    def test_unsuccessful_signup(self):
        """
        Test unsuccessful registration due to non-matching passwords
        """
        response = self.client.post(reverse('signup'), {
            'email': 'test@example.com',
            'password1': 'testpassword123',
            'password2': 'wrongpassword123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/signup.html')
        self.assertFalse(response.context['form'].is_valid())
        self.assertIn('password2', response.context['form'].errors)

    def test_signup_with_existing_user(self):
        """
        Creating a user to test duplicate sign-up attempt
        """
        get_user_model().objects.create_user('test@example3.com', 'testpassword123')
        response = self.client.post(reverse('signup'), {
            'email': 'test@example3.com',
            'password1': 'testpassword123',
            'password2': 'testpassword123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/signup.html')
        self.assertFalse(response.context['form'].is_valid())
        self.assertIn('email', response.context['form'].errors)

    # -------------------------------------------------------------------------------------------
    # ------------------------------------- change_email TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_change_email_get_request(self):
        """
        Test the change email view with a GET request
        """
        response = self.client.get(reverse('change_email'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/change_email.html')

    def test_change_email_post_valid(self):
        """
        Test the change email view with a valid POST request to update the email.
        """
        new_email = 'new@example.com'
        response = self.client.post(reverse('change_email'), {'email': new_email})
        self.assertRedirects(response, reverse('change_email_done'))
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, new_email)

    def test_change_email_post_invalid(self):
        """
        Test the change email view with an invalid POST request.
        """
        response = self.client.post(reverse('change_email'), {'email': 'notanemail'})
        self.assertEqual(response.status_code, 200)
        self.assertFormError(response, 'form', 'email', 'Enter a valid email address.')

    # -------------------------------------------------------------------------------------------
    # -------------------------------- get_circuit_table TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_get_circuit_table_view_get_request(self):
        """
        Test the circuit table view with a GET request
        """
        response = self.client.get(reverse('circuit_table'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/components/circuit_table.html')

    # -------------------------------------------------------------------------------------------
    # ----------------------------------------- get_dash TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_dash_view_get_request_unauth(self):
        """
        Test the dashboard view with a GET request (unauthenticated)
        """
        self.client.logout()
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/dash.html')

    def test_dash_view_get_request(self):
        """
        Test the dashboard view with a GET request
        """
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/dash.html')

    # -------------------------------------------------------------------------------------------
    # -------------------------------------------- build TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_build_view_get_request_unauth(self):
        """
        Test the builder view with a GET request (unauthenticated)
        """
        self.client.logout()
        response = self.client.get(reverse('builder'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/build.html')

    def test_build_view_get_request(self):
        """
        Test the builder view with a GET request
        """
        response = self.client.get(reverse('builder'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/build.html')

    # -------------------------------------------------------------------------------------------
    # -------------------------------------- lesson view TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_intro_view_get_request(self):
        """
        Test the intro lesson view with a GET request
        """
        response = self.client.get(reverse('introduction-to-quantum-computing'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/intro_lesson.html')

    def test_fundamentals_view_get_request(self):
        """
        Test the fundamentals lesson view with a GET request
        """
        response = self.client.get(reverse('fundamentals-of-quantum-computing'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/fundamentals_lesson.html')

    def test_quantum_circuits_view_get_request(self):
        """
        Test the quantum circuits lesson view with a GET request
        """
        response = self.client.get(reverse('quantum-circuits'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/circuits_lesson.html')

    # -------------------------------------------------------------------------------------------
    # ------------------------------------- save_circuit TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_save_circuit_new_file(self):
        """
        Test saving a new circuit.
        """
        data = {
            'title': 'New Circuit',
            'description': 'Description of new circuit',
            'circuitData': '{"gates": [], "wires": []}'
        }
        response = self.client.post(reverse('save_circuit'), json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['status'], 'success')
        self.assertIn('file_id', json.loads(response.content))

    def test_save_circuit_update_file(self):
        """
        Test updating an existing circuit.
        """
        user_file = UserFile.objects.create(
            user=self.user,
            title='Original Title',
            description='Original description',
            uploaded_file='{}'
        )
        data = {
            'title': 'Updated Title',
            'description': 'Updated Description',
            'circuitData': '{"gates": ["H"], "wires": [0]}',
            'file_id': user_file.id
        }
        response = self.client.post(reverse('save_circuit'), json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['status'], 'success')
        self.assertEqual(json.loads(response.content)['message'], 'File updated successfully.')

    def test_save_circuit_invalid_json(self):
        """
        Test save circuit view with invalid JSON data.
        """
        response = self.client.post(reverse('save_circuit'), '{"title": "Invalid}', content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['status'], 'error')
        self.assertIn('Invalid JSON.', json.loads(response.content)['message'])

    def test_save_circuit_update_nonexistent_file(self):
        """
        Test updating a UserFile that does not exist should return an error message.
        """
        data = {
            'file_id': 9999,
            'title': 'New Title',
            'description': 'New Description',
            'circuitData': 'Some circuit data here'
        }

        response = self.client.post(reverse('save_circuit'), json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['status'], 'error')
        self.assertEqual(response_data['message'], 'File not found.')

    def test_save_circuit_get_request(self):
        """
        Test save circuit view with GET request which should fail.
        """
        response = self.client.get(reverse('save_circuit'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['status'], 'error')
        self.assertIn('Only POST method allowed.', json.loads(response.content)['message'])
        
    # -------------------------------------------------------------------------------------------
    # --------------------------------- download_circuit TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_download_circuit_authenticated(self):
        """
        Test that an authenticated user can download a circuit.
        """
        response = self.client.get(reverse('download_circuit', kwargs={'pk': self.test_file.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')
        self.assertIn('attachment; filename="Test Circuit.json"', response['Content-Disposition'])

    def test_download_circuit_unauthenticated(self):
        """
        Test that an unauthenticated user is redirected.
        """
        self.client.logout()
        response = self.client.get(reverse('download_circuit', kwargs={'pk': self.test_file.pk}))
        self.assertEqual(response.status_code, 302)

    def test_download_circuit_nonexistent(self):
        """
        Test attempting to download a non-existent file.
        """
        response = self.client.get(reverse('download_circuit', kwargs={'pk': 999999}))
        self.assertEqual(response.status_code, 404)

    # -------------------------------------------------------------------------------------------
    # ----------------------------------- delete_circuit TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_delete_circuit_post_authenticated(self):
        """
        Test that an authenticated user can delete a circuit via POST.
        """
        response = self.client.post(reverse('delete_circuit', kwargs={'pk': self.test_file.pk}))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('dashboard'))
        with self.assertRaises(UserFile.DoesNotExist):
            UserFile.objects.get(pk=self.test_file.pk)

    def test_delete_circuit_get_method_not_allowed(self):
        """
        Test that using a GET request results in a 405 Method Not Allowed.
        """
        response = self.client.get(reverse('delete_circuit', kwargs={'pk': self.test_file.pk}))
        self.assertEqual(response.status_code, 405)

    def test_delete_circuit_unauthenticated(self):
        """
        Test that an unauthenticated user is redirected to the login page.
        """
        self.client.logout()
        response = self.client.post(reverse('delete_circuit', kwargs={'pk': self.test_file.pk}))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(reverse('login') in response.url)

    def test_delete_nonexistent_circuit(self):
        """
        Test deleting a non-existent circuit to ensure proper handling of a 404 response.
        """
        response = self.client.post(reverse('delete_circuit', kwargs={'pk': 999999}))
        self.assertEqual(response.status_code, 404) 

    # -------------------------------------------------------------------------------------------
    # ----------------------------------------- simulate TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    @patch('confighome.views.Simulator')
    def test_simulate_post_success(self, MockSimulator):
        """
        Test the simulate view with a successful POST request
        """
        mock_sim = MockSimulator.return_value
        mock_sim.simulate_circuit.return_value = np.array([1, 0])
        mock_sim.probe_measurements.return_value = [{'row': 0, 'col': 1, 'value': 0.5}]
        
        data = {
            'circuit': {
                'gates': [['H', '0'], ['0', 'X']]
                },
            'to_measure': [{'qubit': 1, 'toggle': 1}]
        }

        response = self.client.post(reverse('simulate'), json.dumps(data), content_type='application/json')
        self.assertEqual(response.json(), {
            'status': 'ok',
            'state_vector': [1, 0],
            'probed_values': [{'row': 0, 'col': 1, 'value': 0.5}]
        })

    @patch('confighome.views.Simulator')
    def test_simulate_post_with_internal_error(self, MockSimulator):
        """
        Test the simulate view with an internal error
        """
        MockSimulator.side_effect = Exception("Test Error")

        data = {
            'circuit': {'gates': [['H', '0'], ['0', 'X']]},
            'to_measure': [{'qubit': 0, 'toggle': 1}]
        }

        response = self.client.post(reverse('simulate'), json.dumps(data), content_type='application/json')
        response_data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data['status'], 'error')
        self.assertIn('Test Error', response_data['message'])  

    def test_simulate_post_error(self):
        """
        Test the simulate view with a POST request error
        """
        response = self.client.post(reverse('simulate'), '{}', content_type='application/json')
        response_data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_data['status'], 'error')
        self.assertTrue('message' in response_data) 

    def test_simulate_non_post_error(self):
        """
        Test the simulate view with a non-POST request error
        """
        response = self.client.get(reverse('simulate'))
        response_data = response.json()
        self.assertEqual(response.status_code, 200) 
        self.assertEqual(response_data['status'], 'error')
        self.assertEqual(response_data['message'], 'Invalid request method')
