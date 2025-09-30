// windows install netsh
import childProcess from "child_process";
import { destroyJob } from "../schedule.js";

import {
  updateUserDuration,
  callback,
  getUserById,
} from "query.js";
import { activeUsers } from "../user.js";

function getArp(){
  try {
  const arp = require('arpjs');
  return arp
} catch (error) {
  console.error('Error importing Arpjs module:', error);
}
}
const arp = getArp()
// Allow connection and delete
// const userIpAddress = "192.168.1.100";
// addip
function addIp(userIpAddress) {
  const netshCmd = `netsh advfirewall firewall add rule name="Allow ${userIpAddress}" dir=in action=allow remoteip=${userIpAddress}`;
  childProcess.exec(netshCmd, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Windows Firewall rule added");
    }
  });
}

// delete
function deleteIp(userIpAddress) {
  const netshCmd = `netsh advfirewall firewall delete rule name="Allow ${userIpAddress}"`;
  childProcess.exec(netshCmd, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Windows Firewall rule deleted");
    }
  });
}

// const userIpAddress = "192.168.1.100";

// const ipAddresses = ["192.168.1.100", "192.168.1.101", "192.168.1.102"];

// calculate remaining duration
function calculateRemainingDuration(totalDuration, startTime) {
  const startTimeDate = new Date(startTime);
  const currentTime = new Date();
  const elapsedTime = currentTime.getTime() - startTimeDate.getTime();
  const remainingDuration = totalDuration * 1000 - elapsedTime; // Convert totalDuration to ms
  return Math.max(remainingDuration, 0); // Ensure remaining duration is not negative
}

// Scan ARP table
async function scanArpTable(users) {
  try {
  arp.get((err, arpTable) => {
    if (err) {
      console.error(err);
    } else {
      users.forEach((user) => {
        const userMacAddress = arpTable.find(
          (entry) => entry.ip === user.ipAddress
        );
        if (!userMacAddress) {
          const userId = user.id;
          deleteIp(userId);
          if (userId) {
            activeUsers.removeUser(userId);
            const user = getUserById(userId, callback);
            const duration = calculateRemainingDuration(
              user.duration,
              user.startTime
            );
            updateUserDuration(userId, duration, callback);
            destroyJob(userId);
          }
        }
      });
    }
  });
  } catch (error) {
  console.error('Error loading problematic file:', error);
}

}


export { deleteIp, addIp, scanArpTable, calculateRemainingDuration };