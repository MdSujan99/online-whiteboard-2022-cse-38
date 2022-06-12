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
    // console.log("Link: \nhttp://localhost:" + port);
  }
});

app.use(express.static("public"));

const socket = require("socket.io");
const io = socket(server); // can say the server's socket

io.on("connection", (socket) => {
  const room = "myRoom";
  socket.join(room);
  console.log("A new user connectd\n\tsocketID:\t" + socket.id);
  socket.on("mouseData", (data) => {
    if (room == "") {
      console.log("no room");
      socket.broadcast.emit("mouseData", data);
    } else {
      console.log("room: ", room);
      socket.to(room).emit("mouseData", data);
    }
  });
  socket.on("disconnecting", () => {
    console.log(socket.rooms);
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
  });
  socket.on("clearCanvas", () => {
    socket.to(room).emit("clearCanvas");
  });
});
