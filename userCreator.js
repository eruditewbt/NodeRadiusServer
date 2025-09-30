import fs from "fs";
import { genSalt, hash } from "bcryptjs";
import { randomBytes } from "crypto";
import db from "db.js";

class UserManager {
  constructor(db) {
    this.db = db;
    this.filePath = "users.txt";
  }

  // Generate a unique username and password
  generateCredentials() {
    const username = `user${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const password = randomBytes(12).toString("hex");
    return { username, password };
  }

  // Hash a password
  async hashPassword(password) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
  // Check if credentials already exist in the file
  async checkCredentialsInFile(username, password) {
    return new Promise((resolve) => {
      fs.readFile(this.filePath, "utf8", (err, data) => {
        if (err) {
          resolve(false);
        } else {
          const lines = data.split("\n");
          const existingCredential = lines.find(
            (line) => line.includes(username) && line.includes(password)
          );
          resolve(!!existingCredential);
        }
      });
    });
  }

  // Write credentials to file if they don't already exist
  async writeToFile(username, password) {
    const exists = await this.checkCredentialsInFile(username, password);
    if (!exists) {
      fs.appendFile(
        this.filePath,
        `Username: ${username}, Password: ${password}\n`,
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    }
  }

  // Create a new user based on file content
  async createUserFromFile(duration) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, "utf8", async (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const lines = data.split("\n");
          for (const line of lines) {
            if (line) {
              const [username, password] = line
                .replace("Username: ", "")
                .replace("Password: ", "")
                .split(", ");
              const hashedPassword = await hashPassword(password);
              const userId = uuidv4();
              const stmt = db.prepare(
                "INSERT INTO users (id, username, password, duration, startTime, ipAddress, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
              );
              stmt.run(
                userId,
                username,
                hashedPassword,
                duration,
                new Date().toISOString(),
                "",
                0
              );
              stmt.finalize((err) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`User created: ${username}`);
                }
              });
            }
          }
          resolve();
        }
      });
    });
  }

  // Generate and write credentials to file, then create user
  async generateAndCreateUser(duration) {
    const { username, password } = this.generateCredentials();
    await this.writeToFile(username, password);
    await this.createUserFromFile(duration);
  }

  // Track user information
  async trackUserInfo() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const totalUsers = rows.length;
          const activeUsers = rows.filter((row) => row.status === 1).length;
          const nonActiveUsers = rows.filter((row) => row.status === 0).length;
          const zeroDurationUsers = rows.filter(
            (row) => row.duration === 0
          ).length;
          const userInfo = {
            totalUsers,
            activeUsers,
            nonActiveUsers,
            zeroDurationUsers,
          };
          console.log(userInfo);
          resolve(userInfo);
        }
      });
    });
  }

  async deleteUsers(condition) {
    return new Promise((resolve, reject) => {
      let query = "DELETE FROM users WHERE ";
      switch (condition) {
        case "zeroDuration":
          query += "duration = 0";
          break;
        case "nonActive":
          query += "status = 0";
          break;
        case "all":
          query = "DELETE FROM users";
          break;
        default:
          reject(new Error("Invalid condition"));
          return;
      }
      db.run(query, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(`Users deleted successfully`);
          resolve();
        }
      });
    });
  }
}

export default UserManager;
