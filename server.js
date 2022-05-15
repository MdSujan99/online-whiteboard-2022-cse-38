// set up port
port = 3000;

// load the express module
const express = require("express");
const app = express();

// serves static files
app.use(express.static("public"));

const server = app.listen(port, function (error) {
  if (error) {
    console.log("Error:" + error);
  } else {
    console.log("listening on port:" + port);
    console.log("Link: \nhttp://localhost:" + port);
  }
});

const socket = require("socket.io");
const io = socket(server); // can say the server's socket

io.on("connection", (socket) => {
  console.log("A new user connectd\n\tsocketID:\t" + socket.id);
  const id = socket.id;
  socket.on("mouseData", (data) => {
    socket.broadcast.emit("mouseData", data);
  });
  socket.on("disconnect", (socket) => {
    // console.log(socket.id + " disconnected");
    console.log(id + " disconnected");
  });
});

