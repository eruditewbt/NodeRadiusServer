import { Router } from "express";
const router = Router();
import {
  updateUserDuration,
  callback,
  updateUserData,
  getActiveUsers,
  getUserById,
} from "query.js";

import { activeUsers } from "../user.js";


router.get("/status", (req, res) => {
  const userIpAddress = req.ip;
  // get active user id
  const userId = activeUsers.getUserId(userIpAddress);
  
  const user = getUserById(userId, callback); 

  const statusData = {
    username: user.username,
    ipAddress: userIpAddress,
    loginTime: user.loginTime,
    duration: user.duration,
    status: user.status,
  };
  res.render("status", { statusData });
});


export default router;