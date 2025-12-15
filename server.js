const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

/* 🔐 SHARED SERVER MEMORY (SOURCE OF TRUTH) */
let sharedState = {
  departments: {
    Default: Array.from({ length: 100 }, (_, i) => ({
      name: String(i + 1),
      active: false,
      working: false,
      transition: false
    }))
  }
};

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", socket => {
  console.log("User connected");

  // Send current state to new user
  socket.emit("state:init", sharedState);

  // Receive updates from any user
  socket.on("state:update", newState => {
    sharedState = newState;
    socket.broadcast.emit("state:init", sharedState);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
