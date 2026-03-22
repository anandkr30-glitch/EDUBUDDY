import { auth, db } from "./firebase.js";
import { fetchYouTubeVideos } from "./youtube.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const GROQ_API_KEY = "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";

let chatHistory = [
  {
    role: "system",
    content: "You are an academic AI tutor helping students from class 6 to 12."
  }
];

export function loadAI(container) {
  container.innerHTML = `
<div class="ai-page">
  <div class="ai-left">
    <div class="card ai-header-card">
      <h2>🤖 EduBuddy AI Coach</h2>
      <p>Your Personal Smart Tutor</p>
    </div>

    <div class="card ai-tools">
      <label class="upload-btn">
        📄 Upload Syllabus
        <input type="file" id="pdfUpload" accept="application/pdf" hidden />
      </label>

      <select id="difficultySelect">
        <option value="easy">Easy</option>
        <option value="medium" selected>Medium</option>
        <option value="hard">Hard</option>
      </select>

      <label for="quizCountSelect" style="margin-top: 10px; display: block;">
        📊 Number of Questions:
      </label>
      <select id="quizCountSelect" style="margin-bottom: 10px;">
        <option value="3">3 Questions</option>
        <option value="5" selected>5 Questions</option>
        <option value="10">10 Questions</option>
        <option value="15">15 Questions</option>
      </select>

      <button id="scanPdfBtn">Scan</button>
    </div>

    <div class="card chat-card">
      <div id="aiLoader" class="ai-loader hidden">Thinking...</div>
      <div id="chatBox" class="chat-box"></div>

      <div class="chat-input-area">
        <button id="micBtn">🎤</button>
        <button id="stopSpeechBtn">⏹</button>
        <input id="chatInput" placeholder="Ask anything or 'Quiz on [topic]'..." />
        <button id="sendBtn">➤</button>
      </div>
    </div>
  </div>

  <div class="ai-right">
    <div class="card">
      <h3>📺 Recommended Videos</h3>
      <div id="videoContainer"></div>
    </div>
  </div>
</div>
`;

  document.getElementById("chatInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  document.getElementById("scanPdfBtn").addEventListener("click", handlePdfUpload);
}

function isQuizRequest(message) {
  const quizKeywords = ["quiz", "questions", "test", "exam", "practice", "mcq", "generate quiz"];
  const lowerMsg = message.toLowerCase();
  return quizKeywords.some(keyword => lowerMsg.includes(keyword));
}

async function loadVideosImmediately(message) {
  const videoContainer = document.getElementById("videoContainer");
  if (!videoContainer) return;

  try {
    videoContainer.innerHTML = "📺 Loading videos...";
    const videos = await fetchYouTubeVideos(message);
    videoContainer.innerHTML = "";
    
    if (videos && videos.length > 0) {
      videos.slice(0, 3).forEach(video => {
        videoContainer.innerHTML += `
          <iframe 
            src="https://www.youtube.com/embed/${video.id.videoId}"
            frameborder="0"
            allowfullscreen
            style="width: 100%; height: 200px; margin: 10px 0; border-radius: 8px;">
          </iframe>
        `;
      });
    } else {
      videoContainer.innerHTML = "No videos found";
    }
  } catch (err) {
    console.error("Video fetch error:", err);
    videoContainer.innerHTML = "Videos unavailable";
  }
}

async function sendMessage() {
  const input = document.getElementById("chatInput");
  const loader = document.getElementById("aiLoader");

  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";
  loader.classList.remove("hidden");

  loadVideosImmediately(message);

  const difficulty = document.getElementById("difficultySelect").value || "medium";
  const quizCount = document.getElementById("quizCountSelect").value || "5";

  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() || {};

    const subject = userData.subject || "General";
    const classValue = userData.class || "10";

    if (isQuizRequest(message)) {
      await generateQuiz(message, difficulty, subject, classValue, loader, quizCount);
    } else {
      await generateTheory(message, difficulty, subject, classValue, loader);
    }

  } catch (err) {
    loader.classList.add("hidden");
    appendMessage("assistant", "Error: " + err.message);
    console.error("Error:", err);
  }
}

async function generateTheory(message, difficulty, subject, classValue, loader) {
  try {
    const systemPrompt = `You are an expert academic tutor for class ${classValue} students studying ${subject}.

Provide CLEAR, COMPREHENSIVE, and ENGAGING explanations.

Include:
- Simple language appropriate for the class level
- Real-world examples and analogies
- Step-by-step breakdown of concepts
- Key points in bold
- Visual descriptions where helpful

Make learning fun and easy to understand!`;

    const userPrompt = `Explain "${message}" for class ${classValue} students.

Include:
1. Definition - What is it?
2. Key Concepts - Important ideas
3. Examples - Real-world examples
4. Applications - How is it used?
5. Tips - Easy ways to remember`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + GROQ_API_KEY
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000
        })
      }
    );

    const data = await response.json();
    loader.classList.add("hidden");

    if (!data.choices || !data.choices[0]) {
      appendMessage("assistant", "Failed to generate explanation. Please try again.");
      return;
    }

    const reply = data.choices[0].message.content || "No response.";
    appendMessage("assistant", reply);

    window.speechSynthesis.cancel();
    speakText(reply.substring(0, 300));

  } catch (err) {
    loader.classList.add("hidden");
    appendMessage("assistant", "Error generating explanation: " + err.message);
    console.error("Theory Error:", err);
  }
}

