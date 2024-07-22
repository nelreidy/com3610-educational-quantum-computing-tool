/*
    File: graphs.mjs
    Author: Lea Button
    Date: 03-2024
*/

"use strict";

import ApexCharts from 'apexcharts';
import { measureToggle } from './circuit_area.mjs';


/**
 * Grapher class
 * 
 * This class is responsible for generating the graph that displays the probabilities of each state in the circuit.
 * 
 * @class
 * @property {Array<number>} probabilities - The probabilities of each state in the circuit
 * @property {HTMLElement} mainArea - The div element that will contain the graph
 * @property {ApexCharts} mainChart - The ApexCharts object that will be used to generate the graph
 * @property {Object} options - The options object that will be used to generate the graph
 */
export class Grapher {
    constructor() {
        this.probabilities = [];
        this.mainArea = null;
        this.mainChart = null;

        this.options = {
            chart: {
                type: "bar",
                height: "80%",
                fontFamily: "Inter, sans-serif",
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "70%",
                    borderRadiusApplication: "end",
                    borderRadius: 0,
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                style: {
                    fontFamily: "Inter, sans-serif",
                },
                min: 0,
                max: 1,
                stepSize: 0.1,
                y: {
                    formatter: function(value) {
                        return value;
                    }
                }
            },
            states: {
                hover: {
                    filter: {
                        type: "darken",
                        value: 1,
                    }
                }
            },
            stroke: {
                show: true,
                width: 0,
                colors: ["transparent"],
            },
            grid: {
                show: true,
                strokeDashArray: 4,
                padding: {
                    left: 2,
                    right: 2,
                    top: -14
                },
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            series: [{
                name: 'Probability',
                color: "#4f46e5",
                data: [{'x': "0", 'y': 0}]  
                // data: []
            }],
            xaxis: {
                floating: false,
                labels: {
                    show: true,
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                    }
                },
                axisBorder: {
                    show: true,
                },
                axisTicks: {
                    show: true,
                },
                title: {
                    text: "State",
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                    }
                }
            },
            yaxis: {
                show: true,
                labels: {
                    formatter: function (value) {
                        return value.toFixed(2); 
                    }
                },
                title: {
                    text: "Probability",
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                    }
                }
            },
            fill: {
                opacity: 1,
            }
        };

        this.initAreas();
    }

    /**
     * Initialize the areas for the graph
     */
    initAreas() {
        this.mainArea = document.getElementById("column-chart");

        this.mainChart = new ApexCharts(this.mainArea, this.options);

        this.mainChart.render();
    }

    /**
     * Update the graph with new probabilities
     * 
     * @param {Array<number>} probabilities - The probabilities to update the graph with
     */
    update(probabilities) {
        this.probabilities = probabilities;

        let labels = this.generateLabels();
        let data = [];

        for (let i = 0; i < labels.length; i++) {
            data.push({ x: labels[i], y: this.probabilities[i] });
        }

        this.mainChart.updateSeries([{
            name: 'Probability',
            data: data
        }]);

    }

    /**
     * Generate the labels for the graph, given the number of toggled qubits in the circuit
     * 
     * @returns {Array<string>} The labels for the graph
     */
    generateLabels() {
        let labels = [];
        let numQubits = measureToggle.reduce((count, item) => count + (item.toggle === 1 ? 1 : 0), 0);
        if (numQubits === 0) {
            return [];
        }

        for (let i = 0; i < Math.pow(2, numQubits); i++) {
            labels.push(i.toString(2).padStart(numQubits, '0'));
        }
        return labels;
    }
}