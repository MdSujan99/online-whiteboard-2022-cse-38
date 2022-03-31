window.addEventListener('load', () => {
    function initCanvas(canvas){
        canvas.height = window.innerHeight-100;
        canvas.width = window.innerWidth-100;
    }
    var canvas = document.querySelector("#myCanvas");
    initCanvas(canvas);
    var btn_cls = document.querySelector('#btn-cls');
    btn_cls.addEventListener('click', () => {
        initCanvas(canvas)
    })
    window.addEventListener('resize', () =>{
        canvas.height = window.innerHeight-100;
        canvas.width = window.innerWidth-100;
    })
    var ctx = canvas.getContext("2d"); // for drawing
    // // a empty box or a box border
    // ctx.strokeStyle = "red";    //only for stroke, not fill
    // ctx.lineWidth = "5";    //only for stroke, not fill
    // ctx.strokeRect(100,100,100,200);

    // // a solid box
    // ctx.fillStyle = "green";
    // ctx.fillRect(250,100,100,200); 

    // // line
    // // line closed
    // ctx.beginPath();
    // ctx.moveTo(400,100);
    // ctx.lineTo(500,300);
    // ctx.lineTo(500,100);
    // ctx.closePath();
    // ctx.stroke();

    // // line open
    // ctx.beginPath();
    // ctx.moveTo(600,100);
    // ctx.lineTo(700,300);
    // ctx.lineTo(700,100);
    // // ctx.closePath();
    // ctx.stroke();

    // freehand drawing
    let freehand = false;
    function startFree(e){
        console.log('mousedown');
        freehand = true;
        drawFreehand(e);
    }
    function endFree(){
        console.log('mouseup');
        freehand = false;
        ctx.beginPath();
    }
    function drawFreehand(e){
        if(freehand){
            console.log('drawing free hand');
            ctx.lineWidth = 10;
            ctx.lineCap = "round"
            ctx.strokeStyle = 'red';
            ctx.lineTo(e.clientX,e.clientY);
            // ctx.beginPath();
            ctx.moveTo(e.clientX,e.clientY);
            ctx.stroke();
        }
        return
        
    }
    
    canvas.addEventListener('mousedown',startFree);
    canvas.addEventListener('mouseup',endFree);
    canvas.addEventListener('mousemove',drawFreehand);

})


