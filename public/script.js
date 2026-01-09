console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://pxxmuryywxaompzqzthm.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eG11cnl5d3hhb21wenF6dGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzA4ODEsImV4cCI6MjA4Mjg0Njg4MX0.tCVtxfVjmiy1tHVGGGx6790IqPFt3FoMc2bvmJZmkYg";

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("Supabase initialized");

  // Elements
  const authSection = document.getElementById("authSection");
  const dashboard = document.getElementById("dashboard");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutBtn = document.getElementById("logoutBtn");

  const eventForm = document.getElementById("eventForm");
  const eventsList = document.getElementById("events");

  // Auth state handler
  async function handleAuthState() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      authSection.classList.add("hidden");
      dashboard.classList.remove("hidden");
      loadEvents();
    } else {
      authSection.classList.remove("hidden");
      dashboard.classList.add("hidden");
    }
  }

  handleAuthState();

  supabase.auth.onAuthStateChange(() => {
    handleAuthState();
  });

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  });

  // Signup
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to verify your account");
    }
  });

  // Logout
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
  });

  // Load events
  async function loadEvents() {
    const { data, error } = await supabase
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
      li.className = "bg-white p-4 rounded shadow";

      li.innerHTML = `
        <h3 class="font-bold text-lg">${event.title}</h3>
        <p class="text-sm text-gray-500">${event.date}</p>
        <p>${event.description || ""}</p>
      `;

      eventsList.appendChild(li);
    });
  }

  // Post event
  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;

    const { error } = await supabase.from("events").insert([
      { title, date, description },
    ]);

    if (error) {
      alert(error.message);
    } else {
      eventForm.reset();
      loadEvents();
    }
  });
});