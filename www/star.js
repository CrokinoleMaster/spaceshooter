function Star(canvas){
    var ctx = canvas.ctx;
    var x = Math.random()* canvas.width;
    var y = Math.random()* canvas.height;
    var radius = Math.random()*1.5+1;
    var accel = Math.random()* 2+3;

    this.draw = function(){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI, false);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
        this.move();
    };

    this.move = function(){
        y += accel;
        if (y > canvas.height){
            y = 0;
            x = Math.random()* canvas.width;
        }
    };

}