console.log("script.js loaded");

/* ======================
   SUPABASE CLIENT
====================== */
const SUPABASE_URL = "https://pxxmuryywxaompzqzthm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eG11cnl5d3hhb21wenF6dGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzA4ODEsImV4cCI6MjA4Mjg0Njg4MX0.tCVtxfVjmiy1tHVGGGx6790IqPFt3FoMc2bvmJZmkYg";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Supabase client ready");

/* ======================
   ELEMENTS
====================== */
const authSection = document.getElementById("authSection");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const eventsList = document.getElementById("events");

/* ======================
   AUTH STATE
====================== */
async function checkUser() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    authSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadEvents();
  } else {
    authSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", checkUser);

/* ======================
   LOGIN
====================== */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    checkUser();
  }
});

/* ======================
   LOGOUT
====================== */
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  checkUser();
});

/* ======================
   LOAD EVENTS
====================== */
async function loadEvents() {
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  eventsList.innerHTML = "";

  data.forEach((event) => {
    const li = document.createElement("li");
    li.className = "bg-gray-800 p-3 rounded mb-2";

    li.innerHTML = `
      <strong>${event.title}</strong><br>
      <small class="opacity-70">${event.date}</small>
    `;

    eventsList.appendChild(li);
  });
}