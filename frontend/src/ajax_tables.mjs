/*
    File: ajax_tables.mjs
    Author: Lea Button
    Date: 04-2024
*/

"use strict";

import { initFlowbite } from "flowbite";

/**
 * Calls the fetchCircuits function if the #circuit-table element exists
 */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('circuit-table')){
        fetchCircuits(1);
    } 
});

/**
 * Fetches the circuit table and updates the #circuit-table element with the new content
 * 
 * @param {*} page - The page number to fetch
 */
export function fetchCircuits(page) {
    const url = `/circuit_table/?page=${page}`;
    fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(response => response.text())  
        .then(html => {
            document.getElementById('circuit-table').innerHTML = html;
            updateEventListeners();
            initFlowbite();
        })
        .catch(error => console.error('Error loading the circuits:', error));
}

/**
 * Updates the pagination links with event listeners
 */
function updateEventListeners() {
    document.querySelectorAll('#pagination a').forEach(a => {
        a.addEventListener('click', function(event) {
            event.preventDefault();
            const page = this.getAttribute('href').split('page=')[1];
            fetchCircuits(page);
        });
    });
}