async function generateQuiz(message, difficulty, subject, classValue, loader, quizCount) {
  try {
    const systemPrompt = `You are an expert academic AI tutor creating quiz questions for class ${classValue} students.

CRITICAL REQUIREMENTS:
1. ALL answers must be 100% ACCURATE
2. Verify math calculations
3. Double-check facts
4. VARY correct answer positions (A, B, C, D equally)
5. Create UNIQUE questions
6. Include real-world scenarios
7. Provide DETAILED explanations

ACCURACY IS MANDATORY!`;

    const userPrompt = `Create exactly ${quizCount} ${difficulty} level multiple choice quiz questions about "${message}" for class ${classValue}.

REQUIREMENTS:
- Exactly ${quizCount} questions
- Each question DIFFERENT and INTERESTING
- Include scenarios and real-world examples
- Vary answer positions (A, B, C, D)
- Verify all answers are CORRECT
- Provide clear explanations

Format STRICTLY (no markdown):

1. [Question with context?]
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Answer: B
Explanation: Why B is correct.

2. [Second question?]
A) Option
B) Option
C) Option
D) Option
Answer: C
Explanation: Detailed explanation...

[Continue for exactly ${quizCount} questions]`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + GROQ_API_KEY
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.5,
          top_p: 0.8,
          max_tokens: 3000
        })
      }
    );

    const data = await response.json();
    loader.classList.add("hidden");

    if (!data.choices || !data.choices[0]) {
      appendMessage("assistant", "Failed to generate quiz. Please try again.");
      return;
    }

    const reply = data.choices[0].message.content || "No response.";
    appendMessage("assistant", reply);

    if (reply.includes("Answer:")) {
      localStorage.setItem("generatedQuiz", reply);
      appendMessage("assistant", "Quiz with " + quizCount + " questions ready! Click below to start.");

      const chatBox = document.getElementById("chatBox");
      chatBox.innerHTML += `
        <button id="startQuizBtn" style="
          margin-top:10px;
          padding:10px 16px;
          background:#4f46e5;
          border:none;
          border-radius:8px;
          color:white;
          cursor:pointer;
          font-weight:bold;
          font-size:16px;
          transition:all 0.3s;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);">
          Start Quiz Now
        </button>
      `;

      const startBtn = document.getElementById("startQuizBtn");
      startBtn.onmouseover = function(e) {
        e.target.style.background = "#6366f1";
        e.target.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.5)";
      };
      startBtn.onmouseout = function(e) {
        e.target.style.background = "#4f46e5";
        e.target.style.boxShadow = "0 2px 8px rgba(79, 70, 229, 0.3)";
      };

      startBtn.onclick = function() {
        document.querySelector('[data-page="quiz"]').click();
      };
    }

    window.speechSynthesis.cancel();
    speakText("Quiz with " + quizCount + " questions generated. Click start quiz to begin.");

  } catch (err) {
    loader.classList.add("hidden");
    appendMessage("assistant", "Error generating quiz: " + err.message);
    console.error("Quiz Error:", err);
  }
}

async function handlePdfUpload() {
  const fileInput = document.getElementById("pdfUpload");
  const file = fileInput.files[0];
 
  if (!file) {
    alert("Please select a PDF file.");
    return;
  }
 
  if (!window.pdfjsLib) {
    alert("PDF library not loaded. Refresh the page.");
    return;
  }
 
  const loader = document.getElementById("aiLoader");
  loader.classList.remove("hidden");
  loader.innerText = "📄 Processing PDF...";
 
  const reader = new FileReader();
  reader.onload = async function() {
    try {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let fullText = "";
 
      for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += strings.join(" ") + " ";
      }
 
      appendMessage("user", "📄 PDF uploaded: " + file.name);
      
      // Send PDF content to AI
      const message = "Based on this syllabus, please provide a summary and suggest important topics to study:\n\n" + fullText.substring(0, 5000);
      
      document.getElementById("chatInput").value = message;
      loader.classList.remove("hidden");
      loader.innerText = "⏳ Analyzing PDF...";
      
      // Trigger send message
      await sendMessage();
      
    } catch (err) {
      loader.classList.add("hidden");
      appendMessage("assistant", "❌ Error processing PDF: " + err.message);
      console.error(err);
    }
  };
  reader.readAsArrayBuffer(file);
}

function appendMessage(role, text) {
  const chatBox = document.getElementById("chatBox");
  const msgDiv = document.createElement("div");
  msgDiv.className = role === "user" ? "chat-user" : "chat-ai";
  msgDiv.innerText = text;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function speakText(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

document.addEventListener("click", function(e) {
  if (e.target.id === "sendBtn") {
    sendMessage();
  }
  if (e.target.id === "micBtn") {
    startVoiceInput();
  }
  if (e.target.id === "stopSpeechBtn") {
    window.speechSynthesis.cancel();
  }
});

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = function(event) {
    document.getElementById("chatInput").value = event.results[0][0].transcript;
  };
}