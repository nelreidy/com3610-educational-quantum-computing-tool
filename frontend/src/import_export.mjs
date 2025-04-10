/*
    File: import_export.mjs
    Author: Lea Button
    Date: 04-2024
*/

"use strict";

import { circuit, setCurrentQubits, updateArea, MIN_QUBITS, MAX_QUBITS, gateData, svgGates } from './circuit_area.mjs';

/**
 * A function to export the current circuit data to a JSON file
 * 
 * @param {*} event - The event that triggered the function
 */
export function exportCircuit(event) {
    event.preventDefault();
    var title = document.getElementById('export-circuit-name').value;
    var desc = document.getElementById('export-circuit-desc').value;

    circuit.setTitle(title);
    circuit.setDescription(desc);

    // Convert the circuit data to a JSON string
    var jsonData = JSON.stringify(circuit);
    var blob = new Blob([jsonData], {type: 'application/json'});

    // Create a link to download the Blob as a file
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.json`;

    link.click();
    createModalAlert('Circuit successfully exported', 1);
};

/**
 * A function to set the export form with the current circuit data
 */
export function setExportForm(){
    document.getElementById('export-circuit-name').value = circuit.title;
    document.getElementById('export-circuit-desc').value = circuit.description;
};

/**
 * A function to import a JSON file and update the circuit data accordingly
 * 
 * @param {*} event - The event that triggered the function
 * @param {*} file - The file to import
 */
export function importCircuit(event, file) {

    return new Promise((resolve, reject) => {
        if (event) event.preventDefault();

        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            var jsonData = JSON.parse(event.target.result);
            var circuitKeys = Object.keys(circuit).sort();
            var jsonKeys = Object.keys(jsonData).sort();

            // Check if the JSON keys are valid
            circuitKeys = Object.keys(circuit).filter(key => typeof circuit[key] !== 'function').sort();
            jsonKeys = Object.keys(jsonData).sort();
            if (JSON.stringify(circuitKeys) === JSON.stringify(jsonKeys)) {
                // Check if the number of qubits is between MIN and MAX qubits
                if (jsonData.qubits >= MIN_QUBITS && jsonData.qubits <= MAX_QUBITS) {
                    var allLetters = gateData.map(gate => gate.letter).concat(svgGates.map(gate => gate.letter));
                    var uniqueLetters = Array.from(new Set(allLetters));

                    for (var i = 0; i < jsonData.gates.length; i++) {
                        for (var j = 0; j < jsonData.gates[i].length; j++) {
                            if (jsonData.gates[i][j] != 0 && !uniqueLetters.includes(jsonData.gates[i][j])) {
                                createModalAlert('Invalid gate in circuit', 0);
                                console.error('Error: Invalid gate in circuit');
                                reject('Invalid gate in circuit');
                                return;
                            }
                        }
                    }

                    for (var key in jsonData) {
                        if (jsonData.hasOwnProperty(key) && circuit.hasOwnProperty(key)) {
                            circuit[key] = jsonData[key];
                        }
                    }
        
                    document.getElementById('circuit-name-nav').textContent = circuit.title;
                    setCurrentQubits(circuit.qubits);
                    updateArea();
                    resolve();
                    createModalAlert('Circuit successfully imported', 1);
                } else {
                    createModalAlert('Invalid number of qubits', 0);
                    console.error('Error: Invalid number of qubits');
                    reject('Invalid number of qubits');
                    return;
                }
            } else {
                createModalAlert('Invalid JSON file', 0);
                console.error('Error: Invalid JSON file');
                reject('Invalid JSON file');
            }
        });

        // Read the file as text
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

/**
 * A function to set the import form
 */
export function setImportForm() {
    document.getElementById('file_input').addEventListener('change', function() {
        var fileName = this.files[0] ? this.files[0].name : 'No file selected';
        document.getElementById('file_name').textContent = fileName + " selected";
    });

    var label = document.querySelector('label[for="file_input"]');

    // Prevent the default behavior when a file is dragged over the label
    label.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    // Handle the drop event to get the dropped files
    label.addEventListener('drop', function(event) {
        event.preventDefault();
        var files = event.dataTransfer.files;
        // If there are any files, set the first one as the input's file
        if (files.length) {
            document.getElementById('file_input').files = files;
            document.getElementById('file_name').textContent = files[0].name + " selected";
        }
    });
}

/**
 * A function to create and show a modal alert
 * 
 * @param {*} message - The message to display in the alert
 * @param {*} type - The type of alert to display (0 = error, 1 = success)
 */
export function createModalAlert(message, type) {
    var toastParent = document.getElementById('toast-parent');

    while (toastParent.firstChild) {
        toastParent.removeChild(toastParent.firstChild);
    }

    var toast = document.createElement('div');
    toast.id = 'toast-alert';
    toast.classList.add('flex', 'items-center', 'w-full', 'max-w-xs', 'p-4', 'text-gray-500', 'bg-white', 'rounded-lg', 'shadow', 'dark:text-gray-400', 'dark:bg-gray-800');
    toast.setAttribute('role', 'alert');

    var icon;
    if (type == 0) icon = errorIcon();
    else icon = successIcon();

    var content = document.createElement('div');
    content.id = 'alert-content';
    content.classList.add('ms-3', 'text-sm', 'font-normal');
    content.textContent = message;

    var button = document.createElement('button');
    button.type = 'button';
    button.classList.add('ms-auto', '-mx-1.5', '-my-1.5', 'bg-white', 'text-gray-400', 'hover:text-gray-900', 'rounded-lg', 'focus:ring-2', 'focus:ring-gray-300', 'p-1.5', 'hover:bg-gray-100', 'inline-flex', 'items-center', 'justify-center', 'h-8', 'w-8', 'dark:text-gray-500', 'dark:hover:text-white', 'dark:bg-gray-800', 'dark:hover:bg-gray-700');
    button.setAttribute('data-dismiss-target', '#toast-alert');
    button.setAttribute('aria-label', 'Close');

    var svgClose = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgClose.classList.add('w-3', 'h-3');
    svgClose.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgClose.setAttribute('fill', 'none');
    svgClose.setAttribute('viewBox', '0 0 14 14');

    var pathClose = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathClose.setAttribute('stroke', 'currentColor');
    pathClose.setAttribute('stroke-linecap', 'round');
    pathClose.setAttribute('stroke-linejoin', 'round');
    pathClose.setAttribute('stroke-width', '2');
    pathClose.setAttribute('d', 'm1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6');

    button.addEventListener('click', function() {
        var targetId = this.getAttribute('data-dismiss-target');
        var target = document.querySelector(targetId);
        if (target) {
            target.classList.add('hidden');
            toastParent.classList.add('hidden');
        }
    });

    // add children to button
    svgClose.appendChild(pathClose);
    button.appendChild(svgClose);
    
    // add children to toast
    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(button);

    toastParent.appendChild(toast);
    //unhide toastParent
    toastParent.classList.remove('hidden');
}

/**
 * A function to create an error icon
 * 
 * @returns - an error icon
 */
function errorIcon() {
    var icon = document.createElement('div');
    icon.classList.add('inline-flex', 'items-center', 'justify-center', 'flex-shrink-0', 'w-8', 'h-8', 'text-red-500', 'bg-red-100', 'rounded-lg', 'dark:bg-red-800', 'dark:text-red-200');

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('w-4', 'h-4');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 24 24');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', 'M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');

    svg.appendChild(path);
    icon.appendChild(svg);

    return icon;
}

/**
 * A function to create a success icon
 * 
 * @returns - a success icon
 */
function successIcon() {
    var icon = document.createElement('div');
    icon.classList.add('inline-flex', 'items-center', 'justify-center', 'flex-shrink-0', 'w-8', 'h-8', 'text-green-500', 'bg-green-100', 'rounded-lg', 'dark:bg-green-800', 'dark:text-green-200');

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('w-4', 'h-4');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 24 24');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', 'M10 3v4a1 1 0 0 1-1 1H5m4 6 2 2 4-4m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZZ');

    svg.appendChild(path);
    icon.appendChild(svg);

    return icon;
}