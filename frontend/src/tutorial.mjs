/*
    File: tutorial.mjs
    Author: Lea Button
    Date: 04-2024
*/

'use strict';

let tutorialSteps = [
    {element: "#gate-selector", text: "(1/6) This is where you can select a component to drag and drop onto the circuit.", pos: 1},
    {element: "#info-area", text: "(2/6) By default, this area displays the current circuit's description, which can be edited by clicking on the text. When hovering over a component, either on the circuit, or in the components area, the information area will display details of that component.", pos: 1},
    {element: "#circuit-wrapper", text: "(3/6) This is the main circuit composition area, comprised of 3 main sections.", pos: 0},
    {element: "#qubit-labels", text: "(4/6) This section shows the labels for each qubit in the circuit. The button(s) at the bottom of the area allow for the addition or removal of qubits.", pos: 1},
    {element: "#circuit-lines", text: "(5/6) This area is the circuit itself, where components can be dropped on, or dragged off of.", pos: 0},
    {element: "#qubit-buttons", text: "(6/6) These are toggles for each qubit, indicating if the qubit should be measured or not.", pos: 0},
];

/**
 * Starts the tutorial by displaying the first step and adding an event listener to move to the next step.
 * Disables scrolling while the tutorial is active.
 */
export function startTutorial() {
    document.body.style.overflow = 'hidden';
    let currentStep = 0;

    // Scroll #sim-container into view, centered
    document.querySelector('#sim-container').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    });

    let overlay = document.getElementById('tutorial-overlay');
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const existingTextContainer = document.getElementById('tutorial-text');
    existingTextContainer?.remove();

    const textContainer = document.createElement('div');
    textContainer.id = 'tutorial-text';
    textContainer.classList.add('absolute', 'z-60', 'block', 'text-white', 'p-4', 'rounded', 'bg-indigo-700', 'm-1', 'w-1/2');

    const title = document.createElement('h2');
    title.classList.add('text-2xl', 'font-semibold', 'mb-2');
    title.textContent = "Welcome to the Quantum Circuit Builder tutorial!";
    textContainer.appendChild(title);

    const text = document.createElement('p');
    text.classList.add('text-lg', 'font-normal', 'mb-4');
    text.textContent = "This tutorial will guide you through the main features of the Quantum Circuit Composer. Click anywhere to continue.";
    textContainer.appendChild(text);
    overlay.appendChild(textContainer);

    overlay.addEventListener('click', () => {
        overlay.style.display = 'block';
        overlay.classList.remove('bg-black', 'bg-opacity-50');
        if (currentStep < tutorialSteps.length) {
            showStep(currentStep);
            currentStep++;
        } else {
            endTutorial();
        }
    });
}

/**
 * Creates an overlay to highlight the given element, and displays the given text.
 * 
 * @param {*} stepIndex - the index of the step to show
 */
function showStep(stepIndex) {
    const step = tutorialSteps[stepIndex];
    const element = document.querySelector(step.element);

    if (!element) return;

    const overlay = document.getElementById('tutorial-overlay');
    overlay.style.display = 'block';

    createOverlayHole(element);
    manageTutorialText(element, step.text, overlay, step.pos);
}

/**
 * Creates an overlay by creating 4 divs around the given element.
 * 
 * @param {*} element - the element to highlight
 */
