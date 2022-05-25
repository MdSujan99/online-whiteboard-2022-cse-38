// when window loads
window.addEventListener("load", () => {
  var room = "myRoom";
  //   console.log(room);

  // connect to our server
  socket = io.connect("http://localhost:3000");

  // setup canvas
  var canvas = document.querySelector("#myCanvas");
  function initCanvas(canvas) {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
  }
  initCanvas(canvas);

  // context for drawing
  var ctx = canvas.getContext("2d");

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
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "red";
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      var data = {
        x: e.clientX,
        y: e.clientY,
        done: false,
      };
      socket.emit("mouseData", data, "myRoom");
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    }
    // return;
  }

  // received drawing
  socket.on("mouseData", (data) => {
    console.log("Client received:" + data.x + " " + data.y);
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
    if (data.done) {
      ctx.beginPath();
    }
  });

  canvas.addEventListener("mousedown", startFree);
  canvas.addEventListener("mouseup", endFree);
  canvas.addEventListener("mousemove", drawFreehand);
});
