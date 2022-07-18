// port for running
port = process.env.PORT || 3000;
// port = 3000;

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
let users = [];

// when a socket joins the server
io.on("connection", (socket) => {
  console.log("A new user connectd\n\tsocketID:\t" + socket.id);

  //join the socket to their given room
  socket.on("join room", (roomName, username) => {
    socket.join(roomName);
    const user = {
      username: username,
      id: socket.id,
    };
    users.push(user);
    io.emit("new user", users);
  });
  socket.on("end meeting", () => {
    console.log("disconnecting socket " + socket);
    socket.disconnect();
  });

  // recieved mouse data for drawing
  socket.on("sendMouseData", (sender, roomName, data) => {
    console.log("sender: " + sender + " | roomName: " + roomName);
    if (sender == users[0].username && socket.id == users[0].id)
      socket.to(roomName).emit("newMouseData", data);
    else socket.to(roomName).emit("acces not granted");
  });

  socket.on("disconnecting", () => {
    console.log(socket.rooms);
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    users = users.filter((u) => u.id !== socket.id);
    io.emit("new user", users);
  });

  socket.on("clearCanvas", (room) => {
    socket.to(room).emit("clearCanvas");
  });
});
