class ActiveUsers {
  constructor() {
    this.users = new Map();
  }

  // Add a new user
  addUser(userId, ipAddress) {
    this.users.set(userId, ipAddress);
  }

  // Add multiple users from a list of user data
  addUsers(userDataList) {
    userDataList.forEach((userData) => {
      this.addUser(userData.id, userData.ipAddress);
    });
  }

  // Get the IP address of a user
  getIp(userId) {
    return this.users.get(userId);
  }

  // Get the user ID of an IP address
  getUserId(ipAddress) {
    for (const [userId, ip] of this.users) {
      if (ip === ipAddress) {
        return userId;
      }
    }
    return null;
  }

  // Get a list of all IP addresses
  getIpAddresses() {
    return Array.from(this.users.values());
  }

  // Get a list of all user IDs
  getUserIds() {
    return Array.from(this.users.keys());
  }

  // Get a list of all active users
  getActiveUsers() {
    return Array.from(this.users.entries()).map(([userId, ipAddress]) => ({
      id: userId,
      ipAddress,
    }));
  }

  // Remove a user
  removeUser(userId) {
    this.users.delete(userId);
  }

  // Remove multiple users
  removeUsers(userIds) {
    userIds.forEach((userId) => {
      this.removeUser(userId);
    });
  }
}

const activeUsers = new ActiveUsers;

export { activeUsers, ActiveUsers };

// // Example usage
// const activeUsers = new ActiveUsers();

// // Add a new user
// activeUsers.addUser("user1", "192.168.1.100");

// // Add multiple users
// const userDataList = [
//   { id: "user2", ipAddress: "192.168.1.101" },
//   { id: "user3", ipAddress: "192.168.1.102" },
// ];
// activeUsers.addUsers(userDataList);

// // Get IP address of a user
// console.log(activeUsers.getIp("user1")); // Output: 192.168.1.100

// // Get user ID of an IP address
// console.log(activeUsers.getUserId("192.168.1.101")); // Output: user2

// // Get list of IP addresses
// console.log(activeUsers.getIpAddresses()); // Output: ['192.168.1.100', '192.168.1.101', '192.168.1.102']

// // Get list of user IDs
// console.log(activeUsers.getUserIds()); // Output: ['user1', 'user2', 'user3']

// // Get list of active users
// console.log(activeUsers.getActiveUsers());
// // Output: [{ id: 'user1', ipAddress: '192.168.1.100' }, { id: 'user2', ipAddress: '192.168.1.101' }, { id: 'user3', ipAddress: '192.168.1.102' }]
