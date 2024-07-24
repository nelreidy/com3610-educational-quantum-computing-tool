/*
    File: load_save.mjs
    Author: Lea Button
    Date: 04-2024
*/

"use strict";

import { circuit } from './circuit_area.mjs';
import { createModalAlert } from './import_export.mjs';
import { fetchCircuits } from './ajax_tables.mjs';

/**
 * Function to save the current circuit to the current user's account
 * 
 * @param {*} event - The event that triggered the save
 */
export async function saveCircuit(event) {
    event.preventDefault();

    var title = document.getElementById('save-circuit-name').value;
    var desc = document.getElementById('save-circuit-desc').value;

    circuit.setTitle(title);
    circuit.setDescription(desc);

    var cirucitJson = JSON.stringify(circuit);

    let urlParams = new URLSearchParams(window.location.search);
    let file_id = urlParams.get('file_id');

    const postData = JSON.stringify({
        title: title,
        description: desc,
        circuitData: cirucitJson,
        file_id: file_id
    });

    const response = await fetch(`/save_circuit/?title=${title}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: postData
    });

    const result = await response.json();
    if (response.ok) {
        let url = new URL(window.location.href);
        url.searchParams.set('file_id', result.file_id);
        history.pushState({}, '', url.toString());
    }
    createModalAlert(result.message, response.ok ? 1 : 0);
};

/**
 * Function to set the save form with the current circuit's title and description
 */
export function setSaveForm() {
    document.getElementById('save-circuit-name').value = circuit.title;
    document.getElementById('save-circuit-desc').value = circuit.description;
};

export function loadCircuit(event, file) {

};

/**
 * Function to set the load form with the current user's saved circuits
 */
export function setLoadForm() {
    fetchCircuits(1);
};