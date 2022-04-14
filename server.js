const express = require('express');
const app = express();
port = 3000;

const server = app.listen(port, function(error){
    if (error){
        console.log("Error:"+error);
    }else{
        console.log("listening on port:"+port);
    }
});

app.use(express.static('public'));

const socket = require('socket.io');
const io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log("A new user connectd: new user socket id:\t"+socket.id);
    socket.on('mouseData', mouseMessage);

    function mouseMessage(data){
        console.log("Server received:"+data.x+" "+data.y);
        socket.broadcast.emit('mouseData', data);

    }
}