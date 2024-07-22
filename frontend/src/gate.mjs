/*
    File: gate.mjs
    Author: Lea Button
    Date: 03-2024
*/

"use strict";

import { activeAreas, circuit, updateArea, svgGates } from './circuit_area.mjs';
import { constructSquareGate } from './icons.mjs';

/**
 * Gate class
 * 
 * This class is responsible for creating and managing currently dragging gates.
 * 
 * @class
 * @property {number} x - The x coordinate of the gate
 * @property {number} y - The y coordinate of the gate
 * @property {string} letter - The letter of the gate
 * @property {HTMLElement} body - The body of the document
 * @property {string} colour - The colour of the gate
 * @property {HTMLElement} element - The div element that represents the gate
 * @property {HTMLElement} lastArea - The last area the gate was dragged over
 * @property {function} dragListener - The listener for dragging the gate
 * @property {function} dropListener - The listener for dropping the gate
 * 
 */
export class Gate {
    constructor(x, y, letter, body, colour) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.body = body;
        this.colour = colour;

        this.element = this.create();
        this.body.appendChild(this.element);

        this.lastArea = null;

        this.dragListener = (event) => this.drag(event.pageX, event.pageY);
        this.dropListener = () => this.drop();
        window.addEventListener('mousemove', this.dragListener);   
        window.addEventListener('mouseup', this.dropListener);
    }

    /**
     * Creates a div element that represents the gate.
     * 
     * @returns {HTMLElement} - The div element that represents the gate
     */
    create() {
        const gateWrapper = document.createElement('div');
        gateWrapper.classList.add('gate-wrapper', 'z-50');

        gateWrapper.classList.add('w-11', 'h-11');
        // if not an svg gate, create a square gate
        if (!svgGates.find((gate) => gate.letter == this.letter)) {
            const gateBlock = constructSquareGate(this.letter, this.colour);
            gateWrapper.appendChild(gateBlock);
        } else {
            const svg = svgGates.find((gate) => gate.letter == this.letter).svg;
            gateWrapper.appendChild(svg);
        } 

        gateWrapper.style.position = 'absolute';
        gateWrapper.style.left = (this.x - 22) + 'px'; //because w-11 and h-11 in tailwind are 44px :)
        gateWrapper.style.top = (this.y - 22) + 'px';

        gateWrapper.setAttribute('draggable', 'true');

        // add event listeners for dragging and dropping
        gateWrapper.addEventListener('mousemove', (event) => {
            this.drag(event.pageX, event.pageY);
        });

        gateWrapper.addEventListener('mouseup', (event) => {
            this.drop(event.pageX, event.pageY);
        });

        return gateWrapper;
    }

    /**
     * Deletes the gate from the document and removes the event listeners.
     */
    delete() {
        this.element.remove();
        window.removeEventListener('mousemove', this.dragListener);
        window.removeEventListener('mouseup', this.dropListener);
    }

    // TODO: (could) improve snap to grid graphics :)
    /**
     * Drags the gate to the new x and y coordinates; snaps to grid if over an active area.
     * 
     * @param {*} x - The x coordinate of the mouse
     * @param {*} y - The y coordinate of the mouse
     */
    drag(x, y) {
        this.x = x - window.scrollX;
        this.y = y - window.scrollY;

        // detect if the gate is being dragged over any active areas
        let elements = document.elementsFromPoint(this.x, this.y);
        let area = elements.find((element) => activeAreas.includes(element.id));

        this.element.style.left = (x - 22) + 'px';
        this.element.style.top = (y - 22) + 'px';

        if (area) {
            // if the gate is inside an active area, display a version of it snapped to grid
            let areaRect = area.getBoundingClientRect();

            // making a copy to show the gate snapped to grid
            if (!this.translucentCopy) {
                this.translucentCopy = this.element.cloneNode(true);
                this.translucentCopy.style.zIndex = '10';
                this.translucentCopy.style.opacity = '0.5';
                document.body.appendChild(this.translucentCopy);
            }

            // snapping the copy to grid
            this.translucentCopy.style.left = (areaRect.left + window.scrollX + areaRect.width / 2 - 22) + 'px';
            this.translucentCopy.style.top = (areaRect.top + window.scrollY + areaRect.height / 2 - 22) + 'px';

            this.lastArea = area;

        } else {
            // remove the translucent copy if it exists
            if (this.translucentCopy) {
                this.translucentCopy.remove();
                this.translucentCopy = null;
            }

            if (this.lastArea) {
                this.lastArea = null;
            }
        }
    }

    /**
     * Adds the gate to the circuit if it was dropped over an active area, otherwise deletes it.
     */
    drop() {
        if (this.lastArea) {
            let row = parseInt(this.lastArea.id.split('-')[1]);
            let col = parseInt(this.lastArea.id.split('-')[3]);
            circuit.addGate(row, col, this.letter);
            this.translucentCopy.remove();
            updateArea();
        }
        this.delete();
    }
}
