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
    socket.join('myRoom');
  console.log("A new user connectd\n\tsocketID:\t" + socket.id);
  const id = socket.id;
  socket.on("mouseData", (data, room) => {
    if ((room == "")) {
      console.log("no room");
      socket.broadcast.emit("mouseData", data);
    } else {
        console.log("room: ",room);
        socket.to(room).emit("mouseData", data);
    }
  });
  socket.on("disconnecting", () => {
    console.log(socket.rooms); 
  });
  socket.on("disconnect", (socket) => {
    console.log(id + " disconnected");
  });
});
