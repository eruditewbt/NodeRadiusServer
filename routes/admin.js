
import { Router } from "express";
const router = Router();
import UserManager from "./UserManager";

// Monitor currently connected users
router.get("/admin/users", async (req, res) => {
  try {
    const users = await UserManager.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Display content of file
router.get("/admin/file", async (req, res) => {
  try {
    const fileContent = await UserManager.readFile();
    res.json(fileContent);
  } catch (err) {
    res.status(500).json({ message: "Error reading file" });
  }
});

// Remove a current user
router.delete("/admin/users/:username", async (req, res) => {
  try {
    await UserManager.removeUser(req.params.username);
    res.json({ message: "User removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing user" });
  }
});

// Add a new user
router.post("/admin/users", async (req, res) => {
  try {
    await UserManager.addUser(req.body);
    res.json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding user" });
  }
});

// Write user to file
router.post("/admin/write-to-file", async (req, res) => {
  try {
    await UserManager.writeToFile(req.body.username, req.body.password);
    res.json({ message: "User written to file successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error writing to file" });
  }
});

// Add users in file to database
router.post("/admin/add-users-to-db", async (req, res) => {
  try {
    await UserManager.createUserFromFile();
    res.json({ message: "Users added to database successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding users to database" });
  }
});

// Clear file
router.delete("/admin/clear-file", async (req, res) => {
  try {
    await UserManager.clearFile();
    res.json({ message: "File cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing file" });
  }
});

// Edit file
router.put("/admin/edit-file", async (req, res) => {
  try {
    await UserManager.editFile(req.body);
    res.json({ message: "File edited successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error editing file" });
  }
});

export default router;
