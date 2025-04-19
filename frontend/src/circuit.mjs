/*
    File: gate.mjs
    Author: Lea Button
    Date: 03-2024
*/

"use strict";

import { MAX_QUBITS, MIN_QUBITS, squareGates, nodeGates } from './circuit_area.mjs';

/**
 * Circuit class
 * 
 * This class is responsible for creating and managing the quantum circuit.
 * 
 * @class
 * @property {number} qubits - The number of qubits in the circuit
 * @property {Array} gates - A 2D array representing the gates in the circuit
 */
export class Circuit{
    constructor(qubits){
        this.qubits = qubits;
        this.gates = [];
        this.title = "Circuit Name";
        this.description = "Circuit Description";

        this.init();
    }

    /**
     * Initializes the circuit with the current number of qubits.
     */
    init(){
        for (let i = 0; i < this.qubits; i++) {
            this.gates.push([0]);
        }
    }

    /**
     * Adds a qubit row to the circuit.
     */
    addQubitRow(){
        if (this.qubits < MAX_QUBITS) {
            this.qubits++;
            this.gates.push([0]);
            this.normalizeEmptySpace();
            this.extendBarriers();
        }
    }

    /**
     * Extends the barriers in the circuit to the full height of the circuit.
     * This function is called when a new qubit row is added to the circuit
     * and ensures that the barriers are extended to the full height of the circuit.
     */
    extendBarriers() {
        for (let col = 0; col < this.gates[0].length; col++) {
            let barrier = false;
            for (let row = 0; row < this.gates.length; row++) {
                if (this.gates[row][col] == 'b') {
                    barrier = true;
                }
            }

            if (barrier) {
                for (let row = 0; row < this.qubits; row++) {
                    if (this.gates[row][col] == 0) {
                        this.gates[row][col] = 'b';
                    }
                }
            }
        }
    }

    /**
     * Removes a qubit row from the circuit.
     */
    removeQubitRow(){
        if (this.qubits > MIN_QUBITS) {
            this.qubits--;
            this.gates.pop();
            this.validateCircuit();
        }
    }


    /**
     * Adds a gate to the circuit at the specified row and column.
     * 
     * @param {*} gate - The gate to add to the circuit
     * @param {*} row - The row to add the gate to
     * @param {*} col - The column to add the gate to
     * @param {*} letter - The letter of the gate to add
     */
    addGate(row, col, letter){
        // Barriers are a special case, as they extend to the full height of the circuit
        if (letter == 'b') { 
            this.insertBarrier(col);
            return;
        }

        if (this.gates[row][col] != 0) { // IF OCCUPIED
            // for every row, slice at the column, add a 0 to the start of the slice, and push the slice back
            for (let i = 0; i < this.qubits; i++) {
                let slice = this.gates[i].splice(col);
                slice.unshift(0);
                this.gates[i] = this.gates[i].concat(slice);
            }
        }

        this.insertGateAtEmpty(row, col, letter);
        this.normalizeEmptySpace();
        this.validateCircuit();
        // this.print();
    }

    /**
     * Inserts a gate at the specified row and column in the circuit, given that the location is empty.
     * 
     * @param {*} row - The row to insert the gate at
     * @param {*} col - The column to insert the gate at
     * @param {*} letter - The letter of the gate to insert
     */
    insertGateAtEmpty(row, col, letter) {
        this.gates[row][col] = letter;
            
        // if we are inserting a gate at the end of the row, add an extra empty space to the end of the row if there is not already one
        if (this.gates[row][this.gates[row].length - 1] != 0) {
            this.gates[row].push(0);
        }
    }

    /**
     * Inserts a barrier at the specified column in the circuit.
     * 
     * @param {*} col - The column to insert the barrier at
     */
    insertBarrier(col) {
        for (let i = 0; i < this.qubits; i++) {
            this.gates[i].splice(col, 0, 'b');
        }
    }

    /**
     * Normalizes the empty space in the circuit by ensuring that each row is the same length and has an empty space at the end.
     * If any column is all 0s, the column is removed.
     */
    normalizeEmptySpace() {
        // if any column is all 0s, remove the column
        for (let col = 0; col < this.gates[0].length; col++) {
            let allZero = true;
            for (let row = 0; row < this.gates.length; row++) {
                if (this.gates[row][col] != 0) {
                    allZero = false;
                    break;
                }
            }

            if (allZero) {
                for (let row = 0; row < this.gates.length; row++) {
                    this.gates[row].splice(col, 1);
                }
                col--;
            }
        }

        // find the length of the longest row
        let maxLength = Math.max(...this.gates.map(row => row.length)) + 1;
    
        for (let i = 0; i < this.gates.length; i++) {
            // append 0s to the end of the row until it's the same length as the longest row
            while (this.gates[i].length < maxLength) {
                this.gates[i].push(0);
            }
        }
    }

