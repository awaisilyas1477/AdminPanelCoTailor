const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  });

  if (error) {
    errorMsg.textContent = error.message;
  } else {
    localStorage.setItem("adminToken", data.session.access_token);
    window.location.href = "admin.html";
  }
});
