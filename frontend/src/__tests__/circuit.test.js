import { Circuit } from '../circuit.mjs';

describe('Circuit class tests', () => {
    let circuit;

    beforeEach(() => {
        circuit = new Circuit(3);
        console.log = jest.fn();
    });

    test('initializes with given number of qubits', () => {
        expect(circuit.qubits).toBe(3);
        expect(circuit.gates.length).toBe(3);
        expect(circuit.gates[0]).toEqual([0]);
        expect(circuit.gates[1]).toEqual([0]);
        expect(circuit.gates[2]).toEqual([0]);
        expect(circuit.title = "Circuit Name");
        expect(circuit.description = "Circuit Description");
    });

    test('adds a qubit row correctly', () => {
        circuit.addQubitRow();
        expect(circuit.qubits).toBe(4);
        expect(circuit.gates.length).toBe(4);
        expect(circuit.gates[3]).toEqual([0]);
    });

    test('doesnt add a qubit row when at max qubits', () => {
        circuit.addQubitRow();
        circuit.addQubitRow();
        circuit.addQubitRow();
        circuit.addQubitRow();
        circuit.addQubitRow();
        circuit.addQubitRow();
        circuit.addQubitRow();
        circuit.addQubitRow();
        expect(circuit.qubits).toBe(9);
    });

    test('removes an empty qubit row correctly', () => {
        circuit.addQubitRow(); 
        circuit.removeQubitRow();
        expect(circuit.qubits).toBe(3);
        expect(circuit.gates.length).toBe(3);
    });

    test('doesnt remove a qubit row when at min qubits', () => {
        circuit.removeQubitRow();
        expect(circuit.qubits).toBe(3);
    })

    test('removes an occupied qubit row correctly', () => {
        circuit.addQubitRow(); 
        circuit.addGate(3, 0, 'X');
        circuit.removeQubitRow();
        expect(circuit.qubits).toBe(3);
        expect(circuit.gates.length).toBe(3);
    });

    test('adds a gate into a free space correctly', () => {
        circuit.addGate(0, 0, 'X');
        expect(circuit.gates[0][0]).toBe('X');
    });

    test('adds a gate into a single occupied space correctly', () =>{
        circuit.addGate(0, 0, 'X');
        expect(circuit.gates[0][0]).toBe('X');
        circuit.addGate(0, 0, 'Y')
        expect(circuit.gates[0][0]).toBe('Y');
        expect(circuit.gates[0][1]).toBe('X');
    });

    test('adds a gate into a multi-row connected space correctly', () => {
        circuit.addGate(0, 0, 'X');
        circuit.addGate(1, 0, 0);
        circuit.addGate(2, 0, 'c');
        circuit.addGate(1, 0, 'Y');
        expect(circuit.gates[0][0]).toBe('X');
        expect(circuit.gates[1][0]).toBe('Y');
        expect(circuit.gates[2][0]).toBe('c');
    });

    test('inserts barriers correctly', () => {
        circuit.addGate(0, 0, 'b');
        expect(circuit.gates[0][0]).toBe('b');
        expect(circuit.gates[1][0]).toBe('b');
        expect(circuit.gates[2][0]).toBe('b');
    });

    test('extends barriers correctly', () => {
        circuit.addGate(0, 0, 'b');
        expect(circuit.gates[0][0]).toBe('b');
        expect(circuit.gates[1][0]).toBe('b');
        expect(circuit.gates[2][0]).toBe('b');
        circuit.addQubitRow();
        expect(circuit.gates[3][0]).toBe('b');
    });

    test('removes barriers correctly', () => {
        circuit.addGate(0, 0, 'b');
        expect(circuit.gates[0][0]).toBe('b');
        expect(circuit.gates[1][0]).toBe('b');
        expect(circuit.gates[2][0]).toBe('b');
        circuit.removeGate(0, 0, 'b');
        expect(circuit.gates[0][0]).toBe(0);
        expect(circuit.gates[1][0]).toBe(0);
        expect(circuit.gates[2][0]).toBe(0);
    });

    test('removes gates correctly', () => {
        circuit.addGate(0, 0, 'X');
        expect(circuit.gates[0][0]).toBe('X');
        circuit.removeGate(0, 0, 'X');
        expect(circuit.gates[0][0]).toBe(0);
    });

    test('normalizes empty space correctly', () => {
        circuit.addGate(0, 0, 'X');
        circuit.normalizeEmptySpace();
        expect(circuit.gates[0]).toEqual(['X', 0]);
        expect(circuit.gates[1]).toEqual([0, 0]);
    });

    test('validates a pair swap nodes correctly', () => {
        circuit.addGate(0, 0, 'sw');
        circuit.addGate(1, 0, 'sw');
        circuit.validateCircuit();
        expect(circuit.gates[0][0]).toBe('sw');
        expect(circuit.gates[1][0]).toBe('sw');
    });

    test('invalidates a single swap node correctly', () => {
        circuit.addGate(0, 0, 'sw');
        circuit.addGate(1, 0, 'X');
        circuit.validateCircuit();
        expect(circuit.gates[0][0]).toBe('Esw');
    });

    test('invalidates >2 swap nodes correctly', () => {
        circuit.addGate(0, 0, 'sw');
        circuit.addGate(1, 0, 'sw');
        circuit.addGate(2, 0, 'sw');
        circuit.validateCircuit();
        expect(circuit.gates[0][0]).toBe('Esw');
        expect(circuit.gates[1][0]).toBe('Esw');
        expect(circuit.gates[2][0]).toBe('Esw');
    });

    test('gets all valid drop areas correctly', () => {
        circuit.addGate(0, 0, 'X');
        circuit.addGate(1, 0, 'X');
        circuit.addGate(2, 0, 'X');
        const dropAreas = circuit.getAllDropAreas(0);
        const sortedDropAreas = dropAreas.map(area => area.join(',')).sort();
        const expectedAreas = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]].map(area => area.join(',')).sort();
        expect(sortedDropAreas).toEqual(expectedAreas);
    });

    test('clears the circuit correctly', () => {
        circuit.addGate(0, 0, 'X');
        circuit.clear();
        expect(circuit.gates[0]).toEqual([0]);
        expect(circuit.gates[1]).toEqual([0]);
        expect(circuit.gates[2]).toEqual([0]);
    });

    test('clears the circuit correctly when number of qubits has changed', () => {
        circuit.addQubitRow();
        circuit.addQubitRow();
        circuit.addQubitRow();
        circuit.addGate(0, 5, 'X');
        circuit.clear();
        expect(circuit.gates[0]).toEqual([0]);
        expect(circuit.gates[1]).toEqual([0]);
        expect(circuit.gates[2]).toEqual([0]);
        expect(circuit.gates[3]).toEqual([0]);
        expect(circuit.gates[4]).toEqual([0]);
        expect(circuit.gates[5]).toEqual([0]);
    });

    test('gets the connection between swaps correctly', () => {
        circuit.addGate(0, 0, 'sw');
        circuit.addGate(1, 0, 'sw');
        const connections = circuit.getAllConnectors();
        expect(connections).toEqual([[0, 0, 1]]);
    });

    test('gets the connection between a control and a square gate correctly', () => {
        circuit.addGate(0, 0, 'c');
        circuit.addGate(2, 0, 'X');
        const connections = circuit.getAllConnectors();
        expect(connections).toEqual([[0, 0, 2]]);
    });

    test('gets the connection between a control and multiple square gates correctly', () => {
        circuit.addGate(0, 0, 'c');
        circuit.addGate(1, 0, 'X');
        circuit.addGate(2, 0, 'X');
        const connections = circuit.getAllConnectors();
        expect(connections).toEqual([[0, 0, 2]]);
    });

    test('gets the connection between a swap pair and a control correctly', () => {
        circuit.addGate(0, 0, 'c');
        circuit.addGate(0, 0, 'sw');
        circuit.addGate(2, 0, 'sw');
        const connections = circuit.getAllConnectors();
        expect(connections).toEqual([[0, 0, 2]]);
    });

    test('gets multiple connections in a circuit correctly', () => {
        circuit.addGate(0, 0, 'c');
        circuit.addGate(0, 0, 0);
        circuit.addGate(2, 0, 'X');

        circuit.addGate(0, 1, 'X');

        circuit.addGate(0, 2, 0);
        circuit.addGate(1, 2, 'sw');
        circuit.addGate(2, 2, 'sw');
        const connections = circuit.getAllConnectors();
        expect(connections).toEqual([[0, 0, 2], [1, 2, 2]]); 
    });

    test('gets swap connect with a control in column correctly', () => {
        circuit.addGate(0, 0, 'c');
        circuit.addGate(1, 0, 'sw');
        circuit.addGate(2, 0, 'sw');
        const connections = circuit.getAllConnectors();
        expect(connections).toEqual([[0, 0, 2], [0, 0, 2]]);
    });

    test('sets title correctly', () => {
        circuit.setTitle('New Title');
        expect(circuit.title).toBe('New Title');
    });

    test('sets description correctly', () => {
        circuit.setDescription('New Description');
        expect(circuit.description).toBe('New Description');
    });

    test('prints the circuit correctly', () => {
        const logSpy = jest.spyOn(console, 'log');
        circuit.addGate(0, 0, 'X');
        circuit.addGate(1, 0, 'X');
        circuit.addGate(2, 0, 'X');
        circuit.addGate(0, 1, 'X');
        circuit.addGate(1, 1, 'X');
        circuit.addGate(2, 1, 'X');
        circuit.addGate(0, 2, 'X');
        circuit.addGate(1, 2, 'X');
        circuit.addGate(2, 2, 'X');
        circuit.print();
        const expectedCircuit = 'qubit 0: X X X 0\nqubit 1: X X X 0\nqubit 2: X X X 0\n';
        expect(logSpy.mock.calls[0][0].trim().replace(/\s+/g, ' ')).toBe(expectedCircuit.trim().replace(/\s+/g, ' '));
        logSpy.mockRestore();
    });

});

