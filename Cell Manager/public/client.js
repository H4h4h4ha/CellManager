const socket = io();

// Receive shared state
socket.on("state:init", serverState => {
  window.departments = serverState.departments;
  renderPage();
  updateTicker();
});

// Send updates to server
function syncState() {
  socket.emit("state:update", {
    departments: window.departments
  });
}
