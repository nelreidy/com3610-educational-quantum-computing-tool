/*
    File: icons.mjs
    Author: Lea Button
    Date: 03-2024
*/

"use strict";

import { svgGates } from './circuit_area.mjs';

/**
 * Creates an SVG element representing a measurement toggle.
 * 
 * @returns {SVGElement} - SVG element representing a measurement toggle.
 */
export function createMeasurementSvg() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');

    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '32');
    rect.setAttribute('height', '32');
    rect.setAttribute('fill-opacity', '0');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // Path taken from https://thequantumlaend.de/frontend/designer
    path.setAttribute('d', 'M25.2941 11.584H22.7981L25.2301 8.008V7H21.6141V8H23.9101L21.4861 11.576V12.584H25.2941V11.584ZM15.5662 23.4664C15.5662 24.0836 15.0658 24.584 14.4485 24.584C13.8313 24.584 13.3309 24.0836 13.3309 23.4664C13.3309 22.8621 13.8104 22.3699 14.4096 22.3494L17.1775 17.9208C16.3359 17.5757 15.4144 17.3855 14.4485 17.3855C10.4729 17.3855 7.25 20.6084 7.25 24.584H6C6 19.918 9.78254 16.1355 14.4485 16.1355C15.658 16.1355 16.8081 16.3896 17.8483 16.8474L19.5068 14.1939L20.5668 14.8564L18.9545 17.4361C21.3236 18.9327 22.8971 21.5746 22.8971 24.584H21.6471C21.6471 22.0216 20.3082 19.7719 18.2919 18.4962L15.4698 23.0116C15.5317 23.1505 15.5662 23.3044 15.5662 23.4664Z');
    path.setAttribute('fill', '#000');

    svg.appendChild(rect);
    svg.appendChild(path);
    return svg;
}

/**
 * Creates an SVG element representing a given node.
 * 
 * @param {*} letter - The letter of the node to create.
 * @returns {SVGElement} - SVG element representing the node.
 */
