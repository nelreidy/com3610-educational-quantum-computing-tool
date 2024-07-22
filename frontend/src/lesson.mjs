/*
    File: lesson.mjs
    Author: Lea Button
    Date: 04-2024
*/

"use strict";

let sections = [];
let currentLessonIndex = 0;

// Questions for the introduction lesson
let questionsIntroduction = [
    {
        section: 6,
        questions: [
            {
                question: "What is a qubit?",
                options: [
                    "A unit of information in quantum computing",
                    "A unit of information in classical computing",
                    "A unit of information in both quantum and classical computing"
                ],
                answer: "A unit of information in quantum computing"
            },
            {
                question: "Which system is deterministic?",
                options: [
                    "Quantum",
                    "Classical",
                    "Both"
                ],
                answer: "Classical"
            }
        ],  
    },
    {
        section: 12,
        questions: [
            {
                question: "What is superposition?",
                options: [
                    "A property of quantum systems that allows them to be in multiple states at once",
                    "A property of classical systems that allows them to be in multiple states at once",
                    "A property of quantum systems that allows them to be in a single state"
                ],
                answer: "A property of quantum systems that allows them to be in multiple states at once"
            },
            {
                question: "When measured, a qubit will collapse into either a 0 or 1 state. True or false?",
                options: [
                    "True",
                    "False"
                ],
                answer: "True"
            }
        ]
    },
    {
        section: 15,
        questions: [
            {
                question: "What is entanglement?",
                options: [
                    "A property of quantum systems where the state of one qubit is dependent on the state of another",
                    "A property of quantum systems where the state of one qubit is independent of the state of another"
                ],  
                answer: "A property of quantum systems where the state of one qubit is dependent on the state of another"
            },
            {
                question: "For n-qubits, how many states can be represented?",
                options: [
                    "2",
                    "2^n",
                    "n"
                ],
                answer: "2^n"
            }
        ]
    }
];

// Questions for the fundamentals lesson
let questionsFundamentals = [
    {
        section: 7,
        questions: [
            {
                question: "What transformation does the Pauli-X gate perform on a qubit state?",
                options: [
                    "A 180 degree rotation around the x-axis",
                    "A 90 degree rotation around the x-axis",
                    "A 180 degree rotation around the z-axis"

                ],
                answer: "A 180 degree rotation around the x-axis"
            },
            {
                question: "What transformation does the Pauli-Y gate perform on a qubit state?",
                options: [
                    "A 90 degree rotation around the y-axis",
                    "A 180 degree rotation around the z-axis",
                    "A 180 degree rotation around the y-axis"
                ],
                answer: "A 180 degree rotation around the y-axis"
            },
            {
                question: "What transformation does the Pauli-Z gate perform on a qubit state?",
                options: [
                    "A 90 degree rotation around the z-axis",
                    "A 180 degree rotation around the z-axis",
                    "A 180 degree rotation around the x-axis"
                ],
                answer: "A 180 degree rotation around the z-axis"
            },
            {
                question: "What transformation does the S gate perform on a qubit state?",
                options: [
                    "A 90 degree rotation around the z-axis",
                    "A 180 degree rotation around the z-axis",
                    "A 45 degree rotation around the z-axis"
                ],
                answer: "A 90 degree rotation around the z-axis"
            },
            {
                question: "What transformation does the T gate perform on a qubit state?",
                options: [
                    "A 90 degree rotation around the z-axis",
                    "A 180 degree rotation around the z-axis",
                    "A 45 degree rotation around the z-axis"
                ],
                answer: "A 45 degree rotation around the z-axis"
            },
            {
                question: "What transformation does the Hadamard gate perform on a qubit state?",
                options: [
                    "A 90 degree rotation around the x-axis",
                    "A 180 degree rotation around the x-axis",
                    "A 180 degree rotation around the z-axis"
                ],
                answer: "A 90 degree rotation around the x-axis"
            }
        ]
    },
    {
        section: 10,
        questions: [
            {
                question: "What does the CNOT gate do?",
                options: [
                    "Applies the Pauli-X gate if the target qubit if the control qubit is in the |1> state",
                    "Applies the Pauli-X gate if the target qubit if the control qubit is in the |0> state",
                    "Applies the Pauli-Y gate if the target qubit if the control qubit is in the |1> state"
                ],
                answer: "Applies the Pauli-X gate if the target qubit if the control qubit is in the |1> state"
            },
            {
                question: "What does the CZ gate do?",
                options: [
                    "Applies the Pauli-Z gate if the target qubit if the control qubit is in the |0> state",
                    "Applies the Pauli-X gate if the target qubit if the control qubit is in the |1> state",
                    "Applies the Pauli-Z gate if the target qubit if the control qubit is in the |1> state",
                ],
                answer: "Applies the Pauli-Z gate if the target qubit if the control qubit is in the |1> state"
            }
        ]
    }
];

// Questions for the circuits lesson
let questionsCircuits = [
    {
        section: 3,
        questions: [
            {
                question: "How are quantum circuits read and executed?",
                options: [
                    "Right to left",
                    "Left to right",
                    "Top to bottom",
                    "Bottom to top",
                ],
                answer: "Left to right"
            },
            {
                question: "What does a horizontal line in a quantum circuit represent?",
                options: [
                    "A divider",
                    "A qubit",
                    "A moment",
                ],
                answer: "A qubit"
            },
            {
                question: "What is the initial state of all qubits in a circuit?",
                options: [
                    "|0⟩",
                    "|1⟩",
                    "|+⟩",
                    "|-⟩",
                    "|i⟩",
                    "|-i⟩",
                ],
                answer: "|0⟩"
            }
        ]
    },
    {
        section: 6,
        questions: [
            {
                question: "How are multiple qubits represented on a quantum circuit diagram?",
                options: [
                    "Parallel lines drawn for each qubit.",
                    "Vertical lines drawn for each qubit."
                ],
                answer: "Parallel lines drawn for each qubit.",
            },
            {
                question: "What is a moment in a circuit?",
                options: [
                    "A set of operations to be executed at the same time.",
                    "A set of operations to be executed one after the other.",
                ],
                answer: "A set of operations to be executed at the same time.",
            }
        ]
    }
];


