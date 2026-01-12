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
  loadEvents();
}

/* SESSION CHECK */
supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session) showEvents();
});
const postBtn = document.getElementById("post-event");
const eventDate = document.getElementById("event-date");
const eventDesc = document.getElementById("event-desc");
const eventsList = document.getElementById("events-list");

/* POST EVENT */
postBtn.onclick = async () => {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!eventDate.value || !eventDesc.value) {
    alert("Fill all fields");
    return;
  }

  const { error } = await supabaseClient.from("events").insert([
    {
      user_id: user.id,
      event_date: eventDate.value,
      description: eventDesc.value
    }
  ]);

  if (error) {
    alert(error.message);
  } else {
    eventDate.value = "";
    eventDesc.value = "";
    loadEvents();
  }
};

/* LOAD EVENTS */
async function loadEvents() {
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  eventsList.innerHTML = "";

  if (data.length === 0) {
    eventsList.innerHTML = "<li>No events yet</li>";
    return;
  }

  data.forEach(event => {
    const li = document.createElement("li");
    li.textContent = `${event.event_date} — ${event.description}`;
    eventsList.appendChild(li);
  });
}