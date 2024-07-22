/*
    File: hover_info.mjs
    Author: Lea Button
    Date: 03-2024
*/

"use strict";

import { circuit } from './circuit_area.mjs';

/**
 * HoverInfo class
 * 
 * This class is responsible for generating the hover info for the website. This class will add
 * event listeners to all elements that have a class starting with 'info-for-' and will display
 * the corresponding html file in the info-contents div when the element is hovered over.
 * 
 * @class
 * @property {HTMLElement} infoArea - The div element that will contain the hover info
 * @property {Array<HTMLElement>} targets - An array of all elements that have a class starting with 'info-for-'
 */
export class HoverInfo { 
    constructor() {
        this.infoArea = document.getElementById('info-contents');
        this.targets;
        this.createDescriptionBaseCase();
    }

    /**
     * Generate the hover info for the website. This function will get all elements that have a class
     * starting with 'info-for-' and add event listeners to them to display the corresponding html file
     * when the element is hovered over.
     */
    generateInfo() {
        this.getAllInfoTargets();
        this.addHoverListeners();
    }

    /**
     * Get all elements that have a class starting with 'info-for-' and store them in the targets property.
     */
    getAllInfoTargets() {
        const allElements = document.querySelectorAll('*');
        this.targets = Array.from(allElements).filter(el =>
            Array.from(el.classList).some(cls => cls.startsWith('info-for-'))
        );
    }

    /**
     * Add event listeners to all elements in the targets property. When an element is hovered over, the
     * populateInfo function will be called with the event as an argument.
     */
    addHoverListeners() {
        this.targets.forEach(target => {
            target.addEventListener('mouseenter', (event) => {
                this.populateInfo(event);
            });

            target.addEventListener('mouseleave', (event) => {
                this.createDescriptionBaseCase();
            });
        });
    }

    /**
     * Populate the info-contents div with the corresponding html file for the element that was hovered over.
     * 
     * @param {Event} event - The event that was triggered by the mouseenter event listener
     */
    populateInfo(event) {
        const target = event.target;
        let name;
        for (let i = 0; i < target.classList.length; i++) {
            if (target.classList[i].startsWith('info-for-')) {
                name = target.classList[i].split('-')[2];
                break;
            }
        }

        fetch(`/static/html/${name}.html`)
            .then(response => response.text())
            .then(data => {
                this.infoArea.innerHTML = data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    /**
     * Create the base case for the description. This function will create a div element with the circuit description
     * and add an event listener to the description that will update the circuit description when the text is edited.
     */
    createDescriptionBaseCase() {
        let parent = document.createElement('div');
        parent.classList.add('p-2', 'flex-grow');
        parent.id = 'description-base-case';

        let title = document.createElement('a');
        title.classList.add('block');
        title.textContent = 'Circuit Description';
        parent.appendChild(title);

        let description = document.createElement('a');
        description.classList.add('block', 'text-xs');
        description.textContent = circuit.description;
        description.contentEditable = true;
        description.id = 'description-textarea';

        parent.appendChild(description);
        this.infoArea.innerHTML = parent.outerHTML;

        let descAElem = document.getElementById('description-textarea');
        descAElem.addEventListener('input', function() {
            circuit.setDescription(descAElem.textContent);
        });
    }
}