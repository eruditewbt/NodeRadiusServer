{
  // Add event listeners for delete buttons
  const deleteBtns = document.getElementsByClassName("delete-btn");
  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener("click", () => {
      const username = deleteBtns[i].getAttribute("data-username");
      // Send request to delete user
      fetch(`/admin/users/${username}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    });
  }

  // Add event listener for add user form
  const addUserForm = document.getElementById("add-user-form");
  addUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    // Send request to add user
    fetch("/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  });

  // Add event listeners for save buttons
  const saveBtns = document.getElementsByClassName("save-btn");
  for (let i = 0; i < saveBtns.length; i++) {
    saveBtns[i].addEventListener("click", () => {
      const username = saveBtns[i].getAttribute("data-username");
      const newUsername = document.querySelector(
        `input[data-username="${username}"]`
      ).value;
      const newPassword = document.querySelector(
        `input[data-password="${username}"]`
      ).value;
      const newDuration = document.querySelector(
        `input[data-duration="${username}"]`
      ).value;
      // Send request to update user
      fetch(`/admin/users/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername, newPassword, newDuration }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    });
  }

  // Add event listener for add users to database button
  const addUsersToDbBtn = document.getElementById("add-users-to-db-btn");
  addUsersToDbBtn.addEventListener("click", () => {
    // Send request to add users to database
    fetch("/admin/add-users-to-db", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  });

  // Add event listener for clear file button
  const clearFileBtn = document.getElementById("clear-file-btn");
  clearFileBtn.addEventListener("click", () => {
    // Send request to clear file
    fetch("/admin/clear-file", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  });
}
