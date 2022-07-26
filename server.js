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
  socket.on("joinRoom", (roomName, username) => {
    socket.join(roomName);
    const user = {
      username: username,
      id: socket.id,
    };
    users.push(user);
    io.emit("newUser", users);
  });

  //exits the client from meeting
  socket.on("exitMeeting", () => {
    console.log("disconnecting socket " + socket);
    socket.disconnect();
  });

  // recieved mouse data for drawing
  socket.on("sendMouseData", (sender, roomName, data) => {
    console.log(
      "sendMouseData\nsender: " + sender + " | roomName: " + roomName
    );
    // console.log(users[0]. + " " + users[0].id);
    if (sender == users[0].username && socket.id == users[0].id) {
      console.log("host sending drawing");
      socket.to(roomName).emit("newMouseData", data);
    } else socket.to(roomName).emit("accessNotGranted", "sendMouseData");
  });

  socket.on("disconnecting", () => {
    console.log("disconnecting:\t" + socket.rooms);
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    // update the users list
    users = users.filter((u) => u.id !== socket.id);
    io.emit("newUser", users);
  });

  socket.on("clearCanvas", (sender, roomName) => {
    console.log("clearCanvas\nsender: " + sender + " | roomName: " + roomName);
    if (sender == users[0].username && socket.id == users[0].id) {
      console.log("Clearing canvas");
      socket.to(roomName).emit("clearCanvas", sender, roomName);
    } else {
      socket.to(roomName).emit("accessNotGranted", "clearCanvas");
    }
  });
});