function createOverlayHole(element) {
    const overlay = document.getElementById('tutorial-overlay');
    overlay.innerHTML = '';
    overlay.style.display = 'block';

    const rect = element.getBoundingClientRect();
    const padding = 10; 

    const topHeight = rect.top - padding;
    const bottomHeight = window.innerHeight - rect.bottom - padding;
    const leftWidth = rect.left - padding;
    const rightWidth = window.innerWidth - rect.right - padding;

    createOverlayPart(overlay, 'top', topHeight, window.innerWidth, 0);
    createOverlayPart(overlay, 'bottom', bottomHeight, window.innerWidth, window.innerHeight - bottomHeight);
    createOverlayPart(overlay, 'left', window.innerHeight - topHeight - bottomHeight, leftWidth, topHeight);
    createOverlayPart(overlay, 'right', window.innerHeight - topHeight - bottomHeight, rightWidth, topHeight, leftWidth + rect.width + padding * 2);

    /**
     * Creates a div for a part of the overlay.
     * 
     * @param {*} parent - the parent element to append the overlay part to
     * @param {*} id - the id of the overlay part
     * @param {*} height - the height of the overlay part
     * @param {*} width - the width of the overlay part
     * @param {*} top - the top position of the overlay part
     * @param {*} left - the left position of the overlay part
     */
    function createOverlayPart(parent, id, height, width, top, left = 0) {
        const part = document.createElement('div');
        part.id = `overlay-${id}`;
        part.classList.add('absolute', 'bg-black', 'bg-opacity-50');
        part.style.height = `${height}px`;
        part.style.width = `${width}px`;
        part.style.top = `${top}px`;
        part.style.left = `${left}px`;
        parent.appendChild(part);
    }
}

/**
 * Creates a text container to display the given text, and positions it relative to the given element.
 * 
 * @param {*} element - the element to highlight
 * @param {*} text - the text to display
 * @param {*} overlay - the overlay element
 * @param {*} pos - the position of the text relative to the element (0 = left, 1 = right)
 */
function manageTutorialText(element, text, overlay, pos) {
    const existingTextContainer = document.getElementById('tutorial-text');
    existingTextContainer?.remove();

    const textContainer = document.createElement('div');
    textContainer.id = 'tutorial-text';
    textContainer.classList.add('absolute', 'z-60', 'block', 'text-white', 'p-4', 'rounded', 'bg-indigo-700', 'm-1');
    if (element.id === 'circuit-wrapper' || element.id === 'circuit-lines') textContainer.classList.add('w-48');
    else textContainer.classList.add('w-96');
    
    if (pos === 0) textContainer.classList.add('text-right');
    textContainer.textContent = text;
    overlay.appendChild(textContainer);

    const padding = 10;
    const rect = element.getBoundingClientRect();

    const verticalCenter = rect.top + rect.height / 2 - textContainer.offsetHeight / 2;

    if (pos === 0) { 
        textContainer.style.top = `${verticalCenter}px`;
        textContainer.style.right = `${window.innerWidth - rect.left + padding}px`;
    } else if (pos === 1) { 
        textContainer.style.top = `${verticalCenter}px`;
        textContainer.style.left = `${window.scrollX + rect.right + padding}px`;
    }
}

/**
 * Ends the tutorial by removing the overlay and re-enabling scrolling once a final click is detected.
 */
function endTutorial() {
    let overlay = document.getElementById('tutorial-overlay');
    overlay.classList.add('bg-black', 'bg-opacity-50');
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const existingTextContainer = document.getElementById('tutorial-text');
    existingTextContainer?.remove();

    const textContainer = document.createElement('div');
    textContainer.id = 'tutorial-text';
    textContainer.classList.add('absolute', 'z-60', 'block', 'text-white', 'p-4', 'rounded', 'bg-indigo-700', 'm-1', 'w-1/2');

    const title = document.createElement('h2');
    title.classList.add('text-2xl', 'font-semibold', 'mb-2');
    title.textContent = "Tutorial completed!";
    textContainer.appendChild(title);

    const text = document.createElement('p');
    text.classList.add('text-lg', 'font-normal', 'mb-4');
    text.textContent = "You have completed the Quantum Circuit Builder tutorial. Click anywhere to close the tutorial.";
    textContainer.appendChild(text);
    overlay.appendChild(textContainer);


    overlay.addEventListener('click', () => {
        document.body.style.overflow = '';
        overlay.style.display = 'none';

        let searchParams = new URLSearchParams(window.location.search);
        searchParams.delete("tutorial");
        window.history.replaceState(null, null, "?" + searchParams.toString());
    });
}
