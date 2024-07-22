/*
    File: circuit_area.mjs
    Author: Lea Button
    Date: 03-2024
*/

"use strict";

import { initFlowbite } from "flowbite";
import { Gate } from './gate.mjs';
import { Circuit } from './circuit.mjs';
import { HoverInfo } from './hover_info.mjs';
import { Grapher } from "./graphs.mjs";
import { createMeasurementSvg, constructSvg, constructSquareGate, createComponentIcon, drawMeasurementInCircuit } from './icons.mjs';
import { simulate, currentStateVector, currentMeasurementProbeValues } from './talk_to_cirq.mjs';
import { exportCircuit, setExportForm, importCircuit, setImportForm } from './import_export.mjs';
import { saveCircuit, setSaveForm, loadCircuit, setLoadForm } from './load_save.mjs';
import { startTutorial } from './tutorial.mjs';


// Gate data (name and associated letter)
export const gateData = [
    { name: 'Pauli-X gate', letter: 'X', colour: '#1e40af'},
    { name: 'Pauli-Y gate', letter: 'Y', colour: '#1e40af'},
    { name: 'Pauli-Z gate', letter: 'Z', colour: '#1e40af'},
    { name: 'Hadamard gate', letter: 'H', colour: '#9d174d'}, 
    { name: 'S gate', letter: 'S', colour: '#1e1b4b'},
    { name: 'T gate', letter: 'T', colour: '#1e1b4b'},
    { name: 'Identity gate', letter: 'I', colour: '#1e1b4b'},
    { name: 'Control node', letter: 'c', colour: '#64748b'},
    { name: 'Anti-control node', letter: 'ac', colour: '#64748b'},
    { name: 'Swap node', letter: 'sw', colour: '#64748b'},
    { name: 'Barrier', letter: 'b', colour: '#64748b'},
    { name: 'Probability Probe', letter: 'M', colour: '#64748b'},
]; 

// Gates that are not created as squares, and require svg graphics 
export const svgGates = [
    { letter: 'c', svg: constructSvg('c') },
    { letter: 'ac', svg: constructSvg('ac') },
    { letter: 'sw', svg: constructSvg('sw') },
    { letter: 'Esw', svg: constructSvg('Esw') },
    { letter: 'b', svg: constructSvg('b') },
    { letter: 'X', svg: constructSvg('X') },
    { letter: 'M', svg: constructSvg('M') },
];

export const nodeGates = ['c', 'ac'];
export const squareGates = ['X', 'Y', 'Z', 'H', 'S', 'T', 'I'];

// Qubit measurement toggle data
export const measureToggle = [
    { qubit: 0, toggle: 0 },
    { qubit: 1, toggle: 0 },
    { qubit: 2, toggle: 0 },
    { qubit: 3, toggle: 0 },
    { qubit: 4, toggle: 0 },
    { qubit: 5, toggle: 0 },
    { qubit: 6, toggle: 0 },
    { qubit: 7, toggle: 0 },
    { qubit: 8, toggle: 0 },
];

const body = document.getElementById('body');

export const MAX_QUBITS = 9;
export const MIN_QUBITS = 3;
const INITIAL_QUBITS = 3;

export var activeAreas = [];
export var currentQubits = INITIAL_QUBITS;
var currentDropZones = [];
export var circuit = null;

var graphing;

/**
 * Sets the current number of qubits
 * 
 * @param {*} qubits - The number of qubits to set the circuit to
 */
export function setCurrentQubits(qubits) {
    currentQubits = qubits;
};

/**
 * Creates the sidebar of the circuit builder
 */
function createSideBar() {
    const componentBar = document.getElementById('component-bar');
    componentBar.classList.add('space-y-2', 'flex', 'flex-col');

    const gateSelector = createGateSelector();
    componentBar.appendChild(gateSelector);

    const infoArea = createInfoArea();
    componentBar.appendChild(infoArea);
}

/**
 * Creates the gate selection area (toolbox) for the circuit builder
 * 
 * @returns - The gate selector div
 */
