@echo off
setlocal enabledelayedexpansion

echo Welcome to NodeRadiusServer
echo Detected you are using a Windows device
echo You can either setup for your current Windows computer or router

:: Ask your choice
echo Which device do you want to setup for?
echo Note that installing for Windows requires arpjs which requires node-gyp and a dev env
set /p ans=If you want to setup for device network enter D or d for router network enter R or r:

if /i "!ans!"=="d" (
  echo You are setting up for your current Windows device.
  echo Overwriting config content ...
  copy /y windows.js platform.js
  echo Overwriting successful
) else if /i "!ans!"=="r" (
  echo You are setting up for your router.
  echo Overwriting config content ...
  copy /y router.js platform.js
  copy /y config.txt package.json
  echo Overwriting successful
) else (
  echo Invalid input. Exiting program.
  exit /b 1
)

:: Run a setup script
echo Get ready to install required dependencies.
echo NOTE: This requires a good internet connection to complete successfully.
echo Do you want to continue? (y/n)
set /p continue=^>

if /i "!continue!"=="y" (
  echo Installing Node.js dependencies on your current Windows device.
  echo Starting...
) else (
  echo Invalid input. Exiting program.
  exit /b 1
)

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel%==1 (
  echo Node.js is not installed. Installing...
  :: Install Node.js (using chocolatey)
  @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"         
  choco install nodejs
) else (
  echo Node.js is already installed.
)

:: Check if npm is installed
where npm >nul 2>&1
if %errorlevel%==1 (
  echo npm is not installed. Please install Node.js which includes npm.
) else (
  echo npm is already installed.
)

:: Verify Node.js and npm versions
node -v
npm -v

:: Installing dependencies
echo Installing Node.js dependencies on your current Windows device.
npm install
echo Installation completed.

if /i "!ans!"=="d" (
  echo You are setting up arpjs for your current Windows device.
  echo Installing arpjs ...
  npm install arpjs
  if %errorlevel%==0 (
    echo ARP installed successfully.
  ) else (
    echo Installation failed.
    exit /b 1
  )
  echo You are setting up firewall rule for your current Windows device to listen on port 8000 .
  netsh advfirewall firewall add rule name="Captive Portal" dir=in action=allow protocol=TCP localport=8000
) else (
  echo ARP installation and firewall setup not required.
)

echo ALL installation and setup completed successfully.
echo Let's move to starting the server.
set /p server=Do you want to start the server? (y/n)
if /i "!server!"=="y" (
  echo NodeRadiusServer is starting on your Windows device IP address.
  echo Starting server...
  for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "ipv4"') do (
    set "IP_ADDRESS=%%a"
    goto :start_server
  )
  :start_server
  set "IP_ADDRESS=!IP_ADDRESS:~1!"
  echo Server started at !IP_ADDRESS!:80
  start npm start
  echo Enter 'k' to kill the server.
  :loop
  set /p input=^>
  if /i "!input!"=="k" (
    taskkill /im node.exe
    echo Server stopped.
  ) else (
    echo Invalid input. Please enter 'k' to kill the server.
    goto :loop
  )
) else (
  echo Invalid input. Exiting program.
  exit /b 1
)