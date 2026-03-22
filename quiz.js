import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function loadQuiz(container) {

  const generated = localStorage.getItem("generatedQuiz");

  if (generated) {
    container.innerHTML = renderGeneratedQuiz(generated);
    localStorage.removeItem("generatedQuiz");
    attachGeneratedSubmit();
    return;
    const reinforceData = localStorage.getItem("reinforceTopics");

if (reinforceData) {
  const weakTopics = JSON.parse(reinforceData);

  // Generate new quiz based on weak questions
  generateReinforcementQuiz(weakTopics);
  localStorage.removeItem("reinforceTopics");
}
  }

container.innerHTML = `
  <div class="quiz-wrapper">
    <div class="quiz-card">
      <h2>🚀 Choose Difficulty</h2>
      <div class="difficulty-buttons">
        <button id="easyBtn">Easy</button>
        <button id="mediumBtn">Medium</button>
        <button id="hardBtn">Hard</button>
      </div>
    </div>

    <div id="quizArea"></div>
  </div>
`;

document.getElementById("easyBtn").onclick = () => startQuiz("easy");
document.getElementById("mediumBtn").onclick = () => startQuiz("medium");
document.getElementById("hardBtn").onclick = () => startQuiz("hard");
}

/* ===============================
   AI GENERATED QUIZ SECTION
================================ */

let generatedQuestions = [];

// ✨ IMPROVED: Better parsing to capture explanations
function renderGeneratedQuiz(text) {

  generatedQuestions = [];

  // Better regex pattern to match questions with explanations
  const questionBlocks = text.match(/\d+\.\s*[\s\S]*?(?=\n\d+\.\s|$)/g);

  if (!questionBlocks) {
    return `<div class="card"><h2>No valid quiz format detected.</h2></div>`;
  }

  let html = `<div class="card"><h2>🧠 AI Generated Quiz</h2><p style="color: #666; margin-bottom: 20px;">Read the explanations carefully to learn!</p>`;

  questionBlocks.forEach((block, index) => {

    const lines = block.trim().split("\n");

    const questionLine = lines[0].replace(/^\d+\.\s*/, "").trim();

    const options = lines.filter(l =>
      /^[A-D]\)/.test(l.trim())
    );

    const answerLine = lines.find(l =>
      /^answer:/i.test(l.trim())
    );

    // ✨ NEW: Extract explanation
    const explanationLine = lines.find(l =>
      /^explanation:/i.test(l.trim())
    );

    let correctLetter = null;
    if (answerLine) {
      const match = answerLine.match(/[A-D]/);
      correctLetter = match ? match[0] : null;
    }

    const explanation = explanationLine ? 
      explanationLine.replace(/^Explanation:\s*/i, "").trim() : 
      "Check the answer key for explanation.";

    generatedQuestions.push({
      question: questionLine,
      options: options,
      correctAnswer: correctLetter,
      explanation: explanation  // ✨ NEW!
    });

    html += `
      <div class="quiz-question">
        <h3>Q${index + 1}: ${questionLine}</h3>
    `;

    options.forEach(opt => {
      const cleanOpt = opt.trim();
      html += `
        <label>
          <input type="radio" name="q${index}" value="${cleanOpt[0]}">
          ${cleanOpt}
        </label><br>
      `;
    });

    html += `</div><br>`;
  });

  html += `<button id="submitGeneratedQuiz">✅ Submit Quiz</button></div>`;

  return html;
}

function attachGeneratedSubmit() {

  document.getElementById("submitGeneratedQuiz").onclick = async () => {

    let score = 0;
    let detailedQuestions = [];

    generatedQuestions.forEach((q, index) => {

      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      const selectedValue = selected ? selected.value : null;

      const isCorrect = selectedValue === q.correctAnswer;

      if (isCorrect) score++;

      detailedQuestions.push({
        question: q.question,
        options: q.options,
        selectedAnswer: selectedValue,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,  // ✨ NEW!
        isCorrect: isCorrect
      });
    });

    const total = generatedQuestions.length;

    await savePerformance(score, total, "AI", detailedQuestions);

    // ✨ IMPROVED: Better result message
    const percentage = Math.round((score / total) * 100);
    const message = percentage === 100 
      ? "🏆 Perfect Score! You're a genius!" 
      : percentage >= 80 
      ? "🎉 Excellent work!" 
      : percentage >= 60 
      ? "👍 Good job! Keep practicing!" 
      : "💪 Keep learning! You'll improve!";

    alert(`${message}\n\nScore: ${score}/${total} (${percentage}%)\n\nCorrect: ${score}\nIncorrect: ${total - score}\n\nReview the explanations to learn more!`);

    // ✨ NEW: Show review with explanations
    showQuizReview(detailedQuestions, score, total);
  };
}

