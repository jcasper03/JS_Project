// Select form and input elements
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Define the API URL
const apiUrl = "http://127.0.0.1:5678/api/users/login";

// Function to handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Capture user input
    const email = emailInput.value;
    const password = passwordInput.value;

    // Create the payload
    const payload = {
        email: email,
        password: password,
    };

    // Make the POST request to the login API
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the data as JSON
    })
        .then((response) => {
            if (!response.ok) {
                // Handle unsuccessful login attempt
                throw new Error("Invalid login credentials. Please try again.");
            }
            return response.json(); // Parse the JSON response
        })
        .then((data) => {
            console.log("Login successful:", data);
            // Store token (if needed) and redirect to home page
            localStorage.setItem("auth_token", data.token); // Example of storing a token
            window.location.href = "/FrontEnd/edit.html"; // Redirect to home page
        })
        .catch((error) => {
            console.error("Error:", error.message);
            // Show error message to the user
            alert(error.message);
        });
});