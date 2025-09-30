#!/bin/bash
echo "welcome to noderadiusserver"
echo "detected you are using a Linux device"
echo "you can either setup for your current Linux computer or router"
# ask user setup choice
echo "which device to you want to setup for"
echo "note that installing for Linux requires arp.js which requires c/c++ and a dev env"
read -p "if you want to set up for device network enter D or d  for router network enter R or r > " ans

# Check multiple conditions
if [ "$ans" == "D" ] || [ "$ans" == "d" ]; then
  echo "You are setting up for your current Linux device."
  echo "Overwriting config content ..."
  # Overwrite content
  cat linux.js > platform.js
elif [ "$ans" == "R" ] || [ "$ans" == "r" ]; then
  echo "You are setting up for your router."
  echo "Overwriting config content ..."
  # Overwrite content
  cat router.js > platform.js
  cat config.txt > package.json
  echo "overwriting sucessful"
else
  echo "invalid input exiting program."
  exit 1
fi

# Run a setup script
echo "get ready to install required dependency"
echo " NOTE: this requires good internet connection to complete successfully"
echo "do you want to continue? if yes, y or Y if no, n or N "
read -p "> " continue

if [ "$continue" == "y" ] || [ "$continue" == "Y" ]; then
  echo "installing node dependency on your current Linux device."
  echo "starting ..."
else
  echo "invalid input exiting program."
  exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Installing..."
  # Install Node.js (using a package manager like apt or brew)
  if command -v pkg &> /dev/null; then
    pkg install nodejs
  elif command -v apt &> /dev/null; then
    sudo apt update
    sudo apt install -y nodejs npm
  elif command -v brew &> /dev/null; then
    brew install node
  else
    echo "Unsupported package manager. Please install Node.js manually."
    exit 1
  fi
else
  echo "Node.js is already installed."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "npm is not installed. Installing..."
  # Install npm (usually comes with Node.js)
  if command -v pkg &> /dev/null; then
    pkg install nodejs
  elif command -v apt &> /dev/null; then
    sudo apt install -y npm
  elif command -v brew &> /dev/null; then
    brew install node
  else
    echo "Unsupported package manager. Please install npm manually."
    exit 1
  fi
else
  echo "npm is already installed."
fi

# Verify Node.js and npm versions
if [ $? -eq 0 ]; then
    echo "Node.js and npm installed successfully."
    # Continue with other procedures
    node -v
    npm -v
else
  echo "Installation failed."
  exit 1
fi

# installing dependencies
echo "installing node dependency on your current Linux device."
npm install
echo "installation completed"


if [ "$ans" == "D" ] || [ "$ans" == "d" ]; then
  echo "You are setting up arpjs for your current Linux device."
  echo "installing arpjs ..."
  # installing arp
  npm install arpjs
  if [ $? -eq 0 ]; then
    echo "ARP  installed successfully."
    # Continue with other procedures
  else
    echo "Installation failed."
    exit 1
  fi
  echo "You are setting up iptable rules for your current Linux device to forward to port 8000. "
  iptables -t nat -A PREROUTING -p tcp --dport 8000 -j DNAT --to-destination 192.168.1.1:8000
  iptables -A FORWARD -p tcp --dport 8000 -j ACCEPT
else
  echo "ARP  installation not required ."
fi

echo "ALL installation completed successfully."
echo "Let's move to starting the server "
echo "do you want to start the server? if yes, y or Y if no, n or N "
read -p "> " server

if [ "$server" == "y" ] || [ "$server" == "Y" ]; then
  echo "NodeRadiusServer is starting on your Linux device ipadress."
  echo "starting server ..."
  IP_ADDRESS=$(hostname -I | awk '{print $1}')
PORT=8000
  echo "Server started at $IP_ADDRESS:$PORT"
else
  echo "invalid input exiting program."
  exit 1
fi

PORT=8000

# Function to start the server
start_server() {
  npm start &
  SERVER_PID=$!
  echo "Server started on port $PORT with PID $SERVER_PID"
}

# Function to stop the server
stop_server() {
  PID=$(ps -ef | grep node | grep -v grep | awk '{print $2}')
  if [ -n "$PID" ]; then
    kill $PID
    echo "Server stopped successfully."
  else
    echo "No server running."
  fi
}


# Start the server
start_server

# Keep listening for input to stop the server
while true; do
  read -p "Enter 's' to stop the server: " input
  if [ "$input" = "s" ] || [ "$input" = "S" ]; then
    stop_server
    break
  else
    echo "Invalid input. Please enter 's' to stop the server."
  fi
done