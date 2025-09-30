import { Router } from "express";
const router = Router();
import bcrypt from "bcrypt";

// const {deleteIp} = require("linux.js")
// const { deleteIp } = require("window.js");
// import {deleteIp, scanArpTable, calculateRemainingDuration } from "../window.js";
import {deleteIp, scanArpTable, calculateRemainingDuration } from "../platform.js";

import {
  updateUserDuration,
  callback,
  updateUserData,
  getActiveUsers,
  getUserById,
} from "query.js";
import db from "../db.js";
import { activeUsers } from "../user.js";
import { destroyJob, persistAddScheduleDelete } from "../schedule.js";


//get all active user in db
const userDataList = getActiveUsers(callback);
activeUsers.addUsers(userDataList);

// Scan ARP table every 5 minutes
var ipAddresses = activeUsers.getIpAddresses();
setInterval(async () => {
  var ipAddresses = activeUsers.getIpAddresses();
  await scanArpTable(ipAddresses);
  }, 5 * 60 * 1000); // 5 minutes
scanArpTable(ipAddresses);


// Route for the base URL (home page)
router.get("/", (req, res) => {
  res.render("index", { date: new Date().getFullYear() });
});

// login route
router.post("/login", (req, res) => {
  const userIpAddress = req.ip;
  // or for proxy
  // const userIpAddress = req.headers["x-forwarded-for"];
  const username = req.body.username;
  const password = req.body.password;

  db.get("SELECT * FROM users WHERE username = ?", username, (err, row) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    } else if (!row) {
      res
        .status(401)
        .json({ message: "Invalid username or password", success: false });
    } else if (row.status) {
      res
        .status(401)
        .json({ message: "User Is currently Active", success: false });
    } else {
      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
        } else if (!result) {
          res
            .status(401)
            .json({ message: "Invalid username or password", success: false });
        } else {
          // add new user to active user
          activeUsers.addUser(row.id, userIpAddress);
          //schedule
          persistAddScheduleDelete(row.id, userIpAddress, row.duration);
          //update user data in db
          updateUserData(row.id, userIpAddress, (err) => {
            if (err) {
              res
                .status(500)
                .json({ message: "Internal Server Error", success: false });
            } else {
              res.json({ success: true });
            }
          });
        }
      });
    }
  });
});


// logout route
router.get("/logout", async (req, res) => {
  const userIpAddress = req.ip;
  // get active user id
  const userId = activeUsers.getUserId(userIpAddress);
  deleteIp(userIpAddress);
  if (userId) {
    activeUsers.removeUser(userId);
    const user = getUserById(userId, callback);
    const duration = calculateRemainingDuration(user.duration, user.startTime);
    updateUserDuration(userId, duration, callback);
    destroyJob(userId);
    return res.redirect("/");
  }
  return res.redirect("/status");
});

export default router;

// // Send authentication request to RADIUS server
// const reqRadius = radius.createRequest({
//   code: "Access-Request",
//   secret: "mysecret",
//   attributes: {
//     "User-Name": username,
//     "User-Password": password,
//   },
// });

// // Handle response from RADIUS server
// radius.send(reqRadius, "localhost", 1812, (err, response) => {
//   if (err) {
//     res.json({ success: false });
//   } else {
//     if (response.code === "Access-Accept") {
//       res.json({ success: true });
//     } else {
//       res.json({ success: false });
//     }
//   }
// });