function createGateSelector() {
    const gateSelector = document.createElement('div');
    gateSelector.classList.add('p-1', 'bg-white', 'rounded-md', 'flex', 'flex-col', 'items-center', 'justify-center', 'border', 'border-gray-300');
    gateSelector.id = 'gate-selector';

    // create an SVG for the icon
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    iconSvg.setAttribute('width', '16');
    iconSvg.setAttribute('height', '16');
    iconSvg.setAttribute('fill', 'currentColor');
    iconSvg.setAttribute('class', 'bi bi-box');
    iconSvg.setAttribute('viewBox', '0 0 16 16');
    iconSvg.style.marginRight = '7px';
    // Taken from https://icons.getbootstrap.com/icons/box/
    iconSvg.innerHTML = '<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>';

    // create a div for the title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('flex', 'items-center', 'p-2', 'w-full', 'border-b', 'border-gray-300')
    titleDiv.id = 'gate-selector-title';
    titleDiv.appendChild(iconSvg); 
    titleDiv.appendChild(document.createTextNode('Components'));

    gateSelector.appendChild(titleDiv);

    const toolbox = document.createElement('div');
    toolbox.id = 'toolbox';
    toolbox.classList.add('flex', 'flex-wrap', 'w-auto', 'items-center', 'h-auto', 'overflow-y-auto', 'mt-2');

    gateData.forEach(gate => {
        var gateIcon = createComponentIcon(gate.letter, gate.colour);  

        gateIcon.classList.add('flex-none', `info-for-${gate.letter}`);
        gateIcon.setAttribute('data-tooltip-target', 'tooltip-' + gate.letter);
        gateIcon.setAttribute('data-tooltip-placement', 'right');
        gateIcon.style.cursor = 'pointer';

        gateIcon.onmousedown = (event) => {
            event.preventDefault();
            var dragGate = new Gate(event.pageX, event.pageY, gate.letter, body, gate.colour, gate.letter);
            currentDropZones = circuit.getAllDropAreas();
            updateArea();
        };

        const tooltip = createTooltip(gate.letter, gate.name);

        toolbox.appendChild(gateIcon);
        toolbox.appendChild(tooltip);
    });

    gateSelector.appendChild(toolbox);
    return gateSelector;
}

/**
 * Creates a tooltip
 * 
 * @param {*} target - The target element to attach the tooltip to
 * @param {*} data - The text to display in the tooltip
 * @returns - The tooltip div
 */
function createTooltip(target, data) { 
    // create tooltip
    const tooltip = document.createElement('div');
    tooltip.setAttribute('id', 'tooltip-' + target);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.classList.add('absolute', 'z-50', 'invisible', 'inline-block', 'px-2', 'py-1', 'text-xs', 'font-small', 'text-white', 'transition-opacity', 'duration-200', 'bg-gray-700', 'rounded-lg', 'shadow-sm', 'opacity-0', 'tooltip', 'dark:bg-gray-700');
    tooltip.textContent = data;

    // create tooltip arrow inside tooltip div
    const tooltipArrow = document.createElement('div');
    tooltipArrow.classList.add('tooltip-arrow');
    tooltipArrow.setAttribute('data-popper-arrow', '');
    tooltip.appendChild(tooltipArrow);

    return tooltip;
}


/***
 * Creates the information area for the circuit builder
 * 
 * @returns - The information area div
 */
function createInfoArea() {
    const infoArea = document.createElement('div');
    infoArea.classList.add('flex', 'flex-col', 'flex-grow', 'p-1', 'bg-white', 'rounded-md', 'flex', 'flex-col', 'items-center', 'border', 'border-gray-300');
    infoArea.id = 'info-area';

    // create an SVG for the icon
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    iconSvg.setAttribute('width', '16');
    iconSvg.setAttribute('height', '16');
    iconSvg.setAttribute('fill', 'currentColor');
    iconSvg.setAttribute('class', 'bi bi-box');
    iconSvg.setAttribute('viewBox', '0 0 16 16');
    iconSvg.style.marginRight = '7px';
    // Taken from https://icons.getbootstrap.com/icons/box/
    iconSvg.innerHTML = '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>';

    // create a div for the title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('flex', 'items-center', 'p-2', 'w-full', 'border-b', 'border-gray-300')
    titleDiv.id = 'info-area-title';
    titleDiv.appendChild(iconSvg); // append the SVG to the title div
    titleDiv.appendChild(document.createTextNode('Information')); // append the text to the title div

    infoArea.appendChild(titleDiv);

    const contents = document.createElement('div');
    contents.id = 'info-contents';
    contents.classList.add('flex', 'flex-wrap', 'w-full', 'items-center', 'h-auto', 'overflow-y-auto', 'mt-2');

    infoArea.appendChild(contents);

    return infoArea;
}

/**
 * Creates the circuit area
 */
