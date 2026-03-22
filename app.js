// Basic SPA Router

const viewContainer = document.getElementById("viewContainer");
const menuItems = document.querySelectorAll(".sidebar li[data-page]");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".sidebar li.active")?.classList.remove("active");
    item.classList.add("active");
    loadView(item.dataset.page);
  });
});

function loadView(page) {

  if (page === "home") {
    viewContainer.innerHTML = `
      <h1>Dashboard</h1>
      <canvas id="performanceChart"></canvas>
    `;
    renderChart();
  }

  if (page === "quiz") {
    viewContainer.innerHTML = `
      <h1>Quiz</h1>
      <p>Select difficulty:</p>
      <button onclick="startQuiz('easy')">Easy</button>
      <button onclick="startQuiz('medium')">Medium</button>
      <button onclick="startQuiz('hard')">Hard</button>
      <div id="quizArea"></div>
    `;
  }

  if (page === "subjects") {
    viewContainer.innerHTML = `
      <h1>Subjects</h1>
      <p>Class 6-12 Subject Selection Coming Next</p>
    `;
  }

  if (page === "ai") {
    viewContainer.innerHTML = `
      <h1>AI Coach</h1>
      <textarea id="aiPrompt" placeholder="Ask your doubt..."></textarea>
      <button onclick="askAI()">Ask AI</button>
      <div id="aiResult"></div>
    `;
  }

  if (page === "profile") {
    viewContainer.innerHTML = `
      <h1>Profile</h1>
      <input type="file" id="profilePic">
      <button onclick="uploadPhoto()">Upload</button>
      <div id="profileInfo"></div>
    `;
  }
}

function renderChart() {
  const ctx = document.getElementById("performanceChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Math", "Science"],
      datasets: [{
        label: "Sample Data",
        data: [70, 85]
      }]
    }
  });
}

// Load default page
loadView("home");