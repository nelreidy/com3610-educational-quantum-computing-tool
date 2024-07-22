import { Grapher } from '../graphs.mjs';
import ApexCharts from 'apexcharts';
import { measureToggle } from '../circuit_area.mjs';

jest.mock('apexcharts', () => {
    const mockApexCharts = jest.fn().mockImplementation(() => ({
        render: jest.fn(),
        updateSeries: jest.fn(),
    }));
    return mockApexCharts;
});

describe("Grapher", () => {
    let grapher;
    beforeEach(() => {
        document.body.innerHTML = `<div id="column-chart"></div>`;
        grapher = new Grapher();
        jest.spyOn(grapher.mainChart, 'updateSeries');
        measureToggle.forEach(toggle => toggle.toggle = 0);
    });

    it('initializes correctly with default properties', () => {
        expect(ApexCharts).toHaveBeenCalled();
        expect(grapher.probabilities).toEqual([]);
        expect(grapher.mainArea).not.toBeNull();
        expect(grapher.mainChart).toBeDefined();
    });

    it('updates the graph with new probabilities', () => {
        measureToggle.forEach(toggle => toggle.toggle = 0);
        measureToggle[0].toggle = 1;
        const mockProbabilities = [0.1, 0.9];

        grapher.update(mockProbabilities);

        const expectedData = [
            { x: '0', y: 0.1 },
            { x: '1', y: 0.9 }
        ];
        expect(grapher.probabilities).toEqual(mockProbabilities);
        expect(grapher.mainChart.updateSeries).toHaveBeenCalledWith([{ name: 'Probability', data: expectedData }]);
    });

    it('generates correct labels based on toggled qubits', () => {
        measureToggle[0].toggle = 1;
        measureToggle[1].toggle = 1;

        const labels = grapher.generateLabels();
        expect(labels).toEqual(['00', '01', '10', '11']);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('updates the graph correctly with probabilities for multiple qubits', () => {
        measureToggle.forEach((toggle, index) => toggle.toggle = index < 3 ? 1 : 0);
        const mockProbabilities = [0.1, 0.2, 0.3, 0.4, 0.1, 0.2, 0.3, 0.4];
    
        grapher.update(mockProbabilities);
    
        const expectedData = [
            { x: '000', y: 0.1 },
            { x: '001', y: 0.2 },
            { x: '010', y: 0.3 },
            { x: '011', y: 0.4 },
            { x: '100', y: 0.1 },
            { x: '101', y: 0.2 },
            { x: '110', y: 0.3 },
            { x: '111', y: 0.4 }
        ];
        expect(grapher.mainChart.updateSeries).toHaveBeenCalledWith([{ name: 'Probability', data: expectedData }]);
    });

    it('should return an empty array of labels when no qubits are toggled', () => {
        const labels = grapher.generateLabels();
        expect(labels).toEqual([]);
    });
    
});