export function createArea() {
    const container = document.getElementById('circuit-wrapper');

    // create left side div for qubit labels
    const qubitLabels = document.createElement('div');
    qubitLabels.classList.add('items-center', 'justify-center', 'w-24', 'h-full', 'bg-gray-200', 'overflow-y-hidden');
    qubitLabels.id = 'qubit-labels';
    createQubitLabels(qubitLabels);

    // create center div for circuit lines, overflow for scrolling along large circuits (horizontally)
    const circuitLines = document.createElement('div');
    circuitLines.classList.add('items-center', 'justify-center', 'flex-1', 'h-auto', 'bg-gray-100', 'overflow-x-auto', 'overflow-y-hidden');
    circuitLines.id = 'circuit-lines';
    createLines(circuitLines);

    // create right side div for qubit measurement on/off buttons
    const qubitButtons = document.createElement('div');
    qubitButtons.classList.add('items-center', 'justify-center', 'w-14', 'h-auto', 'bg-gray-200', 'overflow-y-hidden');
    qubitButtons.id = 'qubit-buttons';
    createMeasurements(qubitButtons);

    // append to container
    container.appendChild(qubitLabels);
    container.appendChild(circuitLines);
    container.appendChild(qubitButtons);
}

/**
 * Creates the labels (q[0], q[1], etc) in the circuit area
 * 
 * @param {*} container  - The container to append the labels to
 */
function createQubitLabels(container) {
    // create the labels
    for (let i = 0; i < currentQubits; i++) { 
        var label = document.createElement('div');
        label.classList.add('h-14', 'text-black', 'text-center', 'flex', 'items-center', 'justify-center');
        label.style.userSelect = "none";
        label.textContent = `q[${i}]`;
        container.appendChild(label);
    }

    // create an extra row with +/- buttons to add/remove qubits
    var row = document.createElement('div');
    row.classList.add('h-10', 'w-full', 'flex', 'items-center', 'justify-center');
    row.style.userSelect = "none";

    // create minus button if currentQubits > minQubits
    if (currentQubits > MIN_QUBITS) {
        var minus = document.createElement('button');

        // for tooltips
        minus.setAttribute('data-tooltip-target', 'tooltip-minus');
        minus.setAttribute('data-tooltip-placement', 'right');

        minus.classList.add('h-6', 'w-8', 'mx-0.5', 'flex', 'items-center', 'justify-center', 'rounded-md', 'bg-indigo-600', 'px-3', 'py-1.5', 'text-sm', 'text-white', 'shadow-sm', 'hover:bg-indigo-500', 'focus-visible:outline', 'focus-visible:outline-2', 'focus-visible:outline-offset-2', 'focus-visible:outline-indigo-600');
        minus.textContent = '-';
        minus.addEventListener('click', function() {
            if (currentQubits > MIN_QUBITS) {
                currentQubits--;
                circuit.removeQubitRow();
                updateArea();
            }
        });

        var minusTooltip = createTooltip('minus', 'Remove qubit');
        row.appendChild(minus);
        row.appendChild(minusTooltip);
    }

    // create plus button if currentQubits < maxQubits
    if (currentQubits < MAX_QUBITS) {
        var plus = document.createElement('button');

        // for tooltips
        plus.setAttribute('data-tooltip-target', 'tooltip-plus');
        plus.setAttribute('data-tooltip-placement', 'right');

        plus.classList.add('h-6', 'w-8', 'm-0.5', 'flex', 'items-center', 'justify-center', 'rounded-md', 'bg-indigo-600', 'px-3', 'py-1.5', 'text-sm', 'text-white', 'shadow-sm', 'hover:bg-indigo-500', 'focus-visible:outline', 'focus-visible:outline-2', 'focus-visible:outline-offset-2', 'focus-visible:outline-indigo-600');
        plus.textContent = '+';
        plus.addEventListener('click', function() {
            if (currentQubits < MAX_QUBITS) {
                currentQubits++;
                circuit.addQubitRow();
                updateArea();
            }
        });

        var plusTooltip = createTooltip('plus', 'Add qubit');
        row.appendChild(plus);
        row.appendChild(plusTooltip);
    }
    container.appendChild(row);
}

/**
 * Creates the horizontal lines for each qubit in the circuit area
 * 
 * @param {*} container - The container to append the lines to
 */
