"use strict";

export const lesson_plan = [
    {
      title: "Intro to QC",
      description: "An introduction to classical computing, qubits, and foundational quantum concepts.",
      sections: {
        "Classical Computing refresher": 1 ,
        "Brief history": 2,
        "What is a Qubit?": 7,
        "Superposition": 11,
        "Entanglement": 16,
      },
      url: "/introduction-to-quantum-computing",
      knowledge_test: [3, 8 , 14, 17]
    },
    {
      title: "Fundamentals of QC",
      description: "Covers gate-level operations and qubit manipulation.",
      sections: {
        "Classical Computing gates refresher": 2,
        "Single Qubit gates": 6,
        "Two Qubit gates": 9,
      },
      url : "/fundamentals-of-quantum-computing",
      knowledge_test: [7,10]
    },
    {
      title: "Quantum Circuits",
      description: "Focuses on how to connect quantum gates in circuits.",
      sections: {
        "Connecting gates in series": 2 ,
        "Connecting gates in parallel": 5,
        "Common Circuits and their purpose": 9 ,
      },
      url: "/quantum-circuits",
      knowledge_test: [3,6]
    },
    {
      title: "Some Quantum Principles / Phenomena",
      description: "Important quantum effects and phenomena with practical implications.",
      sections: {
        "No-cloning theorem": 1,
        "Quantum Teleportation": 2,
        "Quantum Tunneling": 4,
        "Bell’s Theorem and Non-locality": 5,
      },
      url: "/quantum-phenomena",
      knowledge_test: [3,6]
    },
    {
      title: "Quantum Noise and Error Correction",
      description: "Introduces sources of quantum error and methods of correction.",
      sections: {
        "Quantum Noise": 1,
        "Quantum Decoherence": 2,
        "Error Correction": 4,
        "Fault Tolerance in QC":5,
      },
      url: "/error-correction",
      knowledge_test: [3,6]
    },
    {
      title: "Running Quantum Programs",
      description: "How to simulate and run quantum circuits using real hardware.",
      sections: {
        "Quantum Hardware": 2,
        "Quantum Simulation": 3,
        "What is Qiskit?":6,
        "Circuit Tutorial in Qiskit": 7,
        "Executing on Real Quantum Devices":9
      },
      url: "/running-quantum-programs",
      knowledge_test: [4]
    },
    {
      title: "Algorithms",
      description: "An overview of key quantum algorithms that demonstrate quantum advantage.",
      sections: {
        "Introduction to Quantum Algorithms": 1 ,
        "Grover’s": 5,
        "Shor’s": 11,

      },
      url: "/quantum-algorithms",
      knowledge_test: [7, 12]
    }
  ];
  
window.addEventListener("load", main);

function main() {
  console.log("entered");
  const container = document.getElementById("lesson-progress");
  if (!container) return;

  console.log("Lesson progress tracking loaded.");

  let completedSections = [];
  let userScores = {};

  Promise.all([
    fetch("/api/lesson-progress/").then(res => res.json()),
    fetch("/api/test-scores/").then(res => res.json())
  ]).then(([progressData, testScores]) => {
    completedSections = progressData;

    testScores.forEach(score => {
      if (!userScores[score.lesson__url]) {
        userScores[score.lesson__url] = {};
      }
      userScores[score.lesson__url][score.test_id] = score.score;
    });

    renderProgress(completedSections, userScores, container);
  }).catch(error => {
    console.error("Failed to load progress data:", error);
    renderProgress([], {}, container); // Fallback with no data
  });
}

function renderProgress(completedSections, userScores, container) {
  lesson_plan.forEach((lesson, idx) => {
    // Lesson title
    const titleEl = document.createElement("p");
    titleEl.className = "font-semibold mt-8";
    titleEl.textContent = `${idx + 1}. ${lesson.title}`;
    container.appendChild(titleEl);

    // Horizontal timeline
    const timeline = document.createElement("div");
    timeline.className = "w-full flex justify-between items-center py-6 px-2 relative";

    Object.entries(lesson.sections).forEach(([sectionName, endId], sectionIdx) => {
      const step = document.createElement("div");
      step.className = "flex flex-col items-center text-center flex-1 relative";

      const isCompleted = completedSections.some(p =>
        p.section__lesson__url === lesson.url && p.section__end_id === endId
      );

      const circle = document.createElement("div");
      circle.className = `w-6 h-6 rounded-full border-2 z-10 ${
        isCompleted ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
      }`;

      const label = document.createElement("p");
      label.className = `mt-2 text-xs truncate max-w-[100px] ${
        isCompleted ? 'text-indigo-600' : 'text-gray-700'
      }`;
      label.textContent = sectionName;

      const line = document.createElement("div");
      line.className = `absolute top-3 right-0 w-full h-0.5 ${
        isCompleted ? 'bg-indigo-600' : 'bg-gray-300'
      } z-0`;

      step.appendChild(line);
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

      const retake = document.createElement("a");
      retake.href = `${lesson.url}?section=${testId}`;
      retake.className = "text-sm text-indigo-600 hover:underline hover:text-indigo-800";
      retake.textContent = "(Re)take";

      const scoreVal = userScores[lesson.url]?.[testId];

      const bar = document.createElement("div");
      bar.className = "w-full bg-gray-200 rounded-full h-3";
      const fill = document.createElement("div");
      fill.className = "h-3 rounded-full";
      bar.appendChild(fill);

      if (scoreVal !== undefined) {
        score.textContent = `${scoreVal}%`;
        fill.style.width = `${scoreVal}%`;
        fill.classList.add("bg-indigo-600");
      } else {
        score.textContent = "Not taken";
        fill.style.width = "0%";
        fill.classList.add("bg-gray-400");
      }

      right.appendChild(score);
      right.appendChild(retake);
      top.appendChild(testTitle);
      top.appendChild(right);
      testBox.appendChild(top);
      testBox.appendChild(bar);
      scoreWrapper.appendChild(testBox);
    });

    container.appendChild(scoreWrapper);
  });
}
