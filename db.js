import { Database } from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

// Function to hash a password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Create a new database instance
const db = new Database("./user.db");

// Serialize database operations
db.serialize(() => {
  // Create a table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      password TEXT,
      duration INTEGER,
      startTime TEXT,
      ipAddress TEXT,
      status INTEGER, 
    );
  `);

  // Insert data into the table
  const userId = uuidv4();
  const stmt = db.prepare(
    "INSERT INTO users (id, username, password, duration, startTime, ipAddress, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(
    userId,
    "johnDoe",
    hashPassword("password123"),
    3600000,
    new Date().toISOString(),
    "192.168.1.100",
    0
  );
  stmt.run(
    uuidv4(),
    "janeDoe",
    hashPassword("password456"),
    7200000,
    new Date().toISOString(),
    "192.168.1.101",
    0
  );
  stmt.finalize();

  // Query the table
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Database connection closed");
  }
});

export default db;
