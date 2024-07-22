import { startTutorial } from '../tutorial.mjs';

describe('Tutorial Functionality', () => {
    let originalDocument;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="tutorial-overlay" style="display: none;"></div>
            <div id="sim-container"></div>
            <div id="gate-selector"></div>
            <div id="info-area"></div>
            <div id="circuit-wrapper"></div>
            <div id="qubit-labels"></div>
            <div id="circuit-lines"></div>
            <div id="qubit-buttons"></div>
        `;

        originalDocument = global.document;
        Element.prototype.scrollIntoView = jest.fn();
    });

    afterEach(() => {
        global.document = originalDocument;
    });

    test('startTutorial initializes tutorial correctly', () => {
        const overlay = document.getElementById('tutorial-overlay');
        startTutorial();
        expect(overlay.style.display).toBe('flex');
        expect(document.querySelector('#tutorial-text')).not.toBeNull();
        expect(document.body.style.overflow).toBe('hidden');
    });

    test('startTutorial progresses through step(s) on click', () => {
        const overlay = document.getElementById('tutorial-overlay');
        startTutorial();
        overlay.dispatchEvent(new MouseEvent('click'));
        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
        expect(document.querySelector('#tutorial-text')).not.toBeNull();
    });

    test('tutorial cleanup resets UI and updates URL correctly', () => {
        const overlay = document.getElementById('tutorial-overlay');
        startTutorial();
        for (let i = 0; i < 7; i++) {
            overlay.dispatchEvent(new MouseEvent('click'));
        }
        overlay.dispatchEvent(new MouseEvent('click'));
        const urlParams = new URLSearchParams(window.location.search);
        expect(urlParams.has('tutorial')).toBe(false);
    });
    
});
