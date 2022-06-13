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

  // Meeting details
  const meeting_details = document.getElementsByClassName("meeting_details");
  console.log(meeting_details);

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
  var room = "myRoom";

  // connect to our server
  socket = io();

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
  myCanvas.addEventListener("mousedown", startFree);
  myCanvas.addEventListener("mouseup", endFree);
  myCanvas.addEventListener("mousemove", drawFreehand);
});
