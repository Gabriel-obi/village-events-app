const SUPABASE_URL = "https://pxxmuryywxaompzqzthm.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

const supabase =
  window._supabase ||
  (window._supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ));

const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const logoutBtn = document.getElementById("logoutBtn");
const eventForm = document.getElementById("eventForm");
const eventsList = document.getElementById("events");

async function updateUI() {
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    loadEvents();
  } else {
    dashboardView.classList.add("hidden");
    authView.classList.remove("hidden");
  }
}

updateUI();

/* LOGIN */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  updateUI();
});

/* SIGNUP */
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupEmail.value;
  const password = signupPassword.value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Check your email to confirm");
});

/* LOGOUT (THIS NOW WORKS) */
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  updateUI();
});

/* LOAD EVENTS */
async function loadEvents() {
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  eventsList.innerHTML = "";
  data.forEach((e) => {
    const li = document.createElement("li");
    li.className = "bg-white dark:bg-gray-800 p-4 rounded shadow";
    li.innerHTML = `<h3 class="font-bold">${e.title}</h3><p>${e.date}</p>`;
    eventsList.appendChild(li);
  });
}

/* CREATE EVENT */
eventForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await supabase.from("events").insert({
    title: title.value,
    date: date.value,
    description: description.value,
  });

  eventForm.reset();
  loadEvents();
});