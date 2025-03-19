"""
    File: views.py
    Author: Lea Button
    Date: 03-2024
"""
import os
import json
from urllib.parse import quote
from django.urls import reverse
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.core.paginator import Paginator
from django.utils import timezone
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.staticfiles.finders import find
from confighome.simulator import Simulator
from users.forms import CustomUserCreationForm, ChangeEmailForm
from users.models import UserFile


circuit_files = [f for f in os.listdir(find('circuits')) if f.endswith('.json')]
example_circuits = []

for circuit_file in circuit_files:

    file_path = find(os.path.join('circuits', circuit_file))

    with open(file_path, 'r', encoding='utf-8') as f:
        circuit_data = json.load(f)

    json_string = json.dumps(circuit_data)

    url_encoded_json_string = quote(json_string)

    example_circuits.append({
        'name': circuit_data['title'], 
        'data': url_encoded_json_string,
    })


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, email=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/dashboard')
        else:
            return render(request, 'registration/login.html', {'error': 'Invalid username or password'})
    return render(request, 'registration/login.html')

def user_signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        # print(form.is_valid())
        if form.is_valid():
            form.save()
            return redirect('login')
        # else:
        #     print(form.errors)
    else:
        form = CustomUserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})

@login_required
def change_email(request):
    if request.method == 'POST':
        form = ChangeEmailForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('change_email_done')
    else:
        form = ChangeEmailForm(instance=request.user)
    return render(request, 'registration/change_email.html', {'form': form})

@login_required
def get_profile(request):
    return render(request, 'registration/profile.html', {})

@login_required
def delete_account(request):
    if request.method == 'POST':
        request.user.delete()

def get_circuit_table(request):
    user_circuits = UserFile.objects.filter(user=request.user).order_by('id')
    paginator = Paginator(user_circuits, 6)
    page_number = request.GET.get('page')
    user_circuits = paginator.get_page(page_number)

    num_empty_rows = 6 - len(user_circuits)
    empty_rows = num_empty_rows > 0
    height = num_empty_rows * 14

    return render(request, 'pages/components/circuit_table.html', {
        'user_circuits': user_circuits,
        'empty_rows': empty_rows,
        'height': height
        })

def dash(request):
    if request.user.is_authenticated:
        user_circuits = UserFile.objects.filter(user=request.user)
        paginator = Paginator(user_circuits, 6)  
        page_number = request.GET.get('page')
        user_circuits = paginator.get_page(page_number)
        return render(request, 'pages/dash.html', {'example_circuits': example_circuits, 'user_circuits': user_circuits})
    else:
        return render(request, 'pages/dash.html', {'example_circuits': example_circuits})

def build(request):
    if request.user.is_authenticated:
        user_circuits = UserFile.objects.filter(user=request.user)
        paginator = Paginator(user_circuits, 6)  
        page_number = request.GET.get('page')
        user_circuits = paginator.get_page(page_number)
        return render(request, 'pages/build.html', {'example_circuits': example_circuits, 'user_circuits': user_circuits})
    else:
        return render(request, 'pages/build.html', {'example_circuits': example_circuits})

def intro(request):
    return render(request, 'pages/intro_lesson.html', {})

def fundamentals(request):
    return render(request, 'pages/fundamentals_lesson.html', {})

def quantum_circuits(request):
    return render(request, 'pages/circuits_lesson.html', {})

def quantum_phenomena(request):
    return render(request, 'pages/phenomena_lesson.html', {})

def error_correction(request):
    return render(request, 'pages/error_correction_lesson.html', {})

def running_programs(request):
    return render(request, 'pages/running_programs_lesson.html', {})

def quantum_algorithms(request):
    return render(request, 'pages/algorithms_lesson.html', {})

@csrf_exempt
@login_required
def save_circuit(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST method allowed.'})

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON.'})

    title = data.get('title')
    description = data.get('description')
    circuit_data = data.get('circuitData')
    file_id = data.get('file_id')

    if file_id:
        try:
            user_file = UserFile.objects.get(id=file_id, user=request.user)
            user_file.title = title
            user_file.description = description
            user_file.uploaded_file = circuit_data
            user_file.uploaded_at = timezone.now() 
            user_file.save()
            return JsonResponse({'status': 'success', 'message': 'File updated successfully.', 'file_id': str(user_file.id)})
        except UserFile.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'File not found.'}, status=404)

    else:
        user_file = UserFile.objects.create(
            user=request.user,
            title=title,
            description=description,
            uploaded_file=circuit_data 
        )
        return JsonResponse({'status': 'success', 'message': 'File saved successfully.', 'file_id': str(user_file.id)})

@login_required
def download_circuit(request, pk):
    circuit = get_object_or_404(UserFile, pk=pk)
    response = HttpResponse(circuit.uploaded_file, content_type='application/json')
    response['Content-Disposition'] = f'attachment; filename="{circuit.title}.json"'
    return response

@login_required
def delete_circuit(request, pk):
    if request.method == 'POST':
        circuit = get_object_or_404(UserFile, pk=pk)
        circuit.delete()
        return redirect(reverse('dashboard'))  
    return HttpResponse("Method not allowed", status=405)

@csrf_exempt
def simulate(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)

            circuit_obj = data.get('circuit', [])
            circuit_array = circuit_obj.get('gates', [])
            to_measure = data.get('to_measure', [])

            simulator = Simulator(circuit_array, to_measure)
            simulator.generate_cirq_circuit()
            state_vector = simulator.simulate_circuit()

            simulator.generate_probed_circuit()
            probed_values = simulator.probe_measurements()

            return JsonResponse({'status': 'ok','state_vector': state_vector.tolist(), 'probed_values': probed_values})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})