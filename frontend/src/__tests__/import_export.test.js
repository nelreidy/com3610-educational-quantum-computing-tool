import { exportCircuit, setExportForm, setImportForm, createModalAlert } from '../import_export.mjs';

jest.mock('../circuit_area.mjs', () => ({
    circuit: {
       _title: '',
        setTitle: function(title) { this._title = title; },
        get title() {
            return this._title;
        },
        set title(value) {
            this._title = value;
        },
        _description: '',
        setDescription: function(description) { this._description = description; },
        get description() {
            return this._description;
        },
        set description(value) {
            this._description = value;
        } 
    }
}));

describe('exportCircuit', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="export-circuit-name" value="Test Circuit" />
            <textarea id="export-circuit-desc">Description of the test circuit</textarea>
            <div id="toast-parent" class="p-3 hidden fixed bottom-0 left-0 flex items-center justify-center z-10">
                <div></div>
            </div>
        `;
        global.URL.createObjectURL = jest.fn(() => "mock-url");
        global.Blob = jest.fn();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.resetAllMocks();
    });


    it('should prevent the default form submission', () => {
        const event = { preventDefault: jest.fn() };
        exportCircuit(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should create a blob with the circuit data and trigger download', () => {
        const event = { preventDefault: jest.fn() };
        exportCircuit(event);
        expect(Blob).toHaveBeenCalledTimes(1);
        expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    });
});

describe('setExportForm', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="export-circuit-name" />
            <textarea id="export-circuit-desc"></textarea>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.resetAllMocks();
    });

    it('should set the export form values from the circuit data', () => {
        setExportForm();
        expect(document.getElementById('export-circuit-name').value).toBe("Test Circuit");
        expect(document.getElementById('export-circuit-desc').value).toBe("Description of the test circuit");
    });
});

describe('setImportForm', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <label for="file_input"></label>
            <input id="file_input" type="file" />
            <div id="file_name"></div>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.resetAllMocks();
    });

    it('should set the import form values from the circuit data', () => {
        const fileInput = document.getElementById('file_input');
        Object.defineProperty(fileInput, 'files', {
            value: [{
                name: 'testFile'
            }]
        });
        setImportForm();
        const event = new Event('change');
        fileInput.dispatchEvent(event);
        expect(document.getElementById('file_name').textContent).toBe("testFile selected");
    });
})

describe('createModalAlert', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="toast-parent"></div>';
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.resetAllMocks();
    });

    it('should create and display a modal alert', () => {
        createModalAlert('Test Alert', 1);
        const toast = document.getElementById('toast-alert');
        expect(toast.textContent).toContain('Test Alert');
    });

    it('should attach a click event to close the alert', () => {
        createModalAlert('Test Alert', 1);
        const closeButton = document.querySelector('button');
        closeButton.click();
        expect(document.getElementById('toast-alert').classList.contains('hidden')).toBe(true);
    });
});

