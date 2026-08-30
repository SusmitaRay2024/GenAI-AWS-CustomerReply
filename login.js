const form = document.querySelector("#loginForm");
const nameInput = document.querySelector("#customerName");
const emailInput = document.querySelector("#customerEmail");
const status = document.querySelector("#loginStatus");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  // Validate name
  if (name.length < 2) {
    showStatus("Please enter your full name.", true);
    return;
  }

  // Validate email
  if (!email.includes("@") || !email.includes(".")) {
    showStatus("Please enter a valid email address.", true);
    return;
  }

  // Save customer profile information
  sessionStorage.setItem("resolvex_logged_in", "true");
  sessionStorage.setItem("resolvex_name", name);
  sessionStorage.setItem("resolvex_email", email);

  // Optional: show success message
  showStatus(`Welcome, ${name}!`);

  // Go to complaint page
  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
});

function showStatus(message, error = false) {
  status.textContent = message;
  status.className = `status${error ? " error" : ""}`;
}