# Introduction to Qiskit: Your First Quantum Circuit

# Import necessary libraries
import numpy as np
from qiskit import QuantumCircuit, transpile, assemble
from qiskit.primitives import StatevectorSampler
from qiskit.visualization import plot_histogram
from qiskit_aer import Aer
import matplotlib.pyplot as plt
from qiskit_ibm_runtime import QiskitRuntimeService, EstimatorV2 as Estimator, SamplerV2 as Sampler
from collections import Counter

# QiskitRuntimeService.save_account(channel="ibm_quantum", token="4a608389dda2db504e14f6a305953562588054979d345a768eca6c2d6414d16d3479edd9c34c97c180131c9b267eb3cd3a2b159b9b707983124bfbc77e1fb89c")
# # # 1. Creating a Simple Quantum Circuit
# # # -----------------------------------------------
# # This quantum circuit prepares a Bell state: 
# # (|00> + |11>) / √2
# qc = QuantumCircuit(2)

# # Apply a Hadamard gate to qubit 0 (superposition)
# qc.h(0)

# # Apply a CNOT gate to entangle qubits 0 and 1
# qc.cx(0, 1)

# # Visualize the circuit
# #print(qc)
# qc.draw('mpl')


# # 2. Simulating the Quantum Circuit
# # -----------------------------------------------
# # Choose a simulator backend (classical computer mimicking quantum behavior)
# simulator = Aer.get_backend('aer_simulator')

# # Transpile the circuit for the simulator
# qc_transpiled = transpile(qc, simulator)

# print("Transpiled Circuit Ready for Execution:")
# print(qc_transpiled)
# # Transpile and execute the circuit
# sampler = StatevectorSampler()
# qc_measured = qc.measure_all(inplace=False)
# job = simulator.run([qc_measured])
# result = job.result()

# # Get the measurement results and visualize
# counts = result.get_counts()
# print(f"Measurement Counts: {counts}")
# plot_histogram(counts)

# plt.show()

#=================

service = QiskitRuntimeService(channel="ibm_quantum") #Connect to IBM Quantum service, uses your saved IBM token, gives access to IBM Quantum devices and lets you run jobs on them.

# for backend in service.backends(simulator=False):
#     print(f"{backend.name}: {backend.num_qubits} qubits, {backend.status().pending_jobs} jobs in queue, {backend.status().operational} operational")



backend = service.least_busy(simulator=False, operational=True)
print("Using backend:", backend.name)


# Create a 3-qubit circuit: 2 input qubits, 1 ancilla
qc = QuantumCircuit(3, 2)  # last register is for measurement

# Step 1: Set ancilla to |1⟩
qc.x(2)

# Step 2: Apply Hadamard gates to all qubits
qc.h([0, 1, 2])

# Step 3: Oracle - example balanced function f(x) = x0 XOR x1
qc.cx(0, 2)
qc.cx(1, 2)

# Step 4: Hadamards again on input qubits
qc.h([0, 1])

# Step 5: Measure input qubits
qc.measure([0, 1], [0, 1])

qc.draw('mpl')

transpiled_circuit = transpile(qc, backend)

# 2. Create a Sampler to run the circuit
sampler = Sampler(mode=backend)

# 3. Execute the circuit (shots = number of times the circuit is run)
job = sampler.run([transpiled_circuit], shots=1024)

# 4. Get the result
result = job.result()
# counts = result[0].quasi_distribution  # measured results
# try: 
#     counts = result[0].data
#     print("Lol")
# except:
#     try:
#         counts = result[0].quasi_distribution
#         print("LMAO")
#     except:
#             counts = result[0].counts
#             print("LMAO2")

# # Convert BitArray keys to strings
# # string_counts = {
# #     key.to01() if hasattr(key, 'to01') else key: value
# #     for key, value in counts.items()
# # 2. Get the list of bitstrings
# # bitstrings = result[0].data.meas.get_bitstrings()
# # 3. Get bitstrings correctly
# databin = result[0].data
# counts = databin.binary_probabilities()  

result = job.result()[0]
counts = result.join_data().get_counts()


# 3. Count how many times each bitstring appeared
# count = Counter(bitstrings)

# # 5. Plot the result
plot_histogram(counts, title="Measurement Results", color='purple', bar_labels=False)
plt.show()