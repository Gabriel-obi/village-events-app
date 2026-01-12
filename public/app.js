const SUPABASE_URL = "https://pxxmuryywxaompzqzthm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eG11cnl5d3hhb21wenF6dGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzA4ODEsImV4cCI6MjA4Mjg0Njg4MX0.tCVtxfVjmiy1tHVGGGx6790IqPFt3FoMc2bvmJZmkYg";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ELEMENTS
const authSection = document.getElementById("auth-section");
const eventsSection = document.getElementById("events-section");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const authBtn = document.getElementById("auth-btn");
const toggleAuth = document.getElementById("toggle-auth");
const authTitle = document.getElementById("auth-title");
const logoutBtn = document.getElementById("logout-btn");

let isLogin = true;

/* TOGGLE LOGIN / SIGNUP */
toggleAuth.onclick = () => {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? "Login" : "Sign Up";
  authBtn.textContent = isLogin ? "Login" : "Sign Up";
  toggleAuth.textContent = isLogin ? "Sign up" : "Login";
};

/* LOGIN / SIGNUP */
authBtn.onclick = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  let response;

  if (isLogin) {
    response = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
  } else {
    response = await supabaseClient.auth.signUp({
      email,
      password
    });
  }

  if (response.error) {
    alert(response.error.message);
  } else {
    showEvents();
  }
};

/* LOGOUT */
logoutBtn.onclick = async () => {
  await supabaseClient.auth.signOut();
  eventsSection.classList.add("hidden");
  authSection.classList.remove("hidden");
};

/* SHOW EVENTS */
function showEvents() {
  authSection.classList.add("hidden");
  eventsSection.classList.remove("hidden");
}

/* SESSION CHECK */
supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session) showEvents();
});