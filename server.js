// port for running
port = process.env.PORT || 3000;

// load the express module
const express = require("express");
const app = express();

var server = app.listen(port, (error) => {
  if (error) {
    console.log("Error:" + error);
  } else {
    console.log("listening on port:" + port);
  }
});

app.use(express.static("public"));

const socket = require("socket.io");
const io = socket(server); // can say the server's socket
var users = [];

// when a socket joins the server
io.on("connection", (socket) => {
  console.log("A new user connectd\n\tsocketID:\t" + socket.id);

  //join the socket to their given room
  socket.on("join room", (roomName) => {
    socket.join(roomName);
  });
  socket.on("end meeting", (room) => {
    socket.leave(room);
    io.close();
  });
  // recieved mouse data for drawing
  socket.on("mouseData", (data) => {
    console.log("room: ", data.roomName);
    io.to(data.roomName).emit("mouseData", data);
  });

  socket.on("disconnecting", () => {
    console.log(socket.rooms);
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
  });

  socket.on("clearCanvas", (room) => {
    socket.to(room).emit("clearCanvas");
  });
});
