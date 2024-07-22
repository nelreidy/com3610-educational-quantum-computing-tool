import { HoverInfo } from '../hover_info.mjs';
import { circuit } from '../circuit_area.mjs';

jest.mock('../circuit_area.mjs', () => ({
    circuit: {
        _description: "This is a sample circuit description.",
        setDescription: function(description) { this._description = description; },
        get description() {
            return this._description;
        },
        set description(value) {
            this._description = value;
        }
    }
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('<p>Mocked Info</p>')
  })
);

describe('HoverInfo Functionality', () => {
    let hoverInfo;
    const originalFetch = global.fetch;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="info-contents"></div>
            <div class="info-for-test"></div>
            <div class="info-for-another"></div>
        `;

        hoverInfo = new HoverInfo();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve('<p>Mocked Info</p>')
            })
        );
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    test('fetches and displays info when hovered', async () => {
        const testElement = document.querySelector('.info-for-test');
        hoverInfo.generateInfo();

        const event = new MouseEvent('mouseenter', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        Object.defineProperty(event, 'target', {value: testElement});
        testElement.dispatchEvent(event);

        await new Promise(resolve => setTimeout(resolve));

        expect(fetch).toHaveBeenCalledWith('/static/html/test.html');
        expect(hoverInfo.infoArea.innerHTML).toContain('<p>Mocked Info</p>');
    });

    test('updates circuit description on input', () => {
        const descriptionTextarea = document.getElementById('description-textarea');
        const newText = 'New circuit description';
        descriptionTextarea.textContent = newText;

        const inputEvent = new Event('input');
        descriptionTextarea.dispatchEvent(inputEvent);

        expect(circuit.description).toBe(newText);
    });
});

