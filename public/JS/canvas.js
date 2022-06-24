// when window loads
window.addEventListener("load", () => {
  // Tools and btns \ ----------------------------------------------------
  const penMarker = document.getElementById("btn_marker");
  const penHighlighter = document.getElementById("btn_highlighter");
  const shapeLine = document.getElementById("btn_line");
  const shapeArrow = document.getElementById("btn_arrow");
  const shapeCircle = document.getElementById("btn_circle");
  const shapeRect = document.getElementById("btn_rect");
  const colorPicker = document.getElementById("colorPicker");
  const btnEraser = document.getElementById("btn_eraser");
  const btnResetCanvas = document.getElementById("btn_cls");
  const btnSaveDrawinf = document.getElementById("btn_save");
  var myStrokeColor = "black";
  var myStrokeSize = 5;
  var myStrokeShape = "round";
  var btnActive = penMarker;
  const btn_endMeeting = document.getElementById("btn_endMeeting");
  // Meeting details
  var userIds = [];

  var params = window.location.search.split("?")[1].split("&");
  params = params.map((item) => item.split("="));
  params.forEach((item) => {
    console.log(item);
  });
  const roomData = {
    roomName: params[0][1],
    roomPass: params[1][1],
  };

  const memberName = params[2][1];

  // meeting members
  console.log("Room Data" + roomData);
  document.getElementById("meeting_details").innerHTML =
    "<p>RoomName: " +
    roomData.roomName +
    "</p><p>RoomPass: " +
    roomData.roomPass +
    "</p>";

  const member_li = document.createElement("li");
  member_li.innerHTML = '<p id="member_name">' + memberName + "</p>";
  document.getElementById("members_list").appendChild(member_li);

  const selectColor = () => {
    console.log(colorPicker.value);
    myStrokeColor = colorPicker.value;
  };

  btnEraser.addEventListener("click", () => {
    document.body.style.cursor = "var(--cursor-eraser)";
    myStrokeColor = "rgb(214,214,214)";
    myStrokeSize = 100;
    myStrokeShape = "square";
  });

  penMarker.addEventListener("click", () => {
    document.body.style.cursor = "var(--cursor-pen)";
    selectColor();
    myStrokeSize = 5;
    myStrokeShape = "round";
  });

  colorPicker.addEventListener("input", selectColor);

  // All things drawing \ ----------------------------------------------------
  // define the room
  const room = roomData.roomName;
  // connect to our server
  socket = io();
  // join room
  socket.emit("join room", room);
  // setup canvas
  const myCanvas = document.querySelector("#myCanvas");
  function initCanvas(canvas) {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
  }

  console.log();
  // context for drawing
  var ctx = myCanvas.getContext("2d");
  initCanvas(myCanvas);
  // clear the canvas
  btnResetCanvas.addEventListener("click", () => {
    socket.emit("clearCanvas", room);
    initCanvas(myCanvas);
  });
  // freehand drawing
  let freehand = false;
  function startFree(e) {
    console.log("mousedown");
    ctx.beginPath();
    freehand = true;
    drawFreehand(e);
  }
  function endFree(e) {
    var data = {
      x: e.clientX,
      y: e.clientY,
      done: true,
      roomName: room,
    };
    socket.emit("mouseData", data);
    console.log("mouseup");
    freehand = false;
    ctx.beginPath();
  }
  function drawFreehand(e) {
    if (freehand) {
      console.log("drawing free hand");
      console.log(room);
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
        roomName: room,
      };
      socket.emit("mouseData", data);
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    }
    // return;
  }

  // received drawing
  socket.on("mouseData", (data) => {
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
  });
  socket.on("clearCanvas", () => {
    initCanvas(myCanvas);
  });

  socket.on("newUser", (socketId) => {
    userIds.push(socketId);
    console.log(userIds);
  });
  myCanvas.addEventListener("mousedown", startFree);
  myCanvas.addEventListener("mouseup", endFree);
  myCanvas.addEventListener("mousemove", drawFreehand);
  btn_endMeeting.addEventListener("click", () => {
    console.log("End Meeting");
    window.location.href = "http://localhost:3000/index.html";
  });
});
