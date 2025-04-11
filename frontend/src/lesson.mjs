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
        section: 3,
        questions:[
            {
                question: "Who proposed that quantum computers could simulate quantum mechanics more efficiently than classical computers?",
                options: [
                    "Richard Feynman",
                    "David Deutsch",
                    "Peter Shor", 
                ],
                answer: "Richard Feynman"
            }, 
            {
                question: "What type of quantum computer is D-Wave’s system?",
                options: [
                    "Quantum gate computer",
                    "Quantum annealer",
                    "Universal quantum computer",
                ],
                answer: "Quantum annealer"
            }, 
            {
                question: "Which algorithm demonstrated that quantum computers could potentially break modern encryption methods?", 
                options: [
                    "Shor's Algorithm",
                    "Grover's Algorithm",
                    "Feynman's Algorithm"
                ], 
                answer: "Shor's Algorithm"
            }

        ]
    },
    {
        section: 8,
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
        section: 14,
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
        section: 17,
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

let questionsPhenomena = [
    {
        section: 3,
        questions: [
            {
                question: "What does the No-Cloning Theorem state?",
                options: [
                    "Any quantum state can be copied exactly.",
                    "Quantum information can only be copied if we measure it first.",
                    "It is impossible to create an identical copy of an unknown quantum state.",
                    "Classical information cannot be cloned either."
                ],
                answer: "It is impossible to create an identical copy of an unknown quantum state."
            },
            {
                question: "Why is it impossible to copy an arbitrary quantum state?",
                options: [
                    "Quantum states are too small to be copied.",
                    "Measurement collapses a quantum state, altering it.",
                    "Classical computers cannot understand quantum mechanics.",
                    "Quantum states do not carry any real information."
                ],
                answer: "Measurement collapses a quantum state, altering it."
            },
            {
                question: "How does the No-Cloning Theorem contribute to quantum cryptography?",
                options: [
                    "It prevents unauthorized duplication of quantum-encoded messages.",
                    "It allows quantum states to be copied without detection.",
                    "It replaces classical cryptography with faster encryption methods.",
                    "It ensures quantum computers can operate without error."
                ],
                answer: "It prevents unauthorized duplication of quantum-encoded messages."
            },
            {
                question: "What is the purpose of quantum teleportation?",
                options: [
                    "To instantly move a physical object from one place to another.",
                    "To transfer classical information faster than light.",
                    "To transfer a quantum state from one qubit to another.",
                    "To measure a quantum state without collapsing it."
                ],
                answer: "To transfer a quantum state from one qubit to another."
            },
            {
                question: "Which of these is a maximally entangled state?",
                options: [
                    "$$ |00\rangle $$",
                    "$$ \frac{|00\rangle + |01\rangle}{\sqrt{2}} $$",
                    "$$ \frac{|00\rangle + |11\rangle}{\sqrt{2}} $$",
                    "$$ |0\rangle \otimes |1\rangle $$"
                ],
                answer: "$$ \frac{|00\rangle + |11\rangle}{\sqrt{2}} $$"
            },
            {
                question: "Why is classical communication required in quantum teleportation?",
                options: [
                    "To send qubits from Alice to Bob.",
                    "To communicate the measurement results that Bob needs to reconstruct the quantum state.",
                    "To verify that the entanglement still exists.",
                    "To measure Bob’s qubit before Alice’s qubit is destroyed."
                ],
                answer: "To communicate the measurement results that Bob needs to reconstruct the quantum state."
            },
            {
                question: "In quantum teleportation, what happens to the original quantum state?",
                options: [
                    "It is copied exactly at the receiver’s end.",
                    "It remains in superposition.",
                    "It is destroyed when Alice measures it.",
                    "It moves physically to Bob’s location."
                ],
                answer: "It is destroyed when Alice measures it."
            },
            {
                question: "What role does entanglement play in quantum teleportation?",
                options: [
                    "It allows faster-than-light communication.",
                    "It ensures that Bob's qubit has a correlation with Alice’s qubit.",
                    "It stores classical information inside a quantum system.",
                    "It creates multiple copies of the quantum state."
                ],
                answer: "It ensures that Bob's qubit has a correlation with Alice’s qubit."
            },
            {
                question: "In the quantum teleportation process, what does Bob do after receiving Alice’s classical message?",
                options: [
                    "He applies specific quantum gates to reconstruct the original quantum state.",
                    "He discards the entangled qubit since it is no longer needed.",
                    "He measures his qubit immediately to retrieve Alice’s state.",
                    "He applies the Hadamard gate to his qubit to correct the phase."
                ],
                answer: "He applies specific quantum gates to reconstruct the original quantum state."
            },
            {
                question: "What is a key application of quantum teleportation?",
                options: [
                    "Speeding up classical internet speeds.",
                    "Enabling the transmission of physical objects.",
                    "Secure quantum communication in future quantum networks.",
                    "Making quantum measurement errors less significant."
                ],
                answer: "Secure quantum communication in future quantum networks."
            }
        ]
    }, 
    {
    section: 6,
    questions: [
            {
                question: "What is quantum tunneling?",
                options: [
                    "The ability of a particle to pass through a potential barrier it classically shouldn't be able to cross.",
                    "A method of encrypting quantum information.",
                    "The process of measuring an entangled particle's state.",
                    "The ability to teleport a quantum state to another location."
                ],
                answer: "The ability of a particle to pass through a potential barrier it classically shouldn't be able to cross."
            },
            {
                question: "Why does quantum tunneling occur?",
                options: [
                    "Because particles move in straight lines unless observed.",
                    "Due to the uncertainty principle and the wave-like nature of particles.",
                    "Because quantum particles travel faster than light.",
                    "Because of the presence of hidden variables in quantum mechanics."
                ],
                answer: "Due to the uncertainty principle and the wave-like nature of particles."
            },
            {
                question: "What does Bell’s theorem test?",
                options: [
                    "Whether quantum mechanics allows faster-than-light communication.",
                    "The existence of hidden variables that explain quantum correlations.",
                    "Whether classical physics can fully describe quantum entanglement.",
                    "The relationship between relativity and quantum mechanics."
                ],
                answer: "The existence of hidden variables that explain quantum correlations."
            },
            {
                question: "What are Bell inequalities used for?",
                options: [
                    "To describe the probability of tunneling through a barrier.",
                    "To determine whether quantum correlations can be explained by classical local realism.",
                    "To calculate the speed of entanglement propagation.",
                    "To predict the behavior of superconductors."
                ],
                answer: "To determine whether quantum correlations can be explained by classical local realism."
            },
            {
                question: "How does Bell’s theorem relate to locality?",
                options: [
                    "It suggests that quantum mechanics allows instant communication.",
                    "It shows that entangled particles have correlations that cannot be explained by signals traveling at or below the speed of light.",
                    "It proves that locality is completely false in all physical theories.",
                    "It supports the idea that space and time do not exist at the quantum level."
                ],
                answer: "It shows that entangled particles have correlations that cannot be explained by signals traveling at or below the speed of light."
            }, 
            {
                question: "What is one real-world application of Bell’s theorem?",
                options: [
                    "Developing ultra-fast quantum computers.",
                    "Improving the accuracy of classical physics models.",
                    "Enhancing secure communication through quantum cryptography.",
                    "Designing experiments to break the speed of light barrier."
                ],
                answer: "Enhancing secure communication through quantum cryptography."
            }
        ]
    }
];

let questionsErrorCorrection = [
    {
        section: 3,
        questions: [
            {
                question: "What is quantum noise?",
                options: [
                    "The random fluctuations in classical circuits.",
                    "Unwanted interactions between a quantum system and its environment.",
                    "Errors caused by incorrect quantum measurements.",
                    "A type of distortion that occurs only in superconducting qubits.",
                ],
                answer: "Unwanted interactions between a quantum system and its environment."
            },
            {
                question: "Which of the following is a major cause of decoherence?",
                options: [
                    "Applying a Hadamard gate incorrectly.",
                    "Leaving a qubit in a classical state for too long.",
                    "Environmental interactions causing the loss of quantum superposition.",
                    "Using superconducting qubits instead of trapped ions.",
                ],
                answer: "Environmental interactions causing the loss of quantum superposition."
            },
            {
                question: "What happens to a qubit when decoherence occurs?",
                options: [
                    "It remains in a coherent superposition state.",
                    "It transitions from a quantum state to a classical state.",
                    "It gets permanently entangled with another qubit.",
                    "It gains extra computational power.",
                ],
                answer: "It transitions from a quantum state to a classical state."
            },
            {
                question: "Which of the following is NOT a common source of quantum noise?",
                options: [
                    "Thermal noise from the surrounding environment.",
                    "Quantum entanglement between two qubits.",
                    "Measurement noise from imperfect quantum detectors.",
                    "Electromagnetic interference affecting qubits.",
                ],
                answer: "Quantum entanglement between two qubits."
            },
            {
                question: "How does quantum error correction help mitigate noise and decoherence?",
                options: [
                    "By preventing qubits from interacting with their environment.",
                    "By encoding quantum information across multiple qubits to detect and correct errors.",
                    "By increasing the energy of qubits to make them more stable.",
                    "By using classical algorithms to predict quantum errors before they happen.",
                ],
                answer: "By encoding quantum information across multiple qubits to detect and correct errors."
            },
            {
                question: "Which of the following is correct?", 
                options: [
                    "Decoherence is a type of quantum noise.",
                    "Quantum noise is a type of decoherence.",
                    "Superconducting qubits are less susceptible to noise than trapped ions.",
                    "High temperatures reduce the effects of quantum noise.",
                ]
            }
        ]

    }, 
    {
        section : 6,
        questions: [
            {
                question: "What type of errors does quantum error correction address?",
                options: [
                    "Only bit-flip errors",
                    "Only phase-flip errors",
                    "Bit-flip, phase-flip, and combined errors",
                    "Only hardware failures"
                ],
                answer: "Bit-flip, phase-flip, and combined errors"
            },
            {
                question: "How does quantum error correction detect errors without measuring the qubit state?",
                options: [
                    "By using syndrome measurements with ancillary qubits",
                    "By directly measuring the qubit",
                    "By running the quantum circuit multiple times",
                    "By applying a Hadamard gate before every operation"
                ],
                answer: "By using syndrome measurements with ancillary qubits"
            },
            {
                question: "What does the three-qubit bit-flip code protect against?",
                options: [
                    "Phase-flip errors",
                    "Bit-flip errors",
                    "Decoherence",
                    "Noise cancellation"
                ],
                answer: "Bit-flip errors"
            },
            {
                question: "Which quantum error correction code protects against both bit and phase flip errors?",
                options: [
                    "Three-qubit bit-flip code",
                    "Phase-flip code",
                    "Shor code",
                    "Quantum teleportation"
                ],
                answer: "Shor code"
            },
            {

                question: "What is the main goal of fault-tolerant quantum computing?",
                options: [
                    "To reduce computational speed",
                    "To prevent errors from spreading during computation",
                    "To eliminate the need for error correction",
                    "To avoid using quantum gates"
                ],
                answer: "To prevent errors from spreading during computation"
            },
            {
                question: "What is a logical qubit in fault-tolerant quantum computing?",
                options: [
                    "A single, unprotected qubit",
                    "A qubit that does not interact with the environment",
                    "A qubit encoded using multiple physical qubits for error protection",
                    "A qubit that remains in superposition indefinitely"
                ],
                answer: "A qubit encoded using multiple physical qubits for error protection"
            },
            {
                question: "What is the significance of the threshold theorem in quantum fault tolerance?",
                options: [
                    "It states that error rates must be above a certain threshold for quantum computation",
                    "It sets an upper limit on the number of logical qubits in a quantum processor",
                    "It states that if gate errors are below a threshold, arbitrarily long quantum computations can be performed reliably",
                    "It proves that quantum computers are error-free"
                ],
                answer: "It states that if gate errors are below a threshold, arbitrarily long quantum computations can be performed reliably"
            },
            {
                question: "Which technique is commonly used to make quantum gates fault-tolerant?",
                options: [
                    "Magic state distillation",
                    "Classical redundancy",
                    "Quantum annealing",
                    "Superposition amplification"
                ],
                answer: "Magic state distillation"
            },
            {
                question: "Why is fault tolerance challenging in quantum computing?",
                options: [
                    "Quantum computers require perfect vacuum conditions",
                    "It requires encoding each logical qubit into multiple physical qubits",
                    "Quantum circuits are infinitely scalable",
                    "Quantum error correction works only for classical errors"
                ],
                answer: "It requires encoding each logical qubit into multiple physical qubits"
            }
        ]
    }
]

let questionsRunningQuantumPrograms = [
    {
        section: 4,
        questions: [
            {
                question: "Which of the following best describes a qubit in a quantum computer?",
                options: [
                    " A binary switch that can only be in state 0 or 1 at a time.", 
                    " A high-voltage or low-voltage signal used to represent 1 and 0.", 
                    " A unit of quantum information that can be in a superposition of states.",
                    "A memory unit used to store quantum programs."],
                answer: "A unit of quantum information that can be in a superposition of states."
            },{
                question: "How does a superconducting qubit store and manipulate quantum information?", 
                options:[
                    " By exciting electrons in an atom to higher energy levels.",
                    " By trapping photons in a vacuum chamber and encoding data using their polarization.", 
                    " By using an electrical circuit with zero resistance and a Josephson junction to control current flow.", 
                    " By encoding information in the spin of an electron."],
                answer: "By using an electrical circuit with zero resistance and a Josephson junction to control current flow."
                
            }, 
            {
                question: "Which of the following is a common quantum gate used in trapped ion systems?",
                options: [
                    "NAND Gate",
                    "XOR Gate",
                    "CNOT Gate",
                    "Flip-Flop Gate"
                ],
                answer: "CNOT Gate"
            }, 
            {
                question: "Which of the following methods is not used to encode information in photonic qubits?",
                options: [
                    "Magnetic Spin Encoding",
                    "Polarization Encoding",
                    "Phase Encoding",
                    "Path Encoding"
                ],
                answer: "Magnetic Spin Encoding"
            },
            {
                question: "Which of the following is not a key component of a quantum computing system?",
                options: [
                    "Quantum Processing Unit (QPU)",
                    "Classical ALU (Arithmetic Logic Unit)",
                    "Classical Control System",
                    "Cryogenic Systems"
                ],
                answer: "Classical ALU (Arithmetic Logic Unit)"
            },
            {
                question: "which of the following statements is true about the current state of quantum hardware?",
                options: [
                    "Quantum computers are already faster than classical supercomputers in all tasks.",
                    "Quantum computers require quantum RAM (qRAM) for all computations.",
                    "Quantum computers are still experimental and require cloud access for most users.",
                    "IBM’s 433-qubit processor is completely error-free and operates at room temperature."
                ],
                answer: "Quantum computers are still experimental and require cloud access for most users."
            }, 
            {
                question: "Which of the following is not a method used for quantum simulation?",
                options: [
                    "Quantum GPU Processing",
                    "State Vector Simulation",
                    "Tensor Network Simulation",
                    "Density Matrix Simulation"
                ],
                answer: "Quantum GPU Processing"

            }, {
                question: "What is a major limitation of classical quantum simulations?",
                options: [
                    "They cannot simulate superconducting qubits.",
                    "They are limited to 5–10 qubits before performance drops.",
                    "They require storing 2ⁿ complex numbers, making large simulations impractical.",
                    "They cannot simulate entanglement"
                ],
                answer: "They require storing 2ⁿ complex numbers, making large simulations impractical."

            }


        ]
    }
]



let currentPage = window.location.pathname; 
let questions;
if (currentPage === '/introduction-to-quantum-computing') {
    questions = questionsIntroduction;
} else if (currentPage === '/fundamentals-of-quantum-computing') {
    questions = questionsFundamentals;
} else if (currentPage === '/quantum-circuits') {
    questions = questionsCircuits;
} else if (currentPage === '/quantum-phenomena') {
    console.log("Phenomena");
    questions = questionsPhenomena;
}else if (currentPage === '/error-correction') {
    questions = questionsErrorCorrection;
}else if (currentPage === '/running-quantum-programs') {
    questions = questionsRunningQuantumPrograms;
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

    if (window.location.pathname === "introduction-to-quantum-computing" ){
        load_timeline();
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

const timelineData = [
    {
        date: "1982",
        title: "Richard Feynman Proposes Quantum Computing",
        description: "Richard Feynman suggests that quantum computers could efficiently simulate quantum mechanics, which classical computers cannot do effectively."
    },
    {
        date: "1985",
        title: "Universal Quantum Computer Concept",
        description: "David Deutsch proposes the concept of a universal quantum computer, capable of simulating any physical process, laying theoretical groundwork."
    },
    {
        date: "1994",
        title: "Shor's Algorithm for Factoring",
        description: "Peter Shor develops a quantum algorithm for factoring large numbers, showing that quantum computers could break widely-used encryption methods, highlighting their disruptive potential in cryptography. This was the first quantum algorithm to demonstrate a significant speedup over classical methods."
    },
    {
        date: "1996",
        title: "Grover's Search Algorithm",
        description: "Lov Grover develops an algorithm for searching unsorted databases that offers a quadratic speedup over classical methods. This is a quick solution to the computational equivalent of finding a needle in a haystack. "
    },
    {
        date: "1998",
        title: "First Quantum Computer with Two Qubits",
        description: "A team led by IBM and Stanford researchers builds the first two-qubit quantum computer, proving quantum algorithms could work on real hardware and advancing practical quantum computing."
    },
    {
        date: "2000s",
        title: "Development of Quantum Architectures",
        description: "Quantum computing saw the emergence of two major architectures: quantum gate computers and quantum annealers, each suited to different types of computations."
    },
    {
        date: "2011",
        title: "First Commercial Quantum Computer Released",
        description: "D-Wave Systems launched the first commercially available quantum annealer computer, the D-Wave One, featuring 128 qubits. Although limited to specific types of problems, this release marked the start of the quantum computing industry."
    },
    {
        date: "2019",
        title: "Google Claims Quantum Supremacy",
        description: "Google’s Sycamore processor, with 53 qubits, solved a computation in 200 seconds that would take classical supercomputers thousands of years. Although the problem was theoretical, it demonstrated quantum supremacy for the first time."
    },
    {
        date: "2020s",
        title: "Rapid Expansion and Quantum Challenges",
        description: "Quantum computers have since grown in capability, with quantum gate computers now reaching around 70 qubits and quantum annealers exceeding 5,000 qubits. However, challenges like decoherence and error correction continue to present major technical hurdles."
    },
    {
        date: "Future",
        title: "Quantum-Classic Hybrid Models",
        description: "Practical applications of quantum computing will likely emerge through hybrid models that combine quantum and classical systems. These models could enable breakthroughs in cryptography, optimization, and secure quantum communication."
    }
  ];
  
  
  function load_timeline(){
  
    const timelineContainer = document.getElementById("timeline-container");
    console.log(timelineContainer);
  
    timelineData.forEach(item => {

        const timelineItem = document.createElement("div");
        timelineItem.classList.add("timeline-item");
  
        const timelineDate = document.createElement("div");
        timelineDate.classList.add("timeline-date");
        timelineDate.textContent = item.date;
  
        const timelineContent = document.createElement("div");
        timelineContent.classList.add("timeline-content");
  
        const timelineTitle = document.createElement("h3");
        timelineTitle.classList.add("timeline-title");
        timelineTitle.textContent = item.title;
  
        const timelineDescription = document.createElement("p");
        timelineDescription.textContent = item.description;
  

        timelineContent.appendChild(timelineTitle);
        timelineContent.appendChild(timelineDescription);
        timelineItem.appendChild(timelineDate);
        timelineItem.appendChild(timelineContent);
        timelineContainer.appendChild(timelineItem);
    });
  }