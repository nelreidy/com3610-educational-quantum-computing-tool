import * as ttc from '../talk_to_cirq';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            status: 'ok',
            state_vector: [1, 0],
            probed_values: [{ index: 0, value: 0.5 }]
        }),
    })
);

describe('simulate function', () => {
    beforeEach(() => {
        ttc.currentStatus = null;
        ttc.currentStateVector = [];
        ttc.currentMeasurementProbeValues = [];
        jest.clearAllMocks();  
        console.error = jest.fn();
    });

    test('updates state correctly on successful simulation', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    status: 'ok',
                    state_vector: [1, 0],
                    probed_values: [{ index: 0, value: 0.5 }]
                }),
            })
        );
        
        await ttc.simulate([{ gate: 'H', qubit: 0 }], [{ qubit: 0, toggle: 1 }]);
        
        expect(ttc.currentStatus).toEqual('ok');
        expect(ttc.currentStateVector).toEqual([1, 0]);
        expect(ttc.currentMeasurementProbeValues).toEqual([{ index: 0, value: 0.5 }]);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('handles non-ok status responses', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    status: 'error',
                    error: 'Something went wrong'
                }),
            })
        );
    
        await ttc.simulate([{ gate: 'X', qubit: 1 }], [{ qubit: 1, toggle: 1 }]);
        expect(ttc.currentStatus).toEqual('error');
    });

    test('handles errors correctly', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Failed to connect'))
        );
    
        await ttc.simulate([{ gate: 'X', qubit: 1 }], [{ qubit: 1, toggle: 1 }]);
    
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(ttc.currentStatus).toEqual('error');
    });
});




