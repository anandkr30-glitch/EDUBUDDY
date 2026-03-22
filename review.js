import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { db } from "./firebase.js";

const GROQ_API_KEY = "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";
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quizId");

async function loadReview() {

  if (!quizId) return;

  const docRef = doc(db, "performance", quizId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    document.getElementById("questionList").innerHTML =
      "<p>Quiz not found.</p>";
    return;
  }

  const data = docSnap.data();

  const summaryBox = document.getElementById("summaryBox");
  const questionList = document.getElementById("questionList");

  const percent = data.total
    ? Math.round((data.score / data.total) * 100)
    : 0;

  summaryBox.innerHTML = `
    <div class="review-summary">
      <h2>Score: ${data.score}/${data.total} (${percent}%)</h2>
      <p>Level: ${data.level}</p>
    </div>
  `;

  if (!data.questions || !data.questions.length) {
    questionList.innerHTML =
      "<p>This quiz was taken before detailed tracking was enabled.</p>";
    return;
  }

  questionList.innerHTML = data.questions.map((q, i) => {

    const optionsHTML = q.options.map(opt => {

      const isCorrectOption = opt === q.correctAnswer;
      const isSelected = opt === q.selectedAnswer;

      let className = "";

      if (isCorrectOption) className = "correct-option";
      if (isSelected && !q.isCorrect) className = "wrong-option";

      return `<li class="${className}">${opt}</li>`;

    }).join("");

    return `
      <div class="review-card">
        <h3>Q${i + 1}: ${q.question}</h3>
        <ul class="options-list">
          ${optionsHTML}
        </ul>
        <p>
          Your Answer:
          <span class="${q.isCorrect ? 'correct' : 'wrong'}">
            ${q.selectedAnswer || "Not Attempted"}
          </span>
        </p>
        <p><strong>Correct Answer:</strong> ${q.correctAnswer}</p>
        <p><strong>Explanation:</strong> ${q.explanation || "Review why the correct answer is better."}</p>
      </div>
    `;
  }).join("");

  runAIAnalysis(data);
}

/* ================================
   🔥 IMPROVED AI ANALYSIS WITH FALLBACK
================================ */

async function runAIAnalysis(data) {

  const aiBox = document.getElementById("aiAnalysisBox");
  
  // Check if element exists
  if (!aiBox) {
    console.warn("aiAnalysisBox element not found");
    return;
  }

  if (!data.questions || !data.questions.length) {
    aiBox.innerHTML = "<p>No questions to analyze.</p>";
    return;
  }

  // Filter only wrong questions
  const wrongQuestions = data.questions.filter(q => !q.isCorrect);

  // If perfect score
  if (wrongQuestions.length === 0) {
    aiBox.innerHTML = `
      <div class="ai-review-box">
        <h2>🎉 Perfect Score!</h2>
        <p>Excellent! You answered all questions correctly. Great job!</p>
      </div>
    `;
    return;
  }

  aiBox.innerHTML = "<p>⏳ Analyzing your quiz with AI...</p>";

  // Build formatted questions for AI
  const formattedQuestions = wrongQuestions.map((q, i) => {
    return `
Question ${i + 1}: ${q.question}

Options:
${q.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join("\n")}

Your answer: ${q.selectedAnswer}
Correct answer: ${q.correctAnswer}
`;
  }).join("\n---\n");

  try {

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "system",
          content: "You are an expert academic tutor. Provide clear, concise explanations to help students understand their mistakes."
        },
        {
          role: "user",
          content: `
Student answered ${wrongQuestions.length} question(s) incorrectly. 

For each wrong question, explain:
1. Why the correct answer is right
2. Why the student's answer was wrong
3. One key concept to remember

Keep explanations SHORT and CLEAR (2-3 sentences each).

${formattedQuestions}

Format as:
**Question [number]:**
Correct Answer: [answer]
Explanation: [why correct]
Why You Were Wrong: [explanation]
Key Point: [concept to remember]
`
        }],
        temperature: 0.4,
        max_tokens: 2000
      })
    });

    // Check if response is ok
    if (!response.ok) {
      console.error(`API returned status: ${response.status}`);
      showFallbackFeedback(aiBox, wrongQuestions);
      return;
    }

    const result = await response.json();

    // Check if we got a valid response
    if (!result || !result.choices || !result.choices[0]) {
      console.error("Invalid API response structure:", result);
      showFallbackFeedback(aiBox, wrongQuestions);
      return;
    }

    const aiText = result.choices[0]?.message?.content;

    if (!aiText) {
      console.error("No text content in API response");
      showFallbackFeedback(aiBox, wrongQuestions);
      return;
    }

    aiBox.innerHTML = `
      <div class="ai-review-box">
        <h2>📚 AI Detailed Review</h2>
        <div class="ai-content">
          ${aiText.replace(/\n/g, "<br>")}
        </div>
      </div>
    `;

  } catch (error) {
    console.error("AI Analysis Error:", error);
    
    // FALLBACK: Show what we know from the quiz data
    showFallbackFeedback(aiBox, wrongQuestions);
  }
}

// Fallback feedback if AI API fails
function showFallbackFeedback(aiBox, wrongQuestions) {
  aiBox.innerHTML = `
    <div class="ai-review-box">
      <h2>📚 Review Summary</h2>
      <p><strong>Review the following questions you answered incorrectly:</strong></p>
      <div class="ai-content">
        ${wrongQuestions.map((q, i) => `
          <div style="margin: 20px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #ef4444; border-radius: 4px;">
            <h3 style="color: #1f2937; margin-top: 0;">Question ${i + 1}</h3>
            <p style="margin: 10px 0;"><strong>${q.question}</strong></p>
            
            <div style="background: white; padding: 10px; border-radius: 4px; margin: 10px 0;">
              <p style="margin: 5px 0; color: #ef4444;"><strong>❌ Your answer:</strong> ${q.selectedAnswer}</p>
              <p style="margin: 5px 0; color: #10b981;"><strong>✅ Correct answer:</strong> ${q.correctAnswer}</p>
            </div>
            
            <p style="margin: 10px 0; padding: 10px; background: #f0f9ff; border-radius: 4px;">
              <strong>📖 Explanation:</strong><br/>
              ${q.explanation || "Review why the correct answer is the best choice."}
            </p>
          </div>
        `).join("")}
      </div>
      <p style="margin-top: 20px; padding: 10px; background: #fef3c7; border-radius: 4px; color: #92400e;">
        <strong>💡 Tip:</strong> Review these concepts again. You can retake this quiz to improve!
      </p>
    </div>
  `;
}

loadReview();