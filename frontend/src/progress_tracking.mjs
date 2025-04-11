"use strict";

const lesson_plan = [
    {
      title: "Intro to QC",
      description: "An introduction to classical computing, qubits, and foundational quantum concepts.",
      sections: [
        "Classical Computing refresher",
        "Brief history",
        "What is a Qubit?",
        "Superposition",
        "Entanglement",
      ],
      url: "/introduction-to-quantum-computing",
      knowledge_test: [3, 8 , 14, 17]
    },
    {
      title: "Fundamentals of QC",
      description: "Covers gate-level operations and qubit manipulation.",
      sections: [
        "Classical Computing gates refresher",
        "Single Qubit gates",
        "Two Qubit gates",
      ],
      url : "/fundamentals-of-quantum-computing",
      knowledge_test: [7,10]
    },
    {
      title: "Quantum Circuits",
      description: "Focuses on how to connect quantum gates in circuits.",
      sections: [
        "Connecting gates in series",
        "Connecting gates in parallel",
        "Common Circuits and their purpose",
      ],
      url: "/quantum-circuits",
      knowledge_test: [3,6]
    },
    {
      title: "Some Quantum Principles / Phenomena",
      description: "Important quantum effects and phenomena with practical implications.",
      sections: [
        "No-cloning theorem",
        "Quantum Teleportation",
        "Quantum Tunneling",
        "Bell’s Theorem and Non-locality",
      ],
      url: "/quantum-phenomena",
      knowledge_test: [3,6]
    },
    {
      title: "Quantum Noise and Error Correction",
      description: "Introduces sources of quantum error and methods of correction.",
      sections: [
        "Introduction to Quantum Noise",
        "Quantum Noise",
        "Quantum Decoherence",
        "Error Correction",
        "Fault Tolerance in QC",
      ],
      url: "/error-correction",
      knowledge_test: [3,6]
    },
    {
      title: "Running Quantum Programs",
      description: "How to simulate and run quantum circuits using real hardware.",
      sections: [
        "Simulation VS Quantum Hardware",
        "What is Qiskit?",
        "Circuit Tutorial in Qiskit",
        "Executing on Real Quantum Devices",
      ],
      url: "/running-quantum-programs",
      knowledge_test: [4]
    },
    {
      title: "Algorithms",
      description: "An overview of key quantum algorithms that demonstrate quantum advantage.",
      sections: [
        "Introduction",
        "Grover’s",
        "Shor’s",

      ],
      url: "/quantum-algorithms",
      knowledge_test: [7]
    }
  ];
  

window.addEventListener("load", main);

function main() {
  console.log("entered");
  const container = document.getElementById("lesson-progress");
  if (!container) return;

  console.log("Lesson progress tracking loaded.");

  lesson_plan.forEach((lesson, idx) => {
    // Lesson title
    const titleEl = document.createElement("p");
    titleEl.className = "font-semibold mt-8";
    titleEl.textContent = `${idx + 1}. ${lesson.title}`;
    container.appendChild(titleEl);

    // Horizontal timeline
    const timeline = document.createElement("div");
    timeline.className = "w-full flex justify-between items-center py-6 px-2 relative";

    lesson.sections.forEach((section, sectionIdx) => {
      const step = document.createElement("div");
      step.className = "flex flex-col items-center text-center flex-1 relative";

      const circle = document.createElement("div");
      circle.className = `w-6 h-6 rounded-full ${sectionIdx === 0 ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'} border-2 z-10`;

      const label = document.createElement("p");
      label.className = `mt-2 text-xs truncate max-w-[100px] ${sectionIdx === 0 ? 'text-indigo-600' : 'text-gray-700'}`;
      label.textContent = section;

      // Line connector
    //   if (sectionIdx < lesson.sections.length - 1) {
    const line = document.createElement("div");
    line.className = `absolute top-3 right-0 w-full h-0.5 ${sectionIdx === 0 ? 'bg-indigo-600' : 'bg-gray-300'} z-0`;
    step.appendChild(line);
    //   }

      step.appendChild(circle);
      step.appendChild(label);
      timeline.appendChild(step);
      
    });

    container.appendChild(timeline);

    // Knowledge test section
    const scoreWrapper = document.createElement("div");
    scoreWrapper.className = "mt-6 space-y-2 w-full max-w-md mx-auto";


    lesson.knowledge_test.forEach((testId, i) => {
      const testBox = document.createElement("div");

      const top = document.createElement("div");
      top.className = "flex justify-between items-center mb-1";

      const testTitle = document.createElement("span");
      testTitle.className = "text-sm font-medium text-indigo-700";
      testTitle.textContent = `Test ${i + 1}`;

      const right = document.createElement("div");
      right.className = "flex items-center gap-2";

      const score = document.createElement("span");
      score.className = "text-sm font-medium text-indigo-700";
      score.textContent = "80%"; // Placeholder score

      const retake = document.createElement("a");
      retake.href = `${lesson.url}?section=${testId}`;
      retake.className = "text-sm text-indigo-600 hover:underline hover:text-indigo-800";
      retake.textContent = "Retake";

      right.appendChild(score);
      right.appendChild(retake);
      top.appendChild(testTitle);
      top.appendChild(right);

      const bar = document.createElement("div");
      bar.className = "w-full bg-gray-200 rounded-full h-3";
      const fill = document.createElement("div");
      fill.className = "bg-indigo-600 h-3 rounded-full";
      fill.style.width = "80%";
      bar.appendChild(fill);

      testBox.appendChild(top);
      testBox.appendChild(bar);
      scoreWrapper.appendChild(testBox);
    });

    container.appendChild(scoreWrapper);
  });
}
