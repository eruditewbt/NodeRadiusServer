import db from "db.js";

// Function to refresh user data
function refreshUserData(userId, callback) {
  db.get("SELECT * FROM users WHERE id = ?", userId, (err, row) => {
    if (err) {
      callback(err);
    } else {
      callback(null, row);
    }
  });
}

// Function to update user duration
function updateUserDuration(userId, duration, callback) {
  db.run(
    "UPDATE users SET duration = ?, status = 0  WHERE id = ?",
    duration,
    userId,
    (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    }
  );
}


// Function to update user last logout time
function updateUserLastLogout(userId, callback) {
  db.run(
    "UPDATE users SET lastLogout = ? WHERE id = ?",
    new Date().toISOString(),
    userId,
    (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    }
  );
}

// Function to get all users
function getAllUsers(callback) {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

// Function to get user by username
function getUserByUsername(username, callback) {
  db.get("SELECT * FROM users WHERE username = ?", username, (err, row) => {
    if (err) {
      callback(err);
    } else {
      callback(null, row);
    }
  });
}

// Function to delete user
function deleteUser(userId, callback) {
  db.run("DELETE FROM users WHERE id = ?", userId, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

function getActiveUsers(callback) {
  db.all("SELECT * FROM users WHERE status = 1", (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

function getUserById(userId, callback) {
  db.get("SELECT * FROM users WHERE userId = ?", userId, (err, row) => {
    if (err) {
      callback(err);
    } else {
      callback(null, row);
    }
  });
}

function getDurationById(userId, callback) {
  db.get(
    "SELECT duration FROM users WHERE userId = ?",
    userId,
    (err, duration) => {
      if (err) {
        callback(err);
      } else {
        callback(null, duration);
      }
    }
  );
}

function resetUser(userId, callback) {
  db.run(
    "UPDATE users SET duration = 0, status = 0 WHERE id = ?",
    userId,
    (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    }
  );
}

// Function to update user data
function updateUserData(userId, ipAddress, callback) {
  const startTime = new Date().toISOString();
  db.run('UPDATE users SET startTime = ?, ipAddress = ?, status = 1 WHERE id = ?', startTime, ipAddress, userId, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

      // id TEXT PRIMARY KEY,
      // username TEXT,
      // password TEXT,
      // duration INTEGER,
      // startTime TEXT,
      // ipAddress TEXT,
      // status INTEGER, 
function getActiveUserIps(callback) {
  db.all("SELECT ipAddress FROM users WHERE status = 1", (err, rows) => {
    if (err) {
      callback(err);
    } else {
      const ipAddresses = rows.map((row) => row.ipAddress);
      callback(null, ipAddresses);
    }
  });
}

function callback(err, data) {
  if (err) {
    console.error(err);
  } else if (data) {
    console.log("User data successfully queried");
    return data;
  } else {
    console.log("Query successfully executed");
  }
}

export {
  refreshUserData,
  updateUserDuration,
  updateUserLastLogout,
  getAllUsers,
  getUserByUsername,
  deleteUser,
  callback,
  getActiveUserIps,
  getActiveUsers,
  getUserById,
  resetUser,
  updateUserData,
};

// // Example usage
// const userId = 'some-user-id';

// refreshUserData(userId, (err, userData) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(userData);
//   }
// });

// updateUserDuration(userId, 3600, (err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('User duration updated');
//   }
// });

// updateUserLastLogout(userId, (err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('User last logout updated');
//   }
// });

// getAllUsers((err, users) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(users);
//   }
// });

// getUserByUsername('johnDoe', (err, user) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(user);
//   }
// });

// deleteUser(userId, (err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('User deleted');
//   }
// });

// // Close the database connection
// db.close((err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Database connection closed');
//   }
// });
