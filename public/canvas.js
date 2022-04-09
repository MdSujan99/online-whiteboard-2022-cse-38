// when window loads
window.addEventListener('load', () => {
    socket = io.connect('http://localhost:3000')
    function initCanvas(canvas){
        canvas.height = window.innerHeight-100;
        canvas.width = window.innerWidth-250;
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
            ctx.lineWidth = 5;
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


