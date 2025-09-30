# Usage 
# Automatic Setup
-- windows
click setup.bat
$ setup.bat

-- Linux 
$ chmod +x setup.sh

-- router
contact manufacturer for router details
const routerIp = 'http:'
const apiEndpoint = '//192.168.0.1';
const apiRoute = '/api/firewall/rules';
const apiDevices = `/api/devices`;
const username = 'admin';
const password = 'password';

Then edit router.js file and rerun windows of linux setup

# Manual Setup
# Install Dependencies
$ npm install


# Install Required software if not present

- linux
dnsmasq
iptables
$ npm install arpjs

- windows
netsh
$ npm install arpjs

- router
check router configuration
not needed
--

# Configure to redirect HTTP requests to your captive portal server on port 8000

# comment unrequired import
// const {deleteIp} = require("linux.js")
// import {deleteIp, scanArpTable, calculateRemainingDuration } from "../window.js";
import {deleteIp, scanArpTable, calculateRemainingDuration } from "../platform.js";

- linux
# dnsmasq.conf file
dhcp-range=192.168.1.100,192.168.1.200,255.255.255.0,12h
dhcp-option=3,192.168.1.1
address=/#/192.168.1.1

# iptables rules
$ iptables -t nat -A PREROUTING -p tcp --dport 8000 -j DNAT --to-destination 192.168.1.1:8000
$ iptables -A FORWARD -p tcp --dport 8000 -j ACCEPT


- windows
$ netsh advfirewall firewall add rule name="Captive Portal" dir=in action=allow protocol=TCP localport=8000


- router
contact manufacturer

--

# Start Connection Server
$ npm start