function createLines(container) {
    var verticalLines = circuit.getAllConnectors();

    for (let i = 0; i < currentQubits; i++) {
        var row = document.createElement('div');
        row.classList.add('h-14', 'flex', 'items-center', 'justify-center', 'row');
        row.style.width = '100%';
        row.id = `circuit-row-${i}`;

        // create horizontal line in center of row
        var line = document.createElement('div');
        line.classList.add('h-px', 'bg-gray-300', 'z-0', 'relative', 'line');
        line.style.width = '100%';

        // get all drop zones for the current row
        let currentRowZones = currentDropZones.filter(zone => zone[0] === i);

        // create a zone div for each drop zone in the current row
        for (let j = 0; j < currentRowZones.length; j++) {
            var r = currentRowZones[j][0];
            var c = currentRowZones[j][1];

            var zone = document.createElement('div');
            zone.classList.add('w-14', 'h-14', 'flex', 'items-center', 'justify-center', 'absolute', 'z-0');
            zone.style.bottom = '0';
            zone.style.top = '0';
            zone.style.left = `${c * 3.5}rem`;
            zone.style.margin = 'auto';
            zone.id = `row-${r}-col-${c}`;
            activeAreas.push(zone.id);

            line.appendChild(zone);
        }

        // draw each gate in the current row
        for (let j = 0; j < circuit.gates[i].length; j++) {
            if (circuit.gates[i][j] != 0) {
                var parent = document.createElement('div');
                parent.classList.add('w-14', 'flex', 'items-center', 'justify-center', 'absolute', 'z-20');
                parent.style.bottom = '0';
                parent.style.left = `${j * 3.5}rem`;
                parent.style.margin = 'auto';
                parent.style.cursor = 'pointer';

                if (circuit.gates[i][j] != 0) { 
                    // if a square gate, create a div with the gate letter
                    if (circuit.gates[i][j] == 'M') {
                        parent.style.top = '0';
                        parent.classList.add('h-14');
                        parent.classList.add(`info-for-${circuit.gates[i][j]}`)
                        parent.id = `M-${i}-${j}`;

                        var svg = drawMeasurementInCircuit();
                        parent.appendChild(svg);

                    } else if (squareGates.includes(circuit.gates[i][j]) && circuit.gates[i][j] !== 'X') {
                        parent.style.top = '0';
                        parent.classList.add('h-14');
                        parent.classList.add(`info-for-${circuit.gates[i][j]}`)

                        var colour = gateData.find(gate => gate.letter == circuit.gates[i][j]).colour;
                        var gate = constructSquareGate(circuit.gates[i][j], colour);

                        parent.appendChild(gate);
                    // if its an svg gate, create a div with the svg graphic
                    } else if (svgGates.find(gate => gate.letter == circuit.gates[i][j])) {
                        parent.style.top = '0';
                        parent.classList.add('h-14');
                        let letter = circuit.gates[i][j];
        
                        // remove error from the gate
                        if (letter.includes('E')) {
                            letter = letter.slice(1);
                        }

                        let gate = gateData.find(gate => gate.letter == letter);
                        parent.classList.add(`info-for-${gate.letter}`)

                        var svg = svgGates.find((gate) => gate.letter == circuit.gates[i][j]).svg.cloneNode(true);
                        parent.appendChild(svg);
                    } 

                    parent.onmousedown = (event) => {
                        let letter = circuit.gates[i][j];
        
                        // remove error from the gate
                        if (letter.includes('E')) {
                            letter = letter.slice(1);
                        }

                        var gate;
                        if (svgGates.find(gate => gate.letter == letter)) {
                            gate = gateData.find(gate => gate.letter == letter);
                        } else {
                            gate = gateData.find(gate => gate.letter == letter);
                        }
        
                        var dragGate = new Gate(event.pageX, event.pageY, circuit.gates[i][j], body, gate.colour);
                        currentDropZones = circuit.getAllDropAreas();

                        circuit.removeGate(i, j);
                        updateArea();
                    };

                } else {
                    // if no gate, create a div with no content
                    parent.style.top = '0';
                    parent.classList.add('h-14');
                    activeAreas.push(parent.id);
                }
                line.appendChild(parent);
            }

            // drawing vertical lines to connect nodes with gates
            // check if current row and col exists in the connectors dict
            // connectors = [[row, col, endRow], ...]
            if (verticalLines.some(connector => connector[0] == i && connector[1] == j)) {
                // get the end row of the connector
                let endRow = verticalLines.find(connector => connector[0] == i && connector[1] == j)[2];

                let heightDivs = (endRow - i + 1);

                // container for the svg line
                var lineBox = document.createElement('div');
                let lineBoxHeight = 14 * heightDivs;
                lineBox.classList.add('w-14', `h-${lineBoxHeight}`, 'flex', 'items-center', 'justify-center', 'absolute', 'z-10');
                lineBox.style.bottom = 'auto';
                lineBox.style.top = '-1.75rem';
                lineBox.style.left = `${j * 3.5}rem`;
                lineBox.style.margin = 'auto';

                var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');

                let starty = 100 / (heightDivs * 2);
                let endy = starty * ((heightDivs * 2) - 1);

                // create a vertical line that spans from the first to the last gate
                var connectorLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                connectorLine.setAttribute('x1', '50%');  
                connectorLine.setAttribute('y1', `${starty}%`);  
                connectorLine.setAttribute('x2', '50%'); 
                connectorLine.setAttribute('y2', `${endy}%`);  
                connectorLine.setAttribute('stroke', 'black');
                connectorLine.setAttribute('stroke-width', '1');

                svg.appendChild(connectorLine);
                lineBox.appendChild(svg);
                line.appendChild(lineBox);
            } 
        }
        
        row.appendChild(line);
        container.appendChild(row);
    }
}

