# Introduction to Qiskit: Your First Quantum Circuit

# Import necessary libraries
import numpy as np
from qiskit import QuantumCircuit, transpile, assemble
from qiskit.primitives import StatevectorSampler
from qiskit.visualization import plot_histogram
from qiskit_aer import Aer
import matplotlib.pyplot as plt

# 1. Creating a Simple Quantum Circuit
# -----------------------------------------------
# This quantum circuit prepares a Bell state: 
# (|00> + |11>) / √2
qc = QuantumCircuit(2)

# Apply a Hadamard gate to qubit 0 (superposition)
qc.h(0)

# Apply a CNOT gate to entangle qubits 0 and 1
qc.cx(0, 1)

# Visualize the circuit
#print(qc)
qc.draw('mpl')


# 2. Simulating the Quantum Circuit
# -----------------------------------------------
# Choose a simulator backend (classical computer mimicking quantum behavior)
simulator = Aer.get_backend('aer_simulator')

# Transpile the circuit for the simulator
qc_transpiled = transpile(qc, simulator)

print("Transpiled Circuit Ready for Execution:")
print(qc_transpiled)
# Transpile and execute the circuit
sampler = StatevectorSampler()
qc_measured = qc.measure_all(inplace=False)
job = simulator.run([qc_measured])
result = job.result()

# Get the measurement results and visualize
counts = result.get_counts()
print(f"Measurement Counts: {counts}")
plot_histogram(counts)

plt.show()