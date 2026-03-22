import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { loadDashboard } from "./dashboard.js";
import { loadQuiz } from "./quiz.js";
import { loadAI } from "./ai.js";
import { loadProfile } from "./profile.js";

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const view = document.getElementById("view");
const logoutBtn = document.getElementById("logoutBtn");

// 🔥 Sidebar toggle
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}

// 🔥 Clean sidebar navigation (ONLY ONE LISTENER)
document.querySelector(".sidebar ul").addEventListener("click", (e) => {

  const li = e.target.closest("li");
  if (!li) return;

  const page = li.dataset.page;
  if (!page) return;

  // remove active class
  document.querySelectorAll(".sidebar li")
    .forEach(item => item.classList.remove("active"));

  li.classList.add("active");

  navigate(page);
});

// 🔥 Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "auth.html";
});

// 🔥 Navigation function
window.navigate = function(page) {
  view.innerHTML = "";

  if (page === "dashboard") loadDashboard(view);
  if (page === "quiz") loadQuiz(view);
  if (page === "ai") loadAI(view);
  if (page === "profile") loadProfile(view);
}

// 🔥 Auth state check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "auth.html";
  } else {
    navigate("dashboard");
  }
});