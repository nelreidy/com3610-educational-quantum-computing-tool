"""
    File: test_simulator.py
    Author: Lea Button
    Date: 04-2024
"""
import unittest
import cirq
import numpy as np
from confighome.simulator import Simulator

class TestSimulator(unittest.TestCase):
    """
    A class to test the Simulator class
    """
    # -------------------------------------------------------------------------------------------
    # ---------------------------- __init__ TESTS -----------------------------------------------
    # -------------------------------------------------------------------------------------------
    def test_init_with_no_gates(self):
        """Test that the Simulator initializes correctly with no gates."""
        gates = []
        to_measure = []
        sim = Simulator(gates, to_measure)
        self.assertEqual(len(sim.qubits), 0)
        self.assertTrue(isinstance(sim.simulator, cirq.Simulator))
        self.assertTrue(isinstance(sim.cirq_circuit, cirq.Circuit))
        self.assertTrue(isinstance(sim.probed_circuit, cirq.Circuit))

    def test_init_with_one_column(self):
        """Test that the Simulator initializes correctly with 1 column."""
        gates = [[0], [0], [0], [0], [0]]
        to_measure = []
        sim = Simulator(gates, to_measure)
        self.assertEqual(len(sim.qubits), 5)
        self.assertTrue(isinstance(sim.simulator, cirq.Simulator))
        self.assertTrue(isinstance(sim.cirq_circuit, cirq.Circuit))
        self.assertTrue(isinstance(sim.probed_circuit, cirq.Circuit))

    def test_init_with_two_rows_columns(self):
        """Test that the Simulator initializes correctly with 2 rows, 2 gates."""
        gates = [['X', 0], ['H', 0]]
        to_measure = []
        sim = Simulator(gates, to_measure)
        self.assertEqual(len(sim.qubits), 2)
        self.assertTrue(isinstance(sim.simulator, cirq.Simulator))
        self.assertTrue(isinstance(sim.cirq_circuit, cirq.Circuit))
        self.assertTrue(isinstance(sim.probed_circuit, cirq.Circuit))

    def test_init_with_non_square_gates_array(self):
        """Test that the Simulator initializes correctly with a non-square gates input"""
        gates = [['H', 'x', '0'], [0, 'x'], [0]]
        to_measure = []
        sim = Simulator(gates, to_measure)
        self.assertEqual(len(sim.qubits), 3)
        self.assertTrue(isinstance(sim.simulator, cirq.Simulator))
        self.assertTrue(isinstance(sim.cirq_circuit, cirq.Circuit))
        self.assertTrue(isinstance(sim.probed_circuit, cirq.Circuit))

    # -------------------------------------------------------------------------------------------
    # ---------------------------- generate_cirq_circuit TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_generate_cirq_circuit(self):
        """Test the generation of the Cirq circuit without measurements."""
        gates = [['H', '0'], ['0', 'X']]
        to_measure = []
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()

        circuit = cirq.Circuit()
        circuit.append(cirq.H(sim.qubits[0]))
        circuit.append(cirq.X(sim.qubits[1]))
        circuit.append(cirq.I(sim.qubits[0]))
        circuit.append(cirq.I(sim.qubits[1]))

        self.assertEqual(sim.cirq_circuit, circuit)

    def test_generate_cirq_circuit_with_measurements(self):
        """Test the generation of the Cirq circuit with measurements."""
        gates = [['H', 'M'], ['X', 'M']]
        to_measure = [{'qubit': 0, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()

        circuit = cirq.Circuit()
        circuit.append(cirq.H(sim.qubits[0]))
        circuit.append(cirq.X(sim.qubits[1]))
        circuit.append(cirq.I(sim.qubits[0]))
        circuit.append(cirq.I(sim.qubits[1]))

        self.assertEqual(sim.cirq_circuit, circuit)

    def test_generate_cirq_circuit_with_barriers(self):
        """Test that the generation of a Cirq circuit with barriers is correct."""
        gates = [
            ['X', 'b', 0, 'b', 0], 
            ['Y', 'b', 0, 'b', 0], 
            [0, 'b', 'sw', 'b', 0], 
            ['Z', 'b', 'sw', 'b', 0]]
        to_measure = []
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()

        circuit = cirq.Circuit()
        circuit.append(cirq.X(sim.qubits[0]))
        circuit.append(cirq.Y(sim.qubits[1]))
        circuit.append(cirq.Z(sim.qubits[3]))
        circuit.append(cirq.SWAP(sim.qubits[2], sim.qubits[3]))
        circuit.append(cirq.I(sim.qubits[0]))
        circuit.append(cirq.I(sim.qubits[1]))
        circuit.append(cirq.I(sim.qubits[2]))
        circuit.append(cirq.I(sim.qubits[3]))

        self.assertEqual(sim.cirq_circuit, circuit)

    # -------------------------------------------------------------------------------------------
    # ---------------------------- generate_probed_circuit TESTS --------------------------------
    # -------------------------------------------------------------------------------------------
    def test_generate_probed_circuit_with_one_probe(self):
        """Test the generation of the probed circuit with one probe."""
        gates = [['X', 'M', 'H'], [0, 'X', 0]]
        to_measure = []
        sim = Simulator(gates, to_measure)
        sim.generate_probed_circuit()

        num_probes = sum(isinstance(op, cirq.TaggedOperation) for moment in sim.probed_circuit for op in moment)
        self.assertEqual(num_probes, 1)

    def test_generate_probed_circuit_with_multiple_probes(self):
        """Test the generation of the probed circuit with multiple probes"""
        gates = [['X', 'M', 0], [0, 'X', 'M'], ['M', 0, 0], [0, 0, 0], ['M', 'M', 0]]
        to_measure = []
        sim = Simulator(gates, to_measure)
        sim.generate_probed_circuit()

        num_probes = sum(isinstance(op, cirq.TaggedOperation) for moment in sim.probed_circuit for op in moment)
        self.assertEqual(num_probes, 5)

    def test_generate_probed_circuit_with_barriers(self):
        """Test the generation of the probed circuit with barriers"""
        gates = [['X', 'b', 0], [0, 'b', 'M'], ['M', 'b', 0], [0, 'b', 0], ['M', 'b', 0]]
        to_measure = []
        sim = Simulator(gates, to_measure)
        sim.generate_probed_circuit()

        num_probes = sum(isinstance(op, cirq.TaggedOperation) for moment in sim.probed_circuit for op in moment)
        self.assertEqual(num_probes, 3)
    # -------------------------------------------------------------------------------------------
    # ---------------------------- __parse_column TESTS -----------------------------------------
    # -------------------------------------------------------------------------------------------
    def test_parse_column_X0Y(self):
        """Test parsing a column with X, 0, Y gates."""
        sim = Simulator([['X'], [0], ['Y']], [])
        qubits = [cirq.GridQubit(i,0) for i in range(3)]
        column = ['X', 0, 'Y']
        sim._Simulator__parse_column(sim.cirq_circuit, column) 
        moment = sim.cirq_circuit[0]
        self.assertEqual(list(moment), [cirq.X(qubits[0]), cirq.Y(qubits[2])])

    def test_parse_column_swaps(self):
        """Test parsing a column with a swap gate contained"""
        sim = Simulator([['sw'], ['sw'], [0]], [])
        qubits = [cirq.GridQubit(i, 0) for i in range(3)]
        column = ['sw', 'sw', 0]
        sim._Simulator__parse_column(sim.cirq_circuit, column)
        moment = sim.cirq_circuit[0]
        self.assertEqual(list(moment), [cirq.SWAP(qubits[0], qubits[1])])

    def test_parse_column_seperated_swaps(self):
        """Test parsing a column with a swap gate with > 0 gap"""
        sim = Simulator([['sw'], [0], [0], [0], [0], ['sw']], [])
        qubits = [cirq.GridQubit(i, 0) for i in range(6)]
        column = ['sw', 0, 0, 0, 0, 'sw']
        sim._Simulator__parse_column(sim.cirq_circuit, column)
        moment = sim.cirq_circuit[0]
        self.assertEqual(list(moment), [cirq.SWAP(qubits[0], qubits[5])])

    def test_parse_column_too_many_swaps(self):
        """Test parsing a column with a too many swap nodes contained"""
        sim = Simulator([['sw'], ['sw'], ['sw']], [])
        qubits = [cirq.GridQubit(i, 0) for i in range(3)]
        column = ['sw', 'sw', 'sw']
        sim._Simulator__parse_column(sim.cirq_circuit, column)
        with self.assertRaises(IndexError):
            _ = sim.cirq_circuit[0]

    def test_parse_column_c00H(self):
        sim = Simulator([['c'], [0], [0], ['H']], [])
        qubits = [cirq.GridQubit(i, 0) for i in range(4)]
        column = ['c', 0, 0, 'H']
        sim._Simulator__parse_column(sim.cirq_circuit, column)
        moment = sim.cirq_circuit[0]
        self.assertEqual(list(moment), [cirq.H(qubits[3]).controlled_by(qubits[0])])
        
    # -------------------------------------------------------------------------------------------
    # ---------------------------- __find_controls TESTS ----------------------------------------
    # -------------------------------------------------------------------------------------------
    def test_find_controls_no_controls(self):
        """Test finding controls when there are no controls."""
        sim = Simulator([], [])
        column = ['X', 'Y', 'Z']
        controls = sim._Simulator__find_controls(column)
        self.assertEqual(controls, {'c': [], 'ac': []})

    def test_find_controls_with_control(self):
        """Test finding controls when there is a control."""
        sim = Simulator([], [])
        column = ['c', 0, 0, 'X']
        controls = sim._Simulator__find_controls(column)
        self.assertEqual(controls, {'c': [0], 'ac': []})

    def test_find_controls_with_anticontrol(self):
        """Test finding controls when there is an anticontrol."""
        sim = Simulator([], [])
        column = [0, 0, 'ac', 'X']
        controls = sim._Simulator__find_controls(column)
        self.assertEqual(controls, {'c': [], 'ac': [2]})

    def test_find_controls_with_control_and_anticontrol(self):
        """Test finding controls when there is a control and an anticontrol."""
        sim = Simulator([], [])
        column = ['c', 0, 0, 'X', 'ac', 0, 'X', 0]
        controls = sim._Simulator__find_controls(column)
        self.assertEqual(controls, {'c': [0], 'ac': [4]})

    def test_find_controls_with_multiple_controls(self):
        sim = Simulator([], [])
        column = ['c', 0, 'c', 'X', 0, 0, 0, 'c', 0]
        controls = sim._Simulator__find_controls(column)
        self.assertEqual(controls, {'c': [0, 2, 7], 'ac': []})

    def test_find_controls_with_multiple_anticontrols(self):
        sim = Simulator([], [])
        column = [0, 'ac', 0, 'ac', 'X', 'ac', 0, 'ac']
        controls = sim._Simulator__find_controls(column)
        self.assertEqual(controls, {'c': [], 'ac': [1, 3, 5, 7]})

    # -------------------------------------------------------------------------------------------
    # ---------------------------- __find_swaps TESTS -------------------------------------------
    # -------------------------------------------------------------------------------------------
    def test_find_swaps_no_swaps(self):
        """Test finding swaps when there are no swaps."""
        sim = Simulator([], [])
        column = ['X', 'Y', 'Z']
        swaps = sim._Simulator__find_swaps(column)
        self.assertEqual(swaps, [])

    def test_find_swaps_with_swap(self):
        """Test finding swaps when there is a swap."""
        sim = Simulator([], [])
        column = ['sw', 0, 0, 'X']
        swaps = sim._Simulator__find_swaps(column)
        self.assertEqual(swaps, [0])

    def test_find_swaps_with_pair_swaps(self):
        """Test finding swaps when there is two swaps."""
        sim = Simulator([], [])
        column = ['sw', 0, 0, 'sw', 0, 0, 'X']
        swaps = sim._Simulator__find_swaps(column)
        self.assertEqual(swaps, [0, 3])

    def test_find_swaps_with_multiple_swaps(self):
        sim = Simulator([], [])
        column = ['sw', 0, 'sw', 'X', 'sw', 0, 'sw']
        swaps = sim._Simulator__find_swaps(column)
        self.assertEqual(swaps, [0, 2, 4, 6])

    # -------------------------------------------------------------------------------------------
    # ---------------------------- SIMULATE CIRCUIT TESTS ---------------------------------------
    # -------------------------------------------------------------------------------------------
    def test_simulate_circuit_one_qubit(self):
        """Test the simulation of the quantum circuit and output state vector with 1 qubit."""
        gates = [['X']]
        to_measure = [{'qubit': 0, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 2) 
        self.assertTrue(np.isclose(np.sum(result), 1)) 

    def test_simulate_circuit_two_qubits(self):
        """Test the simulation of the quantum circuit and output state vector with 2 qubits."""
        gates = [['X'], ['H']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 4)
        self.assertTrue(np.isclose(np.sum(result), 1))

    def test_simulate_circuit_three_qubits(self):
        """Test the simulation of the quantum circuit and output state vector with 3 qubits."""
        gates = [['X'], ['H'], ['H']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}, {'qubit': 2, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 8)
        self.assertTrue(np.isclose(np.sum(result), 1))

    def test_simulate_circuit_four_qubits(self):
        """Test the simulation of the quantum circuit and output state vector with 4 qubits."""
        gates = [['X'], ['H'], ['H'], ['H']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}, {'qubit': 2, 'toggle': 1}, {'qubit': 3, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 16)
        self.assertTrue(np.isclose(np.sum(result), 1))

    def test_simulate_circuit_five_qubits(self):
        """Test the simulation of the quantum circuit and output state vector with 5 qubits."""
        gates = [['X'],['X'],['sw'],['sw'],['c']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}, {'qubit': 2, 'toggle': 1}, {'qubit': 3, 'toggle': 1}, {'qubit': 4, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 32)
        self.assertTrue(np.isclose(np.sum(result), 1))

    def test_simulate_circuit_six_qubits(self):
        """Test the simulation of the quantum circuit and output state vector with 6 qubits."""
        gates = [['ac'],[0],['Y'],['X'],['X'],['X']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}, {'qubit': 2, 'toggle': 1}, {'qubit': 3, 'toggle': 1}, {'qubit': 4, 'toggle': 1}, {'qubit': 5, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 64)
        self.assertTrue(np.isclose(np.sum(result), 1))

    def test_simulate_circuit_seven_qubits(self):
        """Test the simulation of the quantum circuit and output state vector with 7 qubits."""
        gates = [['X'],['X'],['Y'],['X'],['X'],['X'],['X']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}, {'qubit': 2, 'toggle': 1}, {'qubit': 3, 'toggle': 1}, {'qubit': 4, 'toggle': 1}, {'qubit': 5, 'toggle': 1}, {'qubit': 6, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 128)
        self.assertTrue(np.isclose(np.sum(result), 1))
    
    def test_simulate_circuit_eight_qubits(self):
        """Test the simulation of the quantum circuit and output state vector with 8 qubits."""
        gates = [['X'],['X'],['Y'],['X'],['X'],['X'],['X'],['X']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}, {'qubit': 2, 'toggle': 1}, {'qubit': 3, 'toggle': 1}, {'qubit': 4, 'toggle': 1}, {'qubit': 5, 'toggle': 1}, {'qubit': 6, 'toggle': 1}, {'qubit': 7, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 256)
        self.assertTrue(np.isclose(np.sum(result), 1))

    def test_simulate_circuit_nine_qubits(self):
        """Test the simulation of the quantum circuit and output state vector with 9 qubits."""
        gates = [['X'],['X'],['Y'],['X'],['X'],['X'],['X'],['X'],['X']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}, {'qubit': 2, 'toggle': 1}, {'qubit': 3, 'toggle': 1}, {'qubit': 4, 'toggle': 1}, {'qubit': 5, 'toggle': 1}, {'qubit': 6, 'toggle': 1}, {'qubit': 7, 'toggle': 1}, {'qubit': 8, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 512)
        self.assertTrue(np.isclose(np.sum(result), 1))
    
    def test_simulate_circuit_vary_toggles(self):
        """Test the simulation of the quantum circuit with varying toggles."""
        gates = [['X', 'H', 'H'], ['H', 'X', 'H'], ['H', 'H', 'X']]
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 0}, {'qubit': 2, 'toggle': 1}]
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 4)
        self.assertTrue(np.isclose(np.sum(result), 1))

    def test_simulate_circuit_no_toggles(self):
        """Test the simulation of the quantum circuit with no toggles."""
        gates = [['X', 'H', 'H'], ['H', 'X', 'H'], ['H', 'H', 'X']]
        to_measure = []
        sim = Simulator(gates, to_measure)
        sim.generate_cirq_circuit()
        result = sim.simulate_circuit()

        self.assertEqual(len(result), 1)
        self.assertTrue(np.isclose(np.sum(result), 1))

    # -------------------------------------------------------------------------------------------
    # ---------------------------- __measurement_indices TESTS ----------------------------------
    # -------------------------------------------------------------------------------------------
    def test_measurement_indices_empty_to_measure(self):
        """Test the measurement indices when there are no qubits to measure."""
        to_measure = []
        sim = Simulator([], to_measure)
        indices = sim._Simulator__measurement_indices()
        self.assertEqual(indices, [])

    def test_measurement_indices_measure_all(self):
        to_measure = [{'qubit': 0, 'toggle': 1}, {'qubit': 1, 'toggle': 1}, {'qubit': 2, 'toggle': 1}, {'qubit': 3, 'toggle': 1}, {'qubit': 4, 'toggle': 1}, {'qubit': 5, 'toggle': 1}]
        sim = Simulator([[],[],[],[],[],[]], to_measure)
        indices = sim._Simulator__measurement_indices()
        self.assertEqual(indices, [0, 1, 2, 3, 4, 5])

    def test_measurement_indices_measure_some(self):
        to_measure = [{'qubit': 0, 'toggle': 0}, {'qubit': 1, 'toggle': 0}, {'qubit': 2, 'toggle': 1}, {'qubit': 3, 'toggle': 1}, {'qubit': 4, 'toggle': 0}, {'qubit': 5, 'toggle': 1}]
        sim = Simulator([[],[],[],[],[],[]], to_measure)
        indices = sim._Simulator__measurement_indices()
        self.assertEqual(indices, [2, 3, 5])

    def test_measurement_indices_measure_none(self):
        to_measure = [{'qubit': 0, 'toggle': 0}, {'qubit': 1, 'toggle': 0}, {'qubit': 2, 'toggle': 0}, {'qubit': 3, 'toggle': 0}, {'qubit': 4, 'toggle': 0}, {'qubit': 5, 'toggle': 0}]
        sim = Simulator([[],[],[],[],[],[]], to_measure)
        indices = sim._Simulator__measurement_indices()
        self.assertEqual(indices, [])

    # -------------------------------------------------------------------------------------------
    # ---------------------------- PROBE MEASUREMENTS TESTS -------------------------------------
    # -------------------------------------------------------------------------------------------
    def test_probe_measurements_with_no_probe(self):
        """Test probing the circuit at two measurement points."""
        gates = [['X', 0], ['H', 0]]
        sim = Simulator(gates, [])
        sim.generate_probed_circuit()
        probes = sim.probe_measurements()
        self.assertEqual(probes, [])
    
    def test_probe_measurements_with_one_probe(self):
        """Test probing the circuit at two measurement points."""
        gates = [['X', 'M'], ['H', 0]]
        sim = Simulator(gates, [])
        sim.generate_probed_circuit()
        probes = sim.probe_measurements()
        
        expected_probes = [{'row': 0, 'col': 1, 'value': 1}]

        for i, (actual, expected) in enumerate(zip(probes, expected_probes)):
            with self.subTest(i=i):
                self.assertEqual(actual['row'], expected['row'])
                self.assertEqual(actual['col'], expected['col'])
                self.assertTrue(np.isclose(actual['value'], expected['value']))
    
    def test_probe_measurements_with_two_probes(self):
        """Test probing the circuit at two measurement points."""
        gates = [['X', 'M'], ['H', 'M']]
        sim = Simulator(gates, [])
        sim.generate_probed_circuit()
        probes = sim.probe_measurements()
        
        expected_probes = [{'row': 0, 'col': 1, 'value': 1}, {'row': 1, 'col': 1, 'value': 0.5}]

        for i, (actual, expected) in enumerate(zip(probes, expected_probes)):
            with self.subTest(i=i):
                self.assertEqual(actual['row'], expected['row'])
                self.assertEqual(actual['col'], expected['col'])
                self.assertTrue(np.isclose(actual['value'], expected['value']))
    
    def test_probe_measurements_multiple_probes(self):
        """Test probing the circuit at multiple measurement points."""
        gates = [['X', 'M'], ['M', 'M'], ['X', 'X', 'M'], ['M', 0]]
        sim = Simulator(gates, [])
        sim.generate_probed_circuit()
        probes = sim.probe_measurements()
        
        expected_probes = [{'row': 1, 'col': 0, 'value': 0},
                           {'row': 3, 'col': 0, 'value': 0},
                           {'row': 0, 'col': 1, 'value': 1}, 
                           {'row': 1, 'col': 1, 'value': 0},
                           {'row': 2, 'col': 2, 'value': 0}]

        for i, (actual, expected) in enumerate(zip(probes, expected_probes)):
            with self.subTest(i=i):
                self.assertEqual(actual['row'], expected['row'])
                self.assertEqual(actual['col'], expected['col'])
                self.assertTrue(np.isclose(actual['value'], expected['value']))

if __name__ == '__main__':
    unittest.main()
