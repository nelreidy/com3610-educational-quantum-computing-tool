import { createMeasurementSvg, constructSvg, createComponentIcon, constructSquareGate, drawMeasurementInCircuit } from '../icons.mjs';
import { svgGates } from '../circuit_area.mjs';

describe('Icon Creation', () => {
    beforeEach(() => {
        console.error = jest.fn();
    });
    describe('createMeasurementSvg', () => {
        test('creates an SVG for measurement with correct attributes', () => {
            const svg = createMeasurementSvg();
            expect(svg).toBeInstanceOf(SVGElement);
            expect(svg.querySelector('rect')).not.toBeNull();
            expect(svg.querySelector('path')).not.toBeNull();
            expect(svg.querySelector('path').getAttribute('d')).toBeTruthy(); 
        });
    });

    describe('constructSvg', () => {
        test.each([
            ['c', 'circle'],
            ['ac', 'circle'],
            ['sw', 'g'],
            ['Esw', 'g'],
            ['X', 'g'],
            ['M', 'svg'],
        ])('constructs %s node SVG with correct child element %s', (letter, expectedChildType) => {
            const svg = constructSvg(letter);
            expect(svg).toBeInstanceOf(SVGElement);
            expect(svg.querySelector(expectedChildType)).not.toBeNull();
        });

        test('handles invalid node type', () => {
            const consoleSpy = jest.spyOn(console, 'error');
            const svg = constructSvg('invalid');
            expect(svg.children.length).toBe(0); 
            expect(consoleSpy).toHaveBeenCalledWith('Invalid node type: invalid');
        });

        test('with no param', () => {
            const consoleSpy = jest.spyOn(console, 'error');
            const svg = constructSvg();
            expect(svg.children.length).toBe(0); 
            expect(consoleSpy).toHaveBeenCalled();
        })
    });

    describe('constructSquareGate', () => {
        test.each([
            ['A', '#1e40af'],
            ['B', '#bd5111'],
            ['C', '#5c138e'],
            ['X', '#be20b2'],
            ['Y', '#24e33b'],
            ['Z', '#709987'],
        ])('creates an icon for any letter and colour', (letter, colour) => {
            const gate = constructSquareGate(letter, colour);
            expect(gate).toBeInstanceOf(HTMLDivElement);
            expect(gate.querySelector('rect')).not.toBeNull();
            expect(gate.querySelector('text')).not.toBeNull();
            expect(gate.querySelector('text').textContent).toBe(letter);
            expect(gate.querySelector('line').getAttribute('stroke')).toBe(colour);
        });
    })

    describe('createComponentIcon', () => {
        beforeEach(() => {
            svgGates.push({ letter: 'H', svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg') });
        });

        test('creates an icon for known SVG gates', () => {
            const component = createComponentIcon('H', '#000000');
            expect(component.querySelector('svg')).not.toBeNull();
            expect(component.style.userSelect).toBe('none');
        });

        test('creates a measurement component when letter is M', () => {
            const component = createComponentIcon('M', '#000000');
            expect(component.querySelector('svg')).not.toBeNull();
        });

        test('creates square gate for a non SVG gate', () => {
            const component = createComponentIcon('A', '#000000');
            expect(component.querySelector('svg')).not.toBeNull();
            expect(component.style.userSelect).toBe('none');
        })
    });

    describe('drawMeasurementInCircuit', () => {
        test('renders an SVG measurement gate with correct properties', () => {
            const probability = 0.5;
            const gate = drawMeasurementInCircuit(probability);
            expect(gate).toBeInstanceOf(HTMLElement);
            expect(gate.classList.contains('gate-block')).toBe(true);
            const svg = gate.querySelector('svg');
            expect(svg).not.toBeNull();
            expect(svg.getAttribute('viewBox')).toBe('0 0 100 100');
            const rect = svg.querySelector('rect');
            expect(rect).not.toBeNull();
            expect(rect.getAttribute('fill')).toBe('white');
            const fill = svg.querySelectorAll('rect')[1];
            expect(fill).not.toBeNull();
            expect(fill.getAttribute('fill')).toBe('#a5b4fc');
            expect(parseInt(fill.getAttribute('height'))).toBeCloseTo(45, 0);
            expect(fill.getAttribute('y')).toBe('50');
            const text = svg.querySelector('text');
            expect(text).not.toBeNull();
            expect(text.textContent).toBe(probability.toFixed(2));
            expect(text.getAttribute('fill')).toBe('black');
            expect(text.getAttribute('stroke')).toBe('white');
            const outline = svg.querySelectorAll('rect')[2];
            expect(outline).not.toBeNull();
            expect(outline.getAttribute('stroke')).toBe('black');
        });
    
        test('handles zero probability', () => {
            const gate = drawMeasurementInCircuit(0);
            const svg = gate.querySelector('svg');
            const fill = svg.querySelectorAll('rect')[1];
            expect(parseInt(fill.getAttribute('height'))).toBe(0);
            expect(fill.getAttribute('y')).toBe('95');
        });
    
        test('handles full probability', () => {
            const gate = drawMeasurementInCircuit(1);
            const svg = gate.querySelector('svg');
            const fill = svg.querySelectorAll('rect')[1];
            expect(parseInt(fill.getAttribute('height'))).toBe(90);
            expect(fill.getAttribute('y')).toBe('5');
        });

        test('handles no probability', () => {
            const gate = drawMeasurementInCircuit();
            const svg = gate.querySelector('svg');
            const fill = svg.querySelectorAll('rect')[1];
            expect(parseInt(fill.getAttribute('height'))).toBe(0);
            expect(fill.getAttribute('y')).toBe('95');
        });
    });
});