// ✨ NEW: Display quiz review with explanations
function showQuizReview(questions, score, total) {
  const reviewContainer = document.querySelector('.quiz-wrapper');
  let reviewHtml = `
    <div class="card" style="margin-top: 20px;">
      <h2>📝 Quiz Review</h2>
      <p style="font-size: 18px; font-weight: bold;">Score: ${score}/${total}</p>
  `;

  questions.forEach((q, index) => {
    const isCorrect = q.isCorrect;
    const resultEmoji = isCorrect ? '✅' : '❌';
    const resultColor = isCorrect ? '#10b981' : '#ef4444';

    reviewHtml += `
      <div style="margin: 15px 0; padding: 15px; border-left: 4px solid ${resultColor}; background: #f9fafb;">
        <h4>${resultEmoji} Question ${index + 1}</h4>
        <p><strong>${q.question}</strong></p>
        <p>Your answer: ${q.selectedAnswer || 'Not answered'}</p>
        <p style="color: #10b981;">Correct answer: ${q.correctAnswer}</p>
        <p style="background: #f0f9ff; padding: 10px; border-radius: 4px; margin-top: 10px;">
          <strong>📚 Explanation:</strong><br/>
          ${q.explanation}
        </p>
      </div>
    `;
  });

  reviewHtml += `
    <button onclick="location.reload()" style="
      margin-top: 20px;
      padding: 10px 20px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;">
      🏠 Back to Home
    </button>
    </div>
  `;

  reviewContainer.innerHTML = reviewHtml;
}

/* ===============================
   MANUAL QUIZ SECTION
================================ */

function startQuiz(level) {

  const questionBank = {

  easy: [
    { q: "What is 7 × 8?", options: ["54","56","64","58"], answer: "56" },
    { q: "Find HCF of 12 and 18.", options: ["6","3","9","12"], answer: "6" },
    { q: "Water freezes at what temperature (°C)?", options: ["0","10","100","-10"], answer: "0" }
  ],

  medium: [
    { q: "Solve: 2x + 5 = 15", options: ["5","10","7","3"], answer: "5" },
    { q: "What is the value of π (approx)?", options: ["2.14","3.14","4.13","3.41"], answer: "3.14" },
    { q: "Speed = Distance / ?", options: ["Time","Mass","Force","Energy"], answer: "Time" }
  ],

  hard: [
    { q: "Derivative of x² is?", options: ["2x","x","x²","1"], answer: "2x" },
    { q: "If sin θ = 1/2, θ = ?", options: ["30°","45°","60°","90°"], answer: "30°" },
    { q: "What is 25% of 480?", options: ["120","100","140","150"], answer: "120" }
  ]

};

  renderQuiz(questionBank[level], level);
}


function renderQuiz(questions, level) {

  let currentIndex = 0;
  let score = 0;
  let detailedQuestions = [];

  const quizArea = document.getElementById("quizArea");

  function loadQuestion() {

    const q = questions[currentIndex];

    if (!q) {
      quizArea.innerHTML = "<p>No question found.</p>";
      return;
    }

    quizArea.innerHTML = `
      <div class="quiz-card">
        <h3>Question ${currentIndex + 1}/${questions.length}</h3>
        <p>${q.q}</p>

        ${q.options.map(opt => `
          <label class="quiz-option">
            <input type="radio" name="option" value="${opt}">
            ${opt}
          </label>
        `).join("")}

        <br>
        <button id="nextBtn">Next</button>
      </div>
    `;

    document.getElementById("nextBtn").onclick = () => {

      const selected = document.querySelector('input[name="option"]:checked');

      if (!selected) {
        alert("Select an answer");
        return;
      }

      const isCorrect = selected.value === q.answer;
      if (isCorrect) score++;

      detailedQuestions.push({
        question: q.q,
        options: q.options,
        selectedAnswer: selected.value,
        correctAnswer: q.answer,
        isCorrect
      });

      currentIndex++;

      if (currentIndex < questions.length) {
        loadQuestion();
      } else {
        // ✨ IMPROVED: Show detailed results
        const percentage = Math.round((score / questions.length) * 100);
        quizArea.innerHTML = `
          <div class="quiz-card">
            <h2>Quiz Completed 🎉</h2>
            <p>Score: ${score}/${questions.length} (${percentage}%)</p>
            <button onclick="location.reload()" style="
              margin-top: 20px;
              padding: 10px 20px;
              background: #4f46e5;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;">
              🏠 Home
            </button>
          </div>
        `;
      }
    };
  }

  loadQuestion();
}

/* ===============================
   SAVE PERFORMANCE (UPGRADED)
================================ */

async function savePerformance(score, total, level, detailedQuestions, subject) {

  const user = auth.currentUser;
  if (!user) return;

  try {

    await addDoc(collection(db, "performance"), {
      userId: user.uid,
      subject: subject || "General",
      level: level,
      score: score,
      total: total,
      percentage: Math.round((score / total) * 100),
      questions: detailedQuestions,
      timestamp: serverTimestamp()
    });

    console.log("✅ Quiz performance saved successfully");

  } catch (err) {
    console.error("❌ Error saving quiz:", err);
  }
}