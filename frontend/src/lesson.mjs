/*
    File: lesson.mjs
    Author: Lea Button
    Date: 04-2024
*/

"use strict";

let sections = [];
let currentLessonIndex = 0;
import { lesson_plan } from './progress_tracking.mjs';
import { questionsIntroduction, 
         questionsFundamentals,
         questionsCircuits,
         questionsPhenomena,
         questionsErrorCorrection,
         questionsRunningQuantumPrograms
 } from './quizzes.mjs';
import { timelineData } from './timeline.mjs';


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

        markSectionComplete();

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

    if (window.location.pathname === "/introduction-to-quantum-computing" ){
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

let questionsCorrect = 0;

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
                questionsCorrect++;
               
                alert('Correct!');
            } else {
                alert('Incorrect!');
            }

            currentQuestionIndex++;

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
    const section = questions.find(s => s.section === sectionIndex);
    if (!section) return;

    const totalQuestions = section.questions.length;
    const score = Math.round((questionsCorrect / totalQuestions) * 100);  // percent
    const testId = section.questions[0].id ?? sectionIndex;  // assume first question has an ID (or fallback to section index)

    console.log(`Submitting test score: ${score}/${totalQuestions} for test ID ${testId}`);

    fetch("/api/submit-test/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            lesson_url: currentPage,
            test_id: testId,
            score: score
        })
    }).then(res => {
        if (!res.ok) {
            console.error(" Failed to submit test score.");
        }
    });

    const retakeUrl = `${window.location.pathname}?section=${sectionIndex}`;

    let questionContainer = document.getElementById(`question-container-${sectionIndex}`);
    questionContainer.innerHTML = `
        <h3 class="mb-2 text-lg font-semibold text-indigo-800">Quiz Completed</h3>
        <p class="mb-2 text-md font-normal text-gray-500">You have completed the quiz for this section.</p>
        <p class="text-sm font-normal text-gray-400 mb-4">Score: ${score}/100%</p>
        <a href="${retakeUrl}" class="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Retake Quiz
        </a>
    `;

    questionsCorrect = 0;
}


window.submitAnswer = submitAnswer;

  
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

function markSectionComplete() {
    const sectionElement = sections[currentLessonIndex];
    const sectionId = parseInt(sectionElement.id.replace("section-", ""));
    // Find the current lesson in the lesson plan
    const lesson = lesson_plan.find(lesson => lesson.url === currentPage);

    if (!lesson) {
        console.warn("No matching lesson found for URL:", currentPage);
        return;
    }

    // Extract end_ids from the sections object
    const endIds = Object.values(lesson.sections);  // e.g., [1, 2, 7, 11, 16]

    if (!endIds.includes(sectionId)) {
        // This section is not a final slide of any sub-section — don't mark progress
        return;
    }

    const matchedSection = Object.entries(lesson.sections)
    .find(([_, id]) => id === sectionId)?.[0];

    console.log(` About to section "${matchedSection}" of lesson "${lesson.title}" (section ID: ${sectionId}) as completed.`);

    // Section is an endpoint — send progress to server
    fetch("/api/mark-progress/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            lesson_url: currentPage,
            section_id: sectionId
        })
    }).then(res => {
        if (!res.ok) {
            console.error("Failed to mark section progress.");
        }
    });
}
  