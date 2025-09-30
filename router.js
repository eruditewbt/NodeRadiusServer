
import axios from 'axios';
import { destroyJob } from "../schedule.js";
import {
  updateUserDuration,
  callback,
  getUserById,
} from "query.js";
import { activeUsers } from "../user.js";

const routerIp = 'http:'
const apiEndpoint = '//192.168.0.1';
const apiRoute = '/api/firewall/rules';
const apiDevices = `/api/devices`;
const username = 'admin';
const password = 'password';

const addIp = async (ip) => {
  try {
    const response = await axios.post(`${routerIp}${apiEndpoint}${apiRoute}`, {
      'action': 'allow',
      'src_ip': ip,
      'dst_ip': 'any',
      'protocol': 'any',
    }, {
      auth: {
        username: username,
        password: password,
      },
    });
    console.log(`IP address ${ip} allowed`);
  } catch (error) {
    console.error(error);
  }
};

const deleteIp = async (ip) => {
  try {
    const response = await axios.delete(`${routerIp}${apiEndpoint}${apiRoute}`, {
      data: {
        'src_ip': ip,
      },
      auth: {
        username: username,
        password: password,
      },
    });
    console.log(`IP address ${ip} removed`);
  } catch (error) {
    console.error(error);
  }
};

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

async function getConnectedDevices() {
  try {
    const response = await axios.get(`${routerIp}${apiEndpoint}${apiDevices}` {
      auth: {
        username: username,
        password: password,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
// Scan ip in router
async function scanArpTable(users) {
  try {
    const connectedDevices = await getConnectedDevices();
    const connectedIpAddresses = connectedDevices.map((device) => device.ipAddress);

        users.forEach((user) => {
          if (!connectedIpAddresses.includes(user.ipAddress)) {
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
  } catch (error) {
    console.error(error);
  }
}

export { deleteIp, addIp, scanArpTable, calculateRemainingDuration };