/**
 * Adjusts the width of each row in the circuit area to be the same as the longest (first) row's children.
 */
function adjustLineWidths() {
    const circuitLines = document.getElementById('circuit-lines');

    const rowDivs = circuitLines.querySelectorAll('.row');
    rowDivs.forEach(row => {
        row.style.width = `${circuitLines.offsetWidth + circuitLines.clientWidth}px`;
    });
}

/**
 * Adjusts the height of the container divs to be the same as the current circuit area height.
 */
function adjustContainerHeights() {
    const circuitLines = document.getElementById('circuit-lines');
    const qubitLabels = document.getElementById('qubit-labels');
    const qubitButtons = document.getElementById('qubit-buttons');
    const labelsChildren = qubitLabels.children;

    let maxHeight = 0;
    for (let i = 0; i < labelsChildren.length; i++) {
        maxHeight += labelsChildren[i].offsetHeight;
    }
    maxHeight = Math.max(maxHeight, circuitLines.offsetHeight);

    qubitLabels.style.height = `${maxHeight}px`;
    circuitLines.style.height = `${maxHeight}px`;
    qubitButtons.style.height = `${maxHeight}px`;
}

/**
 * Creates the measurement toggles for each qubit in the circuit area
 * 
 * @param {*} container - The container to append the measurements to
 */
function createMeasurements(container) {
    for (let i = 0; i < currentQubits; i++) {
        // div to contain the button to center it and pad it accordingly :)
        var div = document.createElement('div');
        div.classList.add('h-14', 'w-full', 'flex', 'items-center', 'justify-center');

        var button = document.createElement('button');

        // Get the colour of the button based on the toggle state
        var colour = measureToggle[i].toggle == 1 ? 'bg-green-500' : 'bg-white';

        button.classList.add('h-11', 'w-11', 'flex', 'items-center', 'justify-center', `${colour}`);
        button.setAttribute('aria-label', `Toggle measurement for qubit ${i}`);
        button.id = `measurement-tg-${i}`;

        // listener to visually change button when measure is toggled/not
        button.addEventListener('click', function() {
            if (measureToggle[i].toggle == 1) {
                measureToggle[i].toggle = 0;
                this.classList.remove('bg-white');
                this.classList.add('bg-green-500');
                updateArea();
            } else {
                measureToggle[i].toggle = 1;
                this.classList.remove('bg-green-500');
                this.classList.add('bg-white');
                updateArea();
            }
        });

        div.setAttribute('data-tooltip-target', 'tooltip-' + `measurement-tg-${i}`);
        div.setAttribute('data-tooltip-placement', 'left');

        const tooltip = createTooltip(`measurement-tg-${i}`, `Toggle measurement for qubit ${i}`);

        var svg = createMeasurementSvg();
        button.appendChild(svg);
        div.appendChild(button);
        container.appendChild(tooltip);
        container.appendChild(div);
    }
}

/**
 * Clears the circuit area of all children 
 */
function clearArea() {
    const circuitArea = document.getElementById('circuit-wrapper');
    while (circuitArea.firstChild) {
        circuitArea.removeChild(circuitArea.firstChild);
    }
}

/**
 * Updates the circuit area
 */
