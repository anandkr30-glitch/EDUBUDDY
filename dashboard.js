import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { db, auth } from "./firebase.js";

export async function loadDashboard(container) {

  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() || {};

  const snapshot = await getDocs(
    query(
      collection(db, "performance"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "asc")
    )
  );

  const performanceData = snapshot.docs.map(d => d.data());

  const totalQuiz = performanceData.length;

  let avg = 0;
  if (performanceData.length > 0) {
    const totalScore = performanceData.reduce((s, d) => s + (d.score || 0), 0);
    const totalQuestions = performanceData.reduce((s, d) => s + (d.total || 0), 0);
    if (totalQuestions > 0) {
      avg = Math.round((totalScore / totalQuestions) * 100);
    }
  }

  const streak = calculateStreak(performanceData);
  const xp = userData.xp || totalQuiz * 10;
  const level = Math.floor(xp / 100) + 1;

  container.innerHTML = `
    

    <div class="dashboard-header card">
  <div class="header-left">
    <h2 id="welcomeText"></h2>
    <p>Class ${userData.class || "-"} | ${userData.subject || "-"}</p>
  </div>
  <img src="${userData.photo || 'https://i.ibb.co/7QpKsCX/user.png'}"
       class="greeting-avatar">
</div>
    <div class="stats-grid">
      <div class="card stat-card">📚 Total Quizzes<br><strong>${totalQuiz}</strong></div>
      <div class="card stat-card">🔥 Streak<br><strong>${streak} days</strong></div>
      <div class="card stat-card">📊 Avg Score<br><strong>${avg}%</strong></div>
      <div class="card stat-card">⚡ XP<br><strong>${xp}</strong></div>
      <div class="card stat-card">🏆 Level<br><strong>${level}</strong></div>
    </div>

    <div class="analytics-grid">
      <div class="chart-card card">
        <h3>Performance Trend</h3>
        <canvas id="chart"></canvas>
      </div>

      <div class="history-card card">
        <h3>Recent Activity</h3>
<table class="activity-table">
  <thead>
    <tr>
      <th>Quiz</th>
      <th>Level</th>
      <th>Score</th>
      <th>%</th>
    </tr>
  </thead>
  <tbody id="historyTable"></tbody>
</table>
      </div>
    </div>
  `;

  setDynamicGreeting(userData.name || "Student");
  renderChart(performanceData);
  renderHistory(snapshot);
}

/* ===============================
   STREAK
================================ */

function calculateStreak(data) {
  if (!data.length) return 0;

  const dates = [...new Set(
    data.map(d =>
      new Date(d.timestamp?.seconds * 1000).toDateString()
    )
  )];

  return dates.length;
}

/* ===============================
   CHART
================================ */

function renderChart(data) {

  const ctx = document.getElementById("chart");
  if (!ctx || !data.length) return;

  // ✅ Take only latest 5 quizzes
  const recent = data.slice(-5);

  const labels = recent.map((_, i) => `Q${i + 1}`);

  const scores = recent.map(d =>
    d.total ? Math.round((d.score / d.total) * 100) : 0
  );

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: labels,
      datasets: [{
        label: "Performance %",
        data: scores,
        backgroundColor: "rgba(6,227,255,0.15)",
        borderColor: "#06E3FF",
        borderWidth: 3,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#06E3FF",
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            backdropColor: "transparent",
            color: "#94a3b8"
          },
          grid: { color: "rgba(255,255,255,0.08)" },
          angleLines: { color: "rgba(255,255,255,0.08)" },
          pointLabels: { color: "#cbd5e1" }
        }
      },
      plugins: {
        legend: {
          labels: { color: "#e2e8f0" }
        }
      }
    }
  });

  ctx.style.filter =
    "drop-shadow(0 0 15px rgba(6,227,255,0.6))";
}
/* ===============================
   HISTORY TABLE
================================ */

function renderHistory(snapshot) {

  const table = document.getElementById("historyTable");
  if (!table) return;

  if (!snapshot.docs.length) {
    table.innerHTML = "<tr><td colspan='4'>No quizzes taken</td></tr>";
    return;
  }

  table.innerHTML = snapshot.docs
    .slice(-5)
    .reverse()
    .map((docSnap, index) => {

      const p = docSnap.data();
      const percent = p.total
        ? Math.round((p.score / p.total) * 100)
        : 0;

     return `
<tr onclick="window.location.href='quiz_review.html?quizId=${docSnap.id}'">
  <td>${p.subject || "General"}</td>
  <td>${p.level}</td>
  <td>${p.score}/${p.total}</td>
  <td>
    <span class="score-badge ${
      percent >= 75 ? "green" :
      percent >= 50 ? "yellow" : "red"
    }">
      ${percent}%
    </span>
  </td>
</tr>
`;
    })
    .join("");
}

/* ===============================
   GREETING
================================ */

function setDynamicGreeting(name) {

  const hour = new Date().getHours();
  let greeting = "Welcome";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const el = document.getElementById("welcomeText");
  if (el) el.innerText = `${greeting}, ${name} 👋`;
}