    /**
     * Validates the circuit by ensuring that there are exactly two swap nodes in each column.
     * If there are more or less than two swap nodes, an 'E' (error) is appended to the start of each swap node.
     */
    validateCircuit() {
        for (let col = 0; col < this.gates[0].length; col++) {
            let swapNodes = [];
            for (let row = 0; row < this.gates.length; row++) {
                if (typeof this.gates[row][col] === 'string' && this.gates[row][col].includes('sw')) {
                    swapNodes.push(row);
                }
            }

            if (swapNodes.length == 2) {
                for (let i = 0; i < swapNodes.length; i++) {
                    this.gates[swapNodes[i]][col] = 'sw';
                }
            } else {
                for (let i = 0; i < swapNodes.length; i++) {
                    this.gates[swapNodes[i]][col] = 'Esw';
                }
            }
        }
    }

    /**
     * Returns an array of valid drop areas for the gate.
     * 
     * @returns {Array} - An array of valid drop areas for the gate [[row, col], [row, col], ...]
     */
    getAllDropAreas() {
        let allLocations = [];
    
        for (let row = 0; row < this.gates.length; row++) {
            for (let col = 0; col < this.gates[row].length; col++) {
                allLocations.push([row, col]);
            }
        }
    
        return allLocations;
    }

    /**
     * Returns an array of vertical connections in the circuit. (i.e. conections between control nodes and gates)
     * 
     * @returns {Array} - An array of connectors [[top, col, bot], [top, col, bot], ...]
     */
    getAllConnectors() {
        let connectors = [];

        // iterate over each column
        for (let col = 0; col < this.gates[0].length; col++) {
            let top = -1;
            let bot = -1;
            let nonSquareGateInColumn = false;
            let squareGateInColumn = false;
            let swapNum = 0;
            let topSwitch = -1;
            let botSwitch = -1;

            // iterate over each row in the column
            for (let row = 0; row < this.gates.length; row++) {
                if (this.gates[row][col] !== 0) {
                    // update the first and last non-zero indices
                    if (top === -1) top = row;
                    bot = row;

                    // check if the gate is non-square
                    if (nodeGates.includes(this.gates[row][col])) {
                        nonSquareGateInColumn = true;
                    }

                    // check if the gate is square
                    if (squareGates.includes(this.gates[row][col]) || this.gates[row][col] === 'sw' || this.gates[row][col] === 'Esw') {
                        squareGateInColumn = true;
                    }

                    // check if the gate is a swap node
                    if ( this.gates[row][col] === 'sw' || this.gates[row][col] === 'Esw') {  
                        swapNum++;
                        if (swapNum == 1) topSwitch = row;
                        if (swapNum == 2) botSwitch = row;
                    }
                }
            }

            // if there is more than one non-zero element and a non-square gate in the column
            if (top !== bot && nonSquareGateInColumn && squareGateInColumn) {
                connectors.push([top, col, bot]);
            }

            // if there is exactly two swap nodes in the column
            if (swapNum == 2) {
                if (!nonSquareGateInColumn) {
                    connectors.push([topSwitch, col, botSwitch]);
                } else {
                    connectors.push([top, col, bot]);
                }
            }
        }
        return connectors;
    }

    /**
     * Removes a gate from the circuit at the specified row and column.
     * 
     * @param {*} row - The row to remove the gate from.
     * @param {*} col - The column to remove the gate from.
     */
    removeGate(row, col){
        if (this.gates[row][col] == 'b') {
            for (let i = 0; i < this.qubits; i++) {
                this.gates[i].splice(col, 1);
            }
            return;
        } else {
           this.gates[row][col] = 0; 
        }
        this.validateCircuit();
        this.normalizeEmptySpace();
    }

    /**
     * Clears the circuit, and retains the current number of qubits.
     */
    clear(){
        for (let i = 0; i < this.qubits; i++) {
            this.gates[i] = [0];
        }
        this.title = "Circuit Name";
        this.description = "Circuit Description";
    }

    /**
     * Sets the title of the circuit.
     */
    setTitle(title){
        this.title = title;
    }

    /**
     * Sets the description of the circuit.
     */
    setDescription(description){
        this.description = description;
    }

    /**
     * Prints the circuit to the console. (DEBUG ONLY)
     */
    print() {
        var str = '';
        for (let i = 0; i < this.gates.length; i++) {
            str += 'qubit ' + i + ': ';
            for (let j = 0; j < this.gates[i].length; j++) {
                str += this.gates[i][j] + ' ';
            }
            str += '\n';
        }
        console.log(str);
    }



}

export async function getCircuit(name) {
    const encodedName = encodeURIComponent(name);
    const url = `/api/get-circuit/?name=${encodedName}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("mydaya");
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch circuit:", error);
        return null;
    }
}
