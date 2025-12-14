const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let state = { departments: {} };

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", socket => {
  socket.emit("state:init", state);

  socket.on("state:update", newState => {
    state = newState;
    socket.broadcast.emit("state:init", state);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