export async function updateArea() {
    // Save the horizontal circuit scroll
    var scrollLeft = document.getElementById('circuit-lines').scrollLeft;

    clearArea();
    createArea();
    adjustLineWidths();
    adjustContainerHeights();

    // Restore the scroll position
    document.getElementById('circuit-lines').scrollLeft = scrollLeft;

    await simulate(circuit, measureToggle);

    // dont stall the updateArea function to wait for measurements, just redraw once they are ready
    updateMeasurementProbes();

    graphing.update(currentStateVector);

    // Update url with circuit data
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);
    params.set('load', encodeURIComponent(JSON.stringify(circuit)));
    url.search = params.toString();
    window.history.replaceState({}, '', url.toString());

    initFlowbite();
    let hoverInfo = new HoverInfo();
    hoverInfo.generateInfo();
}

/**
 * Updates the measurement probes in the circuit area.
 */
function updateMeasurementProbes(){
    for (let probe of currentMeasurementProbeValues) {
        let r = probe.row;
        let c = probe.col;
        let val = probe.value;

        let parent = document.getElementById(`M-${r}-${c}`);

        parent.innerHTML = '' 
        parent.appendChild(drawMeasurementInCircuit(val));
    }
}

/**
 * Creates a message to display when the device is in portrait mode
 */
function createPortraitError() {
    // Create the div element
    var div = document.createElement("div");
    div.classList.add("flex", "items-center", "justify-center", "h-screen", "flex-col", "text-center", "p-5");

    // Create the svg element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("class", "bi bi-exclamation-circle");
    svg.setAttribute("viewBox", "0 0 16 16");

    // Create the path elements
    var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16");
    var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z");

    // Append the path elements to the svg element
    svg.appendChild(path1);
    svg.appendChild(path2);

    var span = document.createElement("span");
    span.classList.add("py-3");
    span.textContent = "Portrait mode is not supported. Please rotate your device to landscape mode. Mobile devices are not compatible, even in landscape mode.";

    // Append the svg and span elements to the div element
    div.appendChild(span);
    div.appendChild(svg);

    // Create 'cancel' button
    var button = document.createElement("a");
    button.classList.add("bg-indigo-600", "text-white", "rounded-md", "px-3", "py-1", "mt-3");
    button.textContent = "Back to Dashboard";
    button.href = "/dashboard"

    // Append the button element to the div element
    div.appendChild(button);

    // Append the div element to the body
    document.body.innerHTML = div.outerHTML;
}


// Call the function to create gates when the page loads
window.addEventListener('load', main);
function main() {
    // Check if the device is in portrait mode
    var isPortrait = window.matchMedia("(orientation: portrait)").matches;

    if (isPortrait) {
        // If the device is in portrait mode or is a mobile device, display a message
        createPortraitError();
    } else {
        var url = new URL(window.location.href);
        var load = url.searchParams.get("load");
        var tutorial = url.searchParams.get("tutorial");

        // Initiate the circuit and graphing
        circuit = new Circuit(currentQubits);
        graphing = new Grapher();

        // Initiate the circuit area and side bar
        createSideBar();
        createArea();
        initFlowbite();

        // Create hover info
        let hoverInfo = new HoverInfo();
        hoverInfo.generateInfo();

        if (tutorial) {
            // Create the tutorial
            startTutorial();
        } else if (load) {
            var jsonData = JSON.parse(decodeURIComponent(load));
            var jsonString = JSON.stringify(jsonData);
            var blob = new Blob([jsonString], { type: "application/json" });
            importCircuit(null, blob);
        }
    }

    // Circuit name character limit and listener
    var maxLength = 50; 
    var circuitNameElement = document.getElementById('circuit-name-nav');
    circuitNameElement.addEventListener('input', function() {
        if (circuitNameElement.textContent.length > maxLength) {
            circuitNameElement.textContent = circuitNameElement.textContent.slice(0, maxLength);
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(circuitNameElement.childNodes[0], maxLength);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        circuit.setTitle(circuitNameElement.textContent);
    });

    // Prevent user from adding linebreak to circuit title
    circuitNameElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            circuitNameElement.blur();
        }
    });
}

window.addEventListener("orientationchange", function() {
    location.reload();
});

window.exportCircuit = exportCircuit;
window.setExportForm = setExportForm;
window.importCircuit = importCircuit;
window.setImportForm = setImportForm;
window.saveCircuit = saveCircuit;
window.setSaveForm = setSaveForm;
window.loadCircuit = loadCircuit;
window.setLoadForm = setLoadForm;
window.clearCircuit = function() {
    circuit.clear();
    updateArea();
};
