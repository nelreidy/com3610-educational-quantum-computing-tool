import { importCircuit } from '../import_export.mjs';
import { setCurrentQubits, updateArea, gateData } from '../circuit_area.mjs';

jest.mock('../circuit_area.mjs', () => {
    const actualModule = jest.requireActual('../circuit_area.mjs');
    return {
        circuit: {
            setTitle: jest.fn(),
            setDescription: jest.fn(),
            setQubits: jest.fn(),
            title: '',
            description: '',
            qubits: 3,
            gates: []
        },
        MIN_QUBITS: 1,
        MAX_QUBITS: 20,
        setCurrentQubits: jest.fn(),
        updateArea: jest.fn(),
        gateData: actualModule.gateData,
        svgGates: actualModule.svgGates,
    };
});

describe('importCircuit', () => {
    const { circuit, MIN_QUBITS, MAX_QUBITS } = require('../circuit_area.mjs');
    beforeEach(() => {
        circuit.setTitle.mockClear();
        circuit.setDescription.mockClear();
        circuit.setQubits.mockClear();
        global.FileReader = jest.fn(function() {
            this.readAsText = jest.fn();
            this.addEventListener = jest.fn(function(event, callback) {
                if (event === 'load') {
                    this.onload = callback;
                }
            });
        });
        document.body.innerHTML = `
            <div id="circuit-name-nav"></div>
            <div id="toast-parent"></div>
        `;
        console.error = jest.fn();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    it('should handle JSON with valid circuit data', () => {
        const event = { preventDefault: jest.fn() };
        const validCircuitJSON = JSON.stringify({
            title: 'New Circuit',
            description: 'A detailed description',
            qubits: 3,
            gates: [['X', 'H', 'X']]
        });
        const file = new Blob([validCircuitJSON], { type: 'application/json' });

        importCircuit(event, file);
        
        const mockFileReaderInstance = FileReader.mock.instances[0];
        mockFileReaderInstance.onload({ target: { result: validCircuitJSON } });
        expect(setCurrentQubits).toHaveBeenCalledWith(3);
        expect(updateArea).toHaveBeenCalled();
    });

    it('should read file and update circuit', () => {
        const event = { preventDefault: jest.fn() };
        const file = new Blob(['test'], { type: 'text/plain' });
        importCircuit(event, file);
        const mockFileReaderInstance = FileReader.mock.instances[0];
        expect(mockFileReaderInstance.readAsText).toHaveBeenCalledWith(file);
        expect(mockFileReaderInstance.onload).toBeDefined();
        expect(mockFileReaderInstance.readAsText).toHaveBeenCalled();
    });

    it('should handle JSON with invalid keys', () => {
        const event = { preventDefault: jest.fn() };
        const invalidJSON = JSON.stringify({ invalidKey: 'someValue', anotherKey: 'anotherValue' });
        const file = new Blob([invalidJSON], { type: 'application/json' });
        importCircuit(event, file);
        const mockFileReaderInstance = FileReader.mock.instances[0];
        mockFileReaderInstance.onload({ target: { result: invalidJSON } });
        const alertContent = document.getElementById('alert-content').textContent;
        expect(alertContent).toContain('Invalid JSON file');
    });

    it('should handle JSON with out of range qubits', () => {
        const event = { preventDefault: jest.fn() };
        const outOfRangeQubitsJSON = JSON.stringify({ qubits: 100, gates: [], title: 'New Circuit', description: 'Description' });
        const file = new Blob([outOfRangeQubitsJSON], { type: 'application/json' });
        importCircuit(event, file);
        const mockFileReaderInstance = FileReader.mock.instances[0];
        mockFileReaderInstance.onload({ target: { result: outOfRangeQubitsJSON } });
        const alertContent = document.getElementById('alert-content').textContent;
        expect(alertContent).toContain('Invalid number of qubits');
    }); 

    it('should handle JSON with invalid gates', () => {
        const event = { preventDefault: jest.fn() };
        const outOfRangeQubitsJSON = JSON.stringify({ qubits: 10, gates: [['notagate', 0, 0]], title: 'New Circuit', description: 'Description' });
        const file = new Blob([outOfRangeQubitsJSON], { type: 'application/json' });
        importCircuit(event, file);
        const mockFileReaderInstance = FileReader.mock.instances[0];
        mockFileReaderInstance.onload({ target: { result: outOfRangeQubitsJSON } });
        const alertContent = document.getElementById('alert-content').textContent;
        expect(alertContent).toContain('Invalid gate in circuit');
    }); 
});

