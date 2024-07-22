import { saveCircuit, setSaveForm, setLoadForm } from '../load_save.mjs';
import { circuit } from '../circuit_area.mjs';
import { createModalAlert } from '../import_export.mjs';
import { fetchCircuits } from '../ajax_tables.mjs';

jest.mock('../circuit_area.mjs', () => ({
    circuit: {
        setTitle: jest.fn(),
        setDescription: jest.fn(),
        title: '',
        description: ''
    }
}));

jest.mock('../import_export.mjs', () => ({
    createModalAlert: jest.fn()
}));

jest.mock('../ajax_tables.mjs', () => ({
    fetchCircuits: jest.fn()
}));

global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Saved successfully', file_id: '12345' })
}));

global.history.pushState = jest.fn();

const setupDOMElements = () => {
    document.body.innerHTML = `
        <input id="save-circuit-name" value="" />
        <input id="save-circuit-desc" value="" />
    `;
};

beforeEach(() => {
    setupDOMElements();
    jest.clearAllMocks();
});

describe('saveCircuit', () => {
    it('should prevent default, save circuit details, and update history', async () => {
        const event = { preventDefault: jest.fn() };
        document.getElementById('save-circuit-name').value = 'Quantum Magic';
        document.getElementById('save-circuit-desc').value = 'Entangle the impossible';

        await saveCircuit(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(circuit.setTitle).toHaveBeenCalledWith('Quantum Magic');
        expect(circuit.setDescription).toHaveBeenCalledWith('Entangle the impossible');
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/save_circuit/?title=Quantum Magic'), expect.anything());
        expect(history.pushState).toHaveBeenCalledWith({}, '', expect.any(String));
        expect(createModalAlert).toHaveBeenCalledWith('Saved successfully', 1);
    });

    it('should handle unsuccessful save operation', async () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ message: 'Failed to save' })
        }));

        const event = { preventDefault: jest.fn() };
        document.getElementById('save-circuit-name').value = 'Faulty Circuit';
        document.getElementById('save-circuit-desc').value = 'This should fail';

        await saveCircuit(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.anything());
        expect(history.pushState).not.toHaveBeenCalled();
        expect(createModalAlert).toHaveBeenCalledWith('Failed to save', 0);
    });
});

describe('setSaveForm', () => {
    it('should set the form values from the circuit object', () => {
        circuit.title = 'Quantum Leap';
        circuit.description = 'Step into a new dimension';

        setSaveForm();

        expect(document.getElementById('save-circuit-name').value).toBe('Quantum Leap');
        expect(document.getElementById('save-circuit-desc').value).toBe('Step into a new dimension');
    });
});

describe('setLoadForm', () => {
    it('should call fetchCircuits with page 1', () => {
        setLoadForm();
        expect(fetchCircuits).toHaveBeenCalledWith(1);
    });
});
