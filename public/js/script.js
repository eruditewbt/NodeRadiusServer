{
  const form = document.getElementById("login-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Send request to RADIUS server
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Login successful, redirect to internet
          alert(data.message);
          window.location.href = "/redirect";
        } else {
          alert("error loging in: " + data.message);
        }
      })
      .catch((error) => console.error(error));
  });
}
