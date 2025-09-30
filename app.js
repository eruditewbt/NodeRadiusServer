// server.js;
const express = require("express");
const app = express();
// const radius = require("radius");


// routes
import loginRoutes from "./routes/login.js";
import statusRoutes from "./routes/status.js";
import infoRoutes from "./routes/info.js";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// views with  hbs
app.set("view engine", "hbs");
app.set("views", join(__dirname, "views"));

// Serve static files from the 'public' directory
const publicDir = join(__dirname, "public");
app.use(express.static(publicDir));

// routes
app.use(loginRoutes);
app.use(statusRoutes);
app.use(infoRoutes);

app.listen(80, () => {
  console.log("Captive portal server listening on port localhost:80");
});
