const supabase = window.supabase.createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);

const authSection = document.getElementById("auth-section");
const eventsSection = document.getElementById("events-section");

const authBtn = document.getElementById("auth-btn");
const toggleAuth = document.getElementById("toggle-auth");
const authTitle = document.getElementById("auth-title");

let isLogin = true;

/* TOGGLE LOGIN / SIGNUP */
toggleAuth.onclick = () => {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? "Login" : "Sign Up";
  authBtn.textContent = isLogin ? "Login" : "Sign Up";
  toggleAuth.textContent = isLogin ? "Sign up" : "Login";
};

/* AUTH */
authBtn.onclick = async () => {
  const email = email.value;
  const password = password.value;

  let result;

  if (isLogin) {
    result = await supabase.auth.signInWithPassword({ email, password });
  } else {
    result = await supabase.auth.signUp({ email, password });
  }

  if (result.error) {
    alert(result.error.message);
  } else {
    showEvents();
  }
};

/* LOGOUT */
document.getElementById("logout-btn").onclick = async () => {
  await supabase.auth.signOut();
  eventsSection.classList.add("hidden");
  authSection.classList.remove("hidden");
};

/* SHOW EVENTS */
function showEvents() {
  authSection.classList.add("hidden");
  eventsSection.classList.remove("hidden");
}

/* SESSION CHECK */
supabase.auth.getSession().then(({ data }) => {
  if (data.session) showEvents();
});