export function constructSvg(letter='') {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 56 56`);

    switch(letter) {
        case 'c':
            svg.appendChild(createDot());
            break;
        case 'ac':
            svg.appendChild(createEmptyDot());
            break;
        case 'sw':
            svg.appendChild(createX());
            break;
        case 'Esw':
            svg.appendChild(createErrorX());
            break;
        case 'b':
            svg.appendChild(createBarrierIcon());
            break;
        case 'X':
            svg.appendChild(createNOT());
            break;
        case 'M':
            svg.appendChild(createMeasurementSvg());
            break;
        default:
            console.error(`Invalid node type: ${letter}`);
            break;
    }

    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
    svg.classList.add('z-10');
    return svg;
}

/**
 * Creates an SVG element representing a control node.
 * 
 * @returns {SVGElement} - SVG element representing a control node.
 */
function createDot() {
    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', '50%');
    dot.setAttribute('fill', 'black');
    dot.setAttribute('r', '4');
    dot.setAttribute('cy', '50%');
    return dot;
}

/**
 * Creates an SVG element representing an anti-control node.
 * 
 * @returns {SVGElement} - SVG element representing an anti-control node.
 */
function createEmptyDot() {
    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', '50%');
    dot.setAttribute('fill', 'white');
    dot.setAttribute('stroke', 'black');
    dot.setAttribute('stroke-width', '1');
    dot.setAttribute('r', '4');
    dot.setAttribute('cy', '50%');
    return dot;
}

/**
 * Creates an SVG element representing a (valid) swap node.
 * 
 * @returns {SVGElement} - SVG element representing a swap node.
 */
function createX() {
    var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('stroke', 'black');
    line1.setAttribute('stroke-width', '1');
    line1.setAttribute('x1', '40%');
    line1.setAttribute('x2', '60%');
    line1.setAttribute('y1', 28 + 5.6);
    line1.setAttribute('y2', 28 - 5.6);

    var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('stroke', 'black');
    line2.setAttribute('stroke-width', '1');
    line2.setAttribute('x1', '60%');
    line2.setAttribute('x2', '40%');
    line2.setAttribute('y1', 28 + 5.6);
    line2.setAttribute('y2', 28 - 5.6);

    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.appendChild(line1);
    group.appendChild(line2);

    return group;
}

/**
 * Creates an SVG element representing an invalid swap node.
 * 
 * @returns {SVGElement} - SVG element representing an invalid swap node.
 */
function createErrorX() {
    var x = createX();
    x.children[0].setAttribute('stroke', 'red');
    x.children[1].setAttribute('stroke', 'red');
    return x;
}

/**
 * Creates an SVG element representing a Pauli-X gate (NOT gate)
 * 
 * @returns {SVGElement} - SVG element representing a Pauli-X gate.
 */
function createNOT() {
    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', '50%');
    dot.setAttribute('fill', 'none');
    dot.setAttribute('stroke', 'black');
    dot.setAttribute('stroke-width', '1');
    dot.setAttribute('r', '13');
    dot.setAttribute('cy', '50%');

    var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('stroke', 'black');
    line1.setAttribute('stroke-width', '1');
    line1.setAttribute('x1', '26%');
    line1.setAttribute('x2', '74%');
    line1.setAttribute('y1', '50%');
    line1.setAttribute('y2', '50%');

    var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('stroke', 'black');
    line2.setAttribute('stroke-width', '1');
    line2.setAttribute('x1', '50%');
    line2.setAttribute('x2', '50%');
    line2.setAttribute('y1', '26%');
    line2.setAttribute('y2', '74%');

    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.appendChild(dot);
    group.appendChild(line1);
    group.appendChild(line2);

    return group;
}

/**
 * Creates an SVG element representing a barrier.
 * 
 * @returns {SVGElement} - SVG element representing a barrier.
 */
function createBarrierIcon() {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttribute('x1', '50%');
    line.setAttribute('y1', '5%');
    line.setAttribute('x2', '50%');
    line.setAttribute('y2', '95%');

    line.setAttribute('stroke', 'grey');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '4,4');

    return line;
}

/**
 * Creates a square container with a coloured border.
 * 
 * @param {*} colour - The colour of the border.
 * @returns {HTMLDivElement} - The constructed square container.
 */
function createSquareContainer(colour) {
    const gate = document.createElement('div');
    gate.classList.add('gate-block', 'w-11', 'h-11', 'flex', 'items-center', 'justify-center', 'text-black');
    gate.style.userSelect = 'none';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '5');
    rect.setAttribute('y', '5');
    rect.setAttribute('width', '90');
    rect.setAttribute('height', '90');
    rect.setAttribute('fill', 'white');
    svg.appendChild(rect);

    const leftBorder = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    leftBorder.setAttribute('x1', '4');
    leftBorder.setAttribute('y1', '4');
    leftBorder.setAttribute('x2', '4');
    leftBorder.setAttribute('y2', '96');
    leftBorder.setAttribute('stroke', colour);
    leftBorder.setAttribute('stroke-width', '10');
    svg.appendChild(leftBorder);

    const borders = ['top', 'right', 'bottom'];
    borders.forEach(border => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        if (border === 'top') {
            line.setAttribute('x1', '5');
            line.setAttribute('y1', '5');
            line.setAttribute('x2', '95');
            line.setAttribute('y2', '5');
        } else if (border === 'right') {
            line.setAttribute('x1', '95');
            line.setAttribute('y1', '5');
            line.setAttribute('x2', '95');
            line.setAttribute('y2', '95');
        } else {
            line.setAttribute('x1', '5');
            line.setAttribute('y1', '95');
            line.setAttribute('x2', '95');
            line.setAttribute('y2', '95');
        }
        line.setAttribute('stroke', colour);
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    });

    gate.appendChild(svg);

    return gate;
}

// TODO: fix left border shorter than square ??
/**
 * Creates a square gate with a letter and a coloured border.
 * 
 * @param {*} letter - The letter to display on the gate.
 * @param {*} colour - The colour of the gate border.
 * @returns {HTMLDivElement} - The constructed square gate.
 */
export function constructSquareGate(letter, colour) {
    const gate = createSquareContainer(colour);
    const svg = gate.querySelector('svg');

    // Gate letter
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '50');
    text.setAttribute('y', '55');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '54');
    text.setAttribute('font-family', 'serif');
    text.textContent = letter;

    svg.appendChild(text);
    gate.appendChild(svg);

    return gate;
}

/**
 * Creates a square gate with an icon and a coloured border.
 * 
 * @param {*} letter - The letter of the gate (used to find the icon in svgGates)
 * @param {*} colour - The colour of the gate border.
 * @returns {HTMLDivElement} - The constructed square gate.
 */
export function createMultiIcon(letter, colour) {
    const gate = createSquareContainer(colour);
    const svg = gate.querySelector('svg');

    // Create the svg of the gate svgGates {name: 'H', svg: createHadamardSvg() ... etc }
    const icon = svgGates.find((gate) => gate.letter == letter).svg.cloneNode(true);
    icon.setAttribute('draggable', 'false');

    svg.appendChild(icon);
    
    return gate;
}

/**
 * Creates a square gate with a letter and a coloured border.
 * 
 * @param {*} letter - The letter to display on the gate.
 * @param {*} colour - The colour of the gate border.
 * @returns {HTMLDivElement} - The constructed square gate.
 */
export function createComponentIcon(letter, colour) {
    // if letter in svgGates, return createMultiIcon
    if (svgGates.find((gate) => gate.letter == letter)) {
        return createMultiIcon(letter, colour);
    } else {
        return constructSquareGate(letter, colour);
    }
}

export function drawMeasurementInCircuit(probability=0){
    const gate = document.createElement('div');
    gate.classList.add('gate-block', 'w-11', 'h-11', 'flex', 'items-center', 'justify-center', 'text-black');
    gate.style.userSelect = 'none';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '5');
    rect.setAttribute('y', '5');
    rect.setAttribute('width', '90');
    rect.setAttribute('height', '90');
    rect.setAttribute('fill', 'white');
    svg.appendChild(rect);

    // fill vertically to represent probability
    var fillHeight = 90 * probability;
    var fill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fill.setAttribute('x', '5');
    fill.setAttribute('y', 95 - fillHeight); 
    fill.setAttribute('width', '90');
    fill.setAttribute('height', fillHeight.toString());
    fill.setAttribute('fill', '#a5b4fc');
    svg.appendChild(fill);

    // add text in center to 2dp of the probability
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '50');
    text.setAttribute('y', '55');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '28');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', 'black');
    text.setAttribute('stroke', 'white');
    text.setAttribute('stroke-width', '1px');
    text.textContent = probability.toFixed(2);
    svg.appendChild(text);

    // outline the square
    var outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    outline.setAttribute('x', '5');
    outline.setAttribute('y', '5');
    outline.setAttribute('width', '90');
    outline.setAttribute('height', '90');
    outline.setAttribute('fill', 'none');
    outline.setAttribute('stroke', 'black');
    svg.appendChild(outline);

    gate.appendChild(svg);
    return gate;
}