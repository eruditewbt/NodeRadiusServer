// Scheduled delete

// `setTimeout` function to schedule a task to run after a specified amount of time.
// npm install node-cron

// const {deleteIp, addIp} = require("linux.js")
import { deleteIp, addIp } from "window.js";
import cron from "node-cron";
import { getDurationById, callback, resetUser } from "query.js";



// Delete rule after 8 hours

function addScheduleDelete(userId,userIpAddress, TimeoutMs) {
  addIp(userIpAddress);
  setTimeout(() => {
    const duration = getDurationById(userId, callback);
    if (duration === TimeoutMs) {
      deleteIp(userIpAddress);
      resetUser(userId, callback);
    }
  }, TimeoutMs);
}

// ## Persistent Scheduling
const jobMap = new Map();
// ##  with node-cron
// using `node-cron` to schedule a task to delete the rule after 8 hours:
function persistAddScheduleDelete(userId, userIpAddress, TimeoutMs) {
  addIp(userIpAddress);
  const currentTime = new Date();
  const deleteTime = new Date(currentTime.getTime() + TimeoutMs);

  // Schedule task to delete rule
  const cronExpression = `${deleteTime.getMinutes()} ${deleteTime.getHours()} * * *`;
  const job = cron.schedule(cronExpression, () => {
    const duration = getDurationById(userId, callback);
    if (duration === TimeoutMs) {
      deleteIp(userIpAddress);
      resetUser(userId, callback);
      destroyJob(userId);
    }
  });
  // schedule a job and store it in the map
  jobMap.set(userId, job);
}

// When a user logs out, destroy the job
function destroyJob(userId) {
  const job = jobMap.get(userId);
  if (job) {
    jobMap.delete(userId);
    job.destroy();
  }
}

export { addScheduleDelete, persistAddScheduleDelete, destroyJob };