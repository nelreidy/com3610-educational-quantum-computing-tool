/*
    File: talk_to_cirq.mjs
    Author: Lea Button
    Date: 03-2024
*/
"use strict";

export var currentStatus = null;
export var currentStateVector = [];
export var currentMeasurementProbeValues = [];

/**
 * Sends the circuit data to the simulator for simulation, and stores the response in the currentStatus and currentProbabilities variables.
 * 
 * @param {*} circuitData - the data to be sent to the simulator
 * @param {*} toMeasure - the qubits to measure
 */
export async function simulate(circuitData, toMeasure) {
    try {
        const response = await fetch('/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                circuit: circuitData,
                to_measure: toMeasure,
            }),
        });
        const data = await response.json();
        currentStatus = data.status;
        currentStateVector = data.state_vector;
        currentMeasurementProbeValues = data.probed_values;
    } catch (error) {
        currentStatus = 'error';
        console.error('Error:', error);
    }
}
  
