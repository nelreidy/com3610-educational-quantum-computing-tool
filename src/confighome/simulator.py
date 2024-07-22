"""
    File: simulator.py
    Author: Lea Button
    Date: 04-2024
"""

import cirq
import numpy as np

class Simulator:
    """
    A class to represent a quantum circuit simulator
    """
    def __init__(self, gates, to_measure):
        self.gateMap = {
            'X': cirq.X,
            'Y': cirq.Y,
            'Z': cirq.Z,
            'H': cirq.H,
            'S': cirq.S,
            'T': cirq.T,
            'I': cirq.I,
        }

        rowNum = len(gates)
        self.gates = self.__transpose(gates)
        self.to_measure = to_measure

        self.cirq_circuit = cirq.Circuit()
        self.probed_circuit = cirq.Circuit()

        self.qubits = [cirq.GridQubit(i, 0) for i in range(rowNum)]
        self.simulator = cirq.Simulator()

    def generate_cirq_circuit(self):
        """
        Generates a Cirq circuit from the gates and to_measure lists
        """
        for column in self.gates:
            if 'b' in column:
                continue
            self.__parse_column(self.cirq_circuit, column)

        # Identity gates to ensure all qubits are measured
        for qubit in self.qubits:
            self.cirq_circuit.append(cirq.I(qubit))

    def generate_probed_circuit(self):
        """
        Generates a Cirq circuit including measurement probes
        """
        # Identity gates to ensure any probes in first column can still measure.
        for qubit in self.qubits:
            self.probed_circuit.append(cirq.I(qubit))

        for col_index, column in enumerate(self.gates):
            if 'b' in column:
                continue
            self.__parse_column(self.probed_circuit, column, col_index)
        
        # Identity gates to ensure all qubits are measured
        for qubit in self.qubits:
            self.probed_circuit.append(cirq.I(qubit))

    def __parse_column(self, circuit, column, col_index=None):
        """
        Parses a column of gates and adds them to the Cirq circuit
        
        Args:
            circuit: the Cirq circuit to add the gates to
            column: list of gates in the column
        """
        controls = self.__find_controls(column)
        swaps = self.__find_swaps(column)
    
        column_dict = {i: gate for i, gate in enumerate(column) if gate != '0' and gate not in ['c', 'ac']}

        # Apply initial X gates for anticontrols
        for ac in controls['ac']:
            circuit.append(cirq.X(self.qubits[ac]))

        # Add all ac indicies to c in controls
        controls['c'] += controls['ac']
        
        if 'sw' in column_dict.values():
            if len(swaps) == 2:
                swap_gate = cirq.SWAP(self.qubits[swaps[0]], self.qubits[swaps[1]])
                if controls['c']:
                    circuit.append(swap_gate.controlled_by(*[self.qubits[c] for c in controls['c']]))
                else:
                    circuit.append(swap_gate)
                del column_dict[swaps[0]]
                del column_dict[swaps[1]]
        
        for i, gate in column_dict.items():
            if gate == 'M' and col_index is not None:
                # Add a tagged identity operation as a placeholder for probing
                tagged_identity = cirq.I(self.qubits[i]).with_tags(f'probe_{i}_{col_index}')
                circuit.append(tagged_identity)
                continue

            if gate in self.gateMap:
                operation = self.gateMap[gate](self.qubits[i])
                if controls['c']:
                    operation = operation.controlled_by(*[self.qubits[c] for c in controls['c']])
                circuit.append(operation)

        # Reapply X gates to anticontrols to revert them
        for ac in controls['ac']:
            circuit.append(cirq.X(self.qubits[ac]))

    def __find_controls(self, column) -> dict:
        """
        Finds the indices of the control and anticontrol gates in the column
        
        Args:
            column: list of gates in the column
            
        Returns:
            a dictionary containing the indices of the control and anticontrol gates
        """
        controls = {'c': [], 'ac': []}

        for i, gate in enumerate(column):
            if gate == 'c':
                controls['c'].append(i)
            elif gate == 'ac':
                controls['ac'].append(i)
        
        return controls
    
    def __find_swaps(self, column) -> list:
        """
        Finds the indices of the swap gates in the column

        Args:
            column: list of gates in the column

        Returns:
            a list of indices where the swap gates are located
        """
        swaps = []

        for i, gate in enumerate(column):
            if gate == 'sw':
                swaps.append(i)
        
        return swaps

    def simulate_circuit(self) -> np.ndarray:
        """
        Simulates the quantum circuit, and returns the final state vector
        
        Returns:
            the final state vector of the quantum circuit
        """
        result = self.simulator.simulate(self.cirq_circuit)
        full_state_vector = np.abs(result.final_state_vector)**2

        selected_qubits = self.__measurement_indices()

        num_qubits = int(np.log2(full_state_vector.size))
        reshaped_probs = full_state_vector.reshape([2] * num_qubits)

        axes_to_sum_over = [i for i in range(num_qubits) if i not in selected_qubits]
        final_state_vector = np.sum(reshaped_probs, axis=tuple(axes_to_sum_over)).flatten()
    
        return final_state_vector

    def __measurement_indices(self) -> list:
        """
        Finds the indices of the qubits to measure
        
        Returns:
            a list of indices of the qubits to measure
        """
        all_indicies = [item['qubit'] for item in self.to_measure if item['toggle'] == 1 and item['qubit'] < len(self.qubits)]

        return all_indicies

    def probe_measurements(self) -> list:
        """
        Probes the quantum circuit at the measurement points

        Returns:
            a list of dictionaries containing the row, column and value of the probed measurements
        """
        results = []

        for moment_index, moment in enumerate(self.probed_circuit):
            for op in moment:
                if isinstance(op, cirq.TaggedOperation): #and any('probe' in tag for tag in op.tags)
                    tag = op.tags[0] #next(tag for tag in op.tags) #if 'probe' in tag
                    row, col_index = map(int, tag.split('_')[1:])
                    qubit = op.qubits[0]

                    sub_circuit = cirq.Circuit()
                    for m in self.probed_circuit[:moment_index]:
                        sub_circuit.append(m)

                    result = self.simulator.simulate(sub_circuit)
                    full_state_vector = np.abs(result.final_state_vector)**2

                    selected_qubits = [row if i == row else next for i in range(len(self.qubits))]

                    num_qubits = int(np.log2(full_state_vector.size))
                    reshaped_probs = full_state_vector.reshape([2] * num_qubits)

                    axes_to_sum_over = [i for i in range(num_qubits) if i not in selected_qubits]
                    final_state_vector = np.sum(reshaped_probs, axis=tuple(axes_to_sum_over)).flatten()
                    results.append({'row': qubit.row, 'col': col_index, 'value': float(final_state_vector[1])})

        return results

    def __transpose(self, array) -> list:
        """
        Transposes a 2D array

        Args:
            array: the 2D array to transpose

        Returns:
            the transposed 2D array
        """
        return [list(row) for row in zip(*array)]