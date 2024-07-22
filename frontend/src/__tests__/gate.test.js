import { Gate } from '../gate.mjs';
import * as circuitModule from '../circuit_area.mjs';

jest.mock('../circuit_area.mjs', () => {
    const actualModule = jest.requireActual('../circuit_area.mjs');
    return {
        ...actualModule,
        updateArea: jest.fn(), 
        circuit: { 
            ...actualModule.circuit, 
            addGate: jest.fn(), 
        }
    };
  });

describe('Gate class tests', () => {
    let body;
    beforeEach(() => {
        document.body.innerHTML = '';
        body = document.body;

        const activeArea = document.createElement("div");
        activeArea.id = "row-0-col-0";
        activeArea.style.position = "absolute";
        activeArea.style.top = "50px";
        activeArea.style.left = "50px";
        activeArea.style.width = "100px";
        activeArea.style.height = "100px";
        body.appendChild(activeArea);

        const elementArray = [];
        elementArray.push(activeArea);

        document.elementsFromPoint = jest.fn((x, y) => {
            return (x >= 50 && x <= 150 && y >= 50 && y <= 150) ? elementArray : [];
        });

        circuitModule.activeAreas.push(activeArea.id);
        circuitModule.updateArea.mockClear();
        circuitModule.circuit.addGate.mockClear();
        console.log = jest.fn();
    });

    test('constructor initializes correctly and appends element to body', () => {
        const gate = new Gate(100, 100, 'X', body, 'red');
        expect(document.body.contains(gate.element)).toBe(true);
        expect(gate.element.style.left).toBe('78px'); // 100 - 22
        expect(gate.element.style.top).toBe('78px'); // 100 - 22
        expect(gate.element.classList.contains('gate-wrapper')).toBe(true);
    });

    test('drag updates element position correctly', () => {
        const gate = new Gate(100, 100, 'X', body, 'red');
        
        gate.drag(150, 150);
    
        expect(gate.x).toBe(150 - window.scrollX);
        expect(gate.y).toBe(150 - window.scrollY);
        expect(gate.element.style.left).toBe('128px'); // 150 - 22
        expect(gate.element.style.top).toBe('128px'); // 150 - 22
    });    
    
    test('drop adds gate to circuit if over an active area', () => {
        const gate = new Gate(100, 100, 'X', body, 'red');
    
        gate.drag(100, 100);
        gate.drop();
    
        expect(circuitModule.updateArea).toHaveBeenCalled();
    });    

    test('drop does not add gate to circuit if not over an active area', () => {
        const gate = new Gate(100, 100, 'X', body, 'red');
    
        gate.drag(200, 200);
        gate.drop();
    
        expect(circuitModule.updateArea).not.toHaveBeenCalled();
    })
});