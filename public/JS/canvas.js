// when window loads
window.addEventListener("load", () => {
  // Tools and btns \ ----------------------------------------------------
  const penMarker = document.getElementById("btn_marker");
  // const shapeLine = document.getElementById("btn_line");
  // const shapeCircle = document.getElementById("btn_circle");
  // const shapeRect = document.getElementById("btn_rect");
  const colorPicker = document.getElementById("colorPicker");
  const btnEraser = document.getElementById("btn_eraser");
  const btnResetCanvas = document.getElementById("btn_cls");
  // drawing variables/constants
  var myStrokeColor = "black";
  var myStrokeSize = 5;
  var myStrokeShape = "round";
  // meeting controls
  var btn_exitMeeting = document.getElementById("btn_exitMeeting");
  // Meeting details
  var params = window.location.search.split("?")[1].split("&");
  params = params.map((item) => item.split("="));
  const roomDetails = {
    roomName: params[0][1],
    roomPass: params[1][1],
    userName: params[2][1],
  };
  console.log("Room Details" + roomDetails);
  document.getElementById("meeting_details").innerHTML =
    "<p>RoomName: " +
    roomDetails.roomName +
    "</p><p>RoomPass: " +
    roomDetails.roomPass +
    "</p>";

  const selectColor = () => {
    console.log(colorPicker.value);
    myStrokeColor = colorPicker.value;
  };

  btnEraser.addEventListener("click", () => {
    document.body.style.cursor = "var(--cursor-eraser)";
    myStrokeColor = "rgb(255,255,255)";
    myStrokeSize = 24;
    myStrokeShape = "square";
  });

  penMarker.addEventListener("click", () => {
    document.body.style.cursor = "var(--cursor-pen)";
    selectColor();
    myStrokeSize = 5;
    myStrokeShape = "round";
  });

  // All things drawing \ ----------------------------------------------------
  // define the room
  const roomName = roomDetails.roomName;
  const username = roomDetails.userName;
  var users = [];
  // connect to our server
  socket = io();
  // join room
  socket.emit("joinRoom", roomName, username);
  // setup canvas
  const myCanvas = document.querySelector("#myCanvas");
  function initCanvas(canvas) {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
  }
  // context for drawing
  var ctx = myCanvas.getContext("2d");
  initCanvas(myCanvas);
  // freehand drawing
  let freehand = false;

  // all functions and callbacks
  function startFree(e) {
    if (username == users[0].username && socket.id == users[0].id) {
      console.log("mousedown");
      ctx.beginPath();
      freehand = true;
      drawFreehand(e);
    } else {
      console.log("access not granted for attendees");
    }
  }

  function drawFreehand(e) {
    if (freehand) {
      console.log("drawing free hand");
      console.log(roomName);
      ctx.lineWidth = myStrokeSize;
      ctx.lineCap = myStrokeShape;
      ctx.strokeStyle = myStrokeColor;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      var data = {
        x: e.clientX,
        y: e.clientY,
        strokeColor: myStrokeColor,
        strokeShape: myStrokeShape,
        strokeSize: myStrokeSize,
        done: false,
      };
      socket.emit("sendMouseData", username, roomName, data);
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    }
  }

  function endFree(e) {
    var data = {
      x: e.clientX,
      y: e.clientY,
      done: true,
    };
    socket.emit("sendMouseData", username, roomName, data);
    console.log("mouseup");
    freehand = false;
    ctx.beginPath();
  }
  // //simply call clearCanvas socket event
  // function clearCanvas() {
  //   socket.emit("clearCanvas", username, roomName);
  // }

  function exitMeeting() {
    console.log("exiting meeting");
    socket.emit("exitMeeting", roomName);
    window.location.href = "http://localhost:3000";
  }
  // received drawing
  socket.on("newMouseData", (data) => {
    console.log("Client received:" + data.x + " " + data.y);
    ctx.lineWidth = data.strokeSize;
    ctx.lineCap = data.strokeShape;
    ctx.strokeStyle = data.strokeColor;
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
    if (data.done) {
      ctx.beginPath();
    }
    // console.log(users);
  });
  socket.on("newUser", (newUsers) => {
    users = newUsers;
    console.log("users:\t" + users);
    var usernames = users.reduce((names, user) => {
      return names + " " + user.username;
    }, "");
    console.log("Usernames " + usernames);
    var usernames = usernames.split(" ");
    console.log(usernames);
    let membersList = document.getElementById("membersList");
    while (membersList.hasChildNodes()) {
      membersList.removeChild(membersList.firstChild);
    }
    usernames.forEach((username) => {
      let li = document.createElement("li");
      li.innerText = username;
      membersList.appendChild(li);
    });
  });
  socket.on("clearCanvas", (username, roomName) => {
    initCanvas(myCanvas);
  });
  socket.on("exitMeeting", exitMeeting);

  // client events
  btnResetCanvas.addEventListener("click", () => {
    initCanvas(myCanvas);
    socket.emit("clearCanvas", username, roomName);
  });
  myCanvas.addEventListener("mousedown", startFree);
  myCanvas.addEventListener("mouseup", endFree);
  myCanvas.addEventListener("mousemove", drawFreehand);
  btn_exitMeeting.addEventListener("click", exitMeeting);
  colorPicker.addEventListener("input", selectColor);
});