let currentPage = window.location.pathname; 
let questions;
if (currentPage === '/introduction-to-quantum-computing') {
    questions = questionsIntroduction;
} else if (currentPage === '/fundamentals-of-quantum-computing') {
    questions = questionsFundamentals;
} else {
    questions = questionsCircuits;
}

let currentQuestionIndex = 0;

/**
 * Function to display the next lesson
 */
function next() {
    if (currentLessonIndex < sections.length - 1) {
        currentLessonIndex++;
        displayLesson(currentLessonIndex);
    }
}

/**
 * Function to display the previous lesson
 */
function back() {
    if (currentLessonIndex > 0) {
        currentLessonIndex--;
        displayLesson(currentLessonIndex);
    }
}

/**
 * Function to display a lesson given an index
 * 
 * @param {*} index - The index of the lesson to display
 */
function displayLesson(index) {
    sections.forEach((section, i) => {
        if (i == index) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });

    updateButtons();
    updateUrl(currentLessonIndex);

    currentQuestionIndex = 0;
    loadQuestion(currentLessonIndex);
}

/**
 * Function to update the visibility of the back and next buttons depending on the current lesson index
 */
function updateButtons() {
    let backButton = document.getElementById('back-button');
    let nextButton = document.getElementById('next-button');

    if (currentLessonIndex == 0) {
        backButton.classList.add('hidden');
    } else {
        backButton.classList.remove('hidden');
    }

    if (currentLessonIndex == sections.length - 1) {
        nextButton.classList.add('hidden');
    } else {
        nextButton.classList.remove('hidden');
    }
}

/**
 * Function to update the URL with the current section index
 * 
 * @param {*} sectionIndex - The index of the section to update the URL with
 */
function updateUrl(sectionIndex) {
    var url = new URL(window.location.href);
    url.searchParams.set("section", sectionIndex);
    window.history.pushState({}, '', url);
}

window.addEventListener('load', main);
function main() { 
    document.getElementById('back-button').addEventListener("click", function() {
        back();
    });
    
    document.getElementById('next-button').addEventListener("click", function() {
        next();
    });

    let i = 0;
    let section;

    while ((section = document.getElementById(`section-${i}`)) !== null) {
        sections.push(section);
        i++;
    }

    var url = new URL(window.location.href);
    var sectionParam = url.searchParams.get("section");

    if (sectionParam) {
        currentLessonIndex = parseInt(sectionParam);
    } else {
        currentLessonIndex = 0;
        updateUrl(currentLessonIndex);
    }

    updateButtons();
    displayLesson(currentLessonIndex);
}

/**
 * Function to load the question for the current question index
 * 
 * @param {*} sectionIndex - The index of the section to load the question for
 */
function loadQuestion(sectionIndex) {
    let section = questions.find(section => section.section === sectionIndex);
    if (!section || currentQuestionIndex >= section.questions.length) {
        return;
    }

    let question = section.questions[currentQuestionIndex];
    let questionContainer = document.getElementById(`question-container-${sectionIndex}`);

    questionContainer.innerHTML = `
        <h3 class="mb-2 text-lg font-semibold text-indigo-800">Question ${currentQuestionIndex + 1}</h3>
        <p class="mb-4 text-md font-normal text-gray-500">${question.question}</p>
        <div class="flex flex-col">
            ${question.options.map((option, index) => `
                <label class="flex items-center mb-2">
                    <input type="radio" name="q${currentQuestionIndex}" value="${option}" class="mr-2">
                    <span class="text-md font-normal text-gray-500">${option}</span>
                </label>
            `).join('')}
        </div>
        <button id="submit-button" class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded mt-4">Submit</button>
    `;

    document.getElementById('submit-button').addEventListener('click', function() {
        submitAnswer(sectionIndex);
    });
}

/**
 * Function to submit the answer for the current question and create an alert based on the correctness of the answer
 * 
 * @param {*} sectionIndex - The index of the section to submit the answer for
 */
function submitAnswer(sectionIndex) {
    let section = questions.find(section => section.section === sectionIndex);
    if (!section || currentQuestionIndex >= section.questions.length) {
        return;
    }

    let radios = document.getElementsByName(`q${currentQuestionIndex}`);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            if (radios[i].value === section.questions[currentQuestionIndex].answer) {
                currentQuestionIndex++;
                alert('Correct!');
            } else {
                alert('Incorrect!');
            }

            if (currentQuestionIndex < section.questions.length) {
                loadQuestion(sectionIndex);
            } else {
                quizCompleted(sectionIndex);
            }

            break;
        }
    }
}

/**
 * Function to display a quiz completed message for the current section/quiz
 * 
 * @param {*} sectionIndex - The index of the section to display the quiz completed message for
 */
function quizCompleted(sectionIndex) {
    let questionContainer = document.getElementById(`question-container-${sectionIndex}`);

    questionContainer.innerHTML = `
        <h3 class="mb-2 text-lg font-semibold text-indigo-800">Quiz Completed</h3>
        <p class="mb-2 text-md font-normal text-gray-500">You have completed the quiz for this section.</p>
    `;
}

window.submitAnswer = submitAnswer;