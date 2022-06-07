// when window loads
window.addEventListener("load", () => {
  // Tools and stuff \ ----------------------------------------------------
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
  var strokeColor = "black";
  var strokeSize = 5;
  var strokeShape = "round";
  const selectColor = () => {
    console.log(colorPicker.value);
    strokeColor = colorPicker.value;
  };

  btnEraser.addEventListener("click", () => {
    strokeColor = "rgb(214,214,214)";
    strokeSize = 100;
    strokeShape = "square";
  });
  penMarker.addEventListener("click", () => {
    selectColor();
    strokeSize = 5;
    strokeShape = "round";
  });
  colorPicker.addEventListener("input", selectColor);
  // All things drawing \ ----------------------------------------------------
  var room = "myRoom";

  // connect to our server
  socket = io.connect("http://localhost:3000");

  // setup canvas
  const myCanvas = document.querySelector("#myCanvas");
  function initCanvas(canvas) {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
  }

  // context for drawing
  var ctx = myCanvas.getContext("2d");
  initCanvas(myCanvas);
  btnResetCanvas.addEventListener("click", () => {
    // ctx.fillStyle(214, 214, 214);
    // ctx.fillRect(0, 0, myCanvas.clientWidth, myCanvas.clientHeight);
    initCanvas(myCanvas);
    // console.log("btnCls");
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
      ctx.lineWidth = strokeSize;
      ctx.lineCap = strokeShape;
      ctx.strokeStyle = strokeColor;
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
  myCanvas.addEventListener("mousedown", startFree);
  myCanvas.addEventListener("mouseup", endFree);
  myCanvas.addEventListener("mousemove", drawFreehand);
});
