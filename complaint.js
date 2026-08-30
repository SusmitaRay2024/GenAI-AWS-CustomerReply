const API_URL = "https://wihwz3p7l4ewwu2uttabxpypoa0itdcn.lambda-url.us-east-1.on.aws/";


// ===============================
// CHECK LOGIN
// ===============================

const loggedIn = sessionStorage.getItem("resolvex_logged_in");
const name = sessionStorage.getItem("resolvex_name");
const email = sessionStorage.getItem("resolvex_email");

if (loggedIn !== "true" || !name || !email) {
  window.location.replace("login.html");
}


// ===============================
// DISPLAY CUSTOMER INFORMATION
// ===============================

// Welcome message
document.querySelector("#welcomeName").textContent =
  name.split(" ")[0];


// Profile information
document.querySelector("#profileName").textContent =
  name;

document.querySelector("#profileEmail").textContent =
  email;


// Profile menu
document.querySelector("#menuName").textContent =
  name;

document.querySelector("#menuEmail").textContent =
  email;


// Avatar
document.querySelector("#avatar").textContent =
  name
    .split(/\s+/)
    .map(part => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();


// ===============================
// CUSTOMER QUERY TITLE
// ===============================

// Example:
// Arghya → Arghya's Query
// Ananya → Ananya's Query

const queryName = document.querySelector("#queryName");

if (queryName) {
  queryName.textContent = name;
}


// ===============================
// GET HTML ELEMENTS
// ===============================

const complaint = document.querySelector("#complaint");
const counter = document.querySelector("#counter");
const generateBtn = document.querySelector("#generateBtn");
const status = document.querySelector("#status");
const reply = document.querySelector("#reply");
const copyBtn = document.querySelector("#copyBtn");
const profileBtn = document.querySelector("#profileBtn");
const profileMenu = document.querySelector("#profileMenu");
const logoutBtn = document.querySelector("#logoutBtn");


// ===============================
// COMPLAINT CHARACTER COUNTER
// ===============================

complaint.addEventListener("input", () => {

  counter.textContent =
    `${complaint.value.length} / 5000`;

});


// ===============================
// PROFILE MENU
// ===============================

profileBtn.addEventListener("click", () => {

  profileMenu.classList.toggle("hidden");

});


document.addEventListener("click", event => {

  if (!event.target.closest(".profile")) {

    profileMenu.classList.add("hidden");

  }

});


// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener("click", () => {

  sessionStorage.clear();

  window.location.replace("login.html");

});


// ===============================
// GENERATE REPLY
// ===============================

generateBtn.addEventListener("click", async () => {

  const text = complaint.value.trim();


  // Check complaint
  if (!text) {

    return showStatus(
      "Please enter your complaint first.",
      true
    );

  }


  // Start loading
  setLoading(true);


  showStatus(
    "Saving your complaint and generating a professional response..."
  );


  try {

    // ===============================
    // SEND DATA TO LAMBDA
    // ===============================

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        // Customer information
        customer_name: name,
        customer_email: email,

        // Actual complaint
        complaint: text,

        // File name for S3
        file_name: `${name.replace(
          /[^a-z0-9]+/gi,
          "_"
        )}_complaint.txt`

      })

    });


    // ===============================
    // READ RESPONSE
    // ===============================

    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Unable to generate the response."
      );

    }


    // ===============================
    // DISPLAY GENERATED REPLY
    // ===============================

    reply.textContent =
      data.reply || "";

    reply.classList.remove("empty");

    copyBtn.disabled =
      !data.reply;


    // ===============================
    // SUCCESS MESSAGE
    // ===============================

    showStatus(
      "✓ Response generated successfully."
    );


  } catch (error) {

    console.error(error);

    showStatus(
      `Unable to connect to the AWS backend: ${error.message}`,
      true
    );


  } finally {

    // Stop loading
    setLoading(false);

  }

});


// ===============================
// COPY REPLY
// ===============================

copyBtn.addEventListener("click", async () => {

  if (!reply.textContent) {

    return;

  }


  await navigator.clipboard.writeText(
    reply.textContent
  );


  copyBtn.textContent =
    "Copied!";


  setTimeout(() => {

    copyBtn.textContent =
      "Copy";

  }, 1400);

});


// ===============================
// LOADING STATE
// ===============================

function setLoading(loading) {

  generateBtn.disabled =
    loading;


  generateBtn.querySelector("span").textContent =
    loading
      ? "Generating..."
      : "Generate Reply";

}


// ===============================
// STATUS MESSAGE
// ===============================

function showStatus(
  message,
  error = false
) {

  status.textContent =
    message;


  status.className =
    `status${error ? " error" : ""}`;

}