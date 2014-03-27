function Ship(canvas){
    var ship = this;
    var ctx = canvas.ctx;
    this.x = canvas.width/2;
    this.y = canvas.height-30;
    $('canvas').mousemove(function(event){
        var x = event.offsetX;
        var y = event.offsetY;
        if (x>0 && x<canvas.width)
            ship.x = x;
        if (y<canvas.height-20)
            ship.y = event.offsetY;
    });
    this.draw = function(){
        var x = this.x;
        var y = this.y;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x-10, y+20);
        ctx.lineTo(x, y+15);
        ctx.lineTo(x+10, y+20);
        ctx.closePath();
        ctx.fillStyle = "#00B9AA";
        ctx.fill();

    };
    this.explode = function(){
        var x = this.x;
        var y = this.y;
        canvas.ctx.beginPath();
        canvas.ctx.arc(x, y, 30, 0, 2*Math.PI, false);
        canvas.ctx.fillStyle = "#AB1249";
        canvas.ctx.fill();
        canvas.ctx.beginPath();
        canvas.ctx.arc(x, y, 20, 0, 2*Math.PI, false);
        canvas.ctx.fillStyle = "#D68402";
        canvas.ctx.fill();
        canvas.ctx.stroke();
    }
}

function Enemy(canvas){
    var ship = this;
    var ctx = canvas.ctx;
    var moveCount = 0;
    var moveCap = Math.floor(Math.random()*200);
    var direction = Math.round(Math.random())<1? -1: 1;
    this.moves = [];
    this.x = Math.random()*canvas.width;
    this.y = 10;
    this.move1 = function(){
        if (moveCount ==moveCap){
            direction*=-1;
            moveCount = 0;
        }
        else if (this.x > canvas.width-30){
            direction*=-1;
            moveCount = 0;
            this.x-=1;
        }
        else if (this.x < 30){
            direction*=-1;
            moveCount = 0;
            this.x+=1;
        }
        else{
            this.x+=1*direction;
            moveCount++;
        }
        this.y+=Math.random()*2;
    }
    this.draw = function(){
        var x = this.x;
        var y = this.y;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x-5,y+4);
        ctx.lineTo(x-10,y);
        ctx.lineTo(x-10, y-10);
        ctx.lineTo(x, y-5);
        ctx.lineTo(x+10, y-10);
        ctx.lineTo(x+10,y);
        ctx.lineTo(x+5,y+4);
        ctx.closePath();
        ctx.fillStyle = "pink";
        ctx.fill();

        //eyes
        ctx.beginPath();
        ctx.arc(x-5, y-2, 2, 0, 1.5*Math.PI, false);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x+5, y-2, 2, 0, 1.5*Math.PI, false);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();

        this.move1();
    };
}

function Laser(canvas, ship){
    var ctx = canvas.ctx;
    this.x = ship.x-1.3;
    this.y = ship.y-5;
    this.draw = function(){
        ctx.fillStyle = "#C81E32";
        ctx.fillRect(this.x, this.y, 3, 10);
    };
    this.move = function(){
        this.y -= 3;
    }
}

function EnemyLaser(canvas, enemy){
    var ctx = canvas.ctx;
    this.x = enemy.x-1.3;
    this.y = enemy.y+5;
    this.draw = function(){
        ctx.fillStyle = "#FFDB1E";
        ctx.fillRect(this.x, this.y, 3, 10);
    };
    this.move = function(){
        this.y += 8;
    }
}
