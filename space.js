Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
function SpaceShooter(){
    var canvas = new Canvas();
    var $menu = $('#menu');
    $('#lives').html(canvas.lives);
    $('#score').html(canvas.score);
    this.start = function(){
        $(canvas).on('lost', function(){
            $('#start').prop('disabled', false);
            $('#score').css('color', '#C81E32');
            $('canvas').css({'background-color': '#23112A', cursor: 'default'});
            $menu.find('h1').text('GAME OVER');
            $menu.find('#start').text('TRY AGAIN');
            $menu.fadeIn('fast');
        });
        $menu.on('click', '#start', function(){
            $(this).prop('disabled', true);
            $('#score').css('color', '#97B8B6');
            $('canvas').css({'background-color': '#23112A', cursor: 'none'});
            $menu.fadeOut('fast');
            play();
        });
    };
    function play(){
        var timeout;
        var timeout2;
        var timeout3;
        canvas.init();
        (function draw(){
            canvas.play();
            if (canvas.lost == false){
                timeout = window.setTimeout(draw, 13);
            }
            else{
                $(canvas).trigger('lost');
                window.clearTimeout(timeout);
                window.clearTimeout(timeout2);
                window.clearTimeout(timeout3);
            }
        })();
        (function add(){
            canvas.autoEnemies();
            if (canvas.lost == false){
                timeout2 = window.setTimeout(add, canvas.gameSpeed);
            }
        })();
        (function shoot(){
            canvas.addEnemyLasers();
            if (canvas.lost == false){
                timeout3 = window.setTimeout(shoot, 1000);
            }


        })();
    }

}

function Canvas(){
    var canvas = this;
    var $canvas = $('canvas');
    var stars = [];
    var lasers = [];
    var enemyLasers = [];
    var enemies = [];
    var ship;
    this.ctx = $canvas[0].getContext('2d');
    this.width = $canvas[0].width;
    this.height = $canvas[0].height;
    this.offset = $canvas.offset();
    this.lost = false;
    this.score = 0;
    this.lives = 10;
    this.gameSpeed = 1000;
    $(window).resize(function() {offset = $canvas.offset(); });



    this.clear= function(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        return this;
    };

    this.updateScore = function(){
        $('#score').text(ball.score);
    }

    this.init = function(){
        this.clear();
        this.score = 0;
        this.lost = false;
        this.gameSpeed = 1000;
        this.lives = 10;
        stars = [];
        lasers = [];
        enemies = [];
        enemyLasers = [];
        this.addStars();
        ship = new Ship(canvas);
        ship.draw();
        stars.forEach(function(star){
            star.draw();
        });
        $canvas.on('click', function(e){
            var laser = new Laser(canvas, ship);
            lasers.push(laser);
            $(lasers[lasers.length-1]).on('hit', function(){
                lasers.remove(lasers.indexOf(laser));
            });
        });
        $('#score').html(canvas.score);
        $('#lives').html(canvas.lives);

    };

    this.play = function(){
        this.clear();
        stars.forEach(function(star){
            star.draw();
        });
        this.drawLaser();
        this.drawEnemies();
        this.drawEnemyLaser();
        ship.draw();
        this.gameSpeed = 1000-this.score*2;
    };

    this.addStars = function(){
        var i = 0;
        var length = 40;
        for (i; i< length; i++){
            stars.push(new Star(this));
        }
    };

    this.addEnemy = function(){
        var enemy = new Enemy(this);
        enemies.push(enemy);
        $(enemies[enemies.length-1]).on('hit',function(){
            enemies.remove(enemies.indexOf(enemy));
        });
    };

    this.autoEnemies= function(){
        if (enemies.length <10){
            canvas.addEnemy();
        }
    };

    this.drawEnemies = function(){
        enemies.forEach(function(enemy){
            enemy.draw();
            if (enemy.y > canvas.height){
                canvas.lives--;
                $('#lives').html(canvas.lives);
                if (canvas.lives ==0){
                    canvas.lost =true;
                }
            }
        });
        enemies = enemies.filter(isOnScreen);
        function isOnScreen(enemy){
            return enemy.y<canvas.height;
        }
    };

    this.drawLaser = function(){
        lasers.forEach(function(laser){
            laser.draw();
            laser.move();
        });
        checkLaserHit();
        lasers = lasers.filter(isOnScreen);
        function isOnScreen(laser){
            return laser.y>0;
        }
    };

    this.addEnemyLasers = function(){
        enemies.forEach(function(enemy){
            enemyLasers.push( new EnemyLaser(canvas, enemy));
        });
    };

    this.drawEnemyLaser = function(){
        enemyLasers.forEach(function(lasers){
            lasers.draw();
            lasers.move();
        });
        checkEnemyHit();
        enemyLasers = enemyLasers.filter(isOnScreen);
        function isOnScreen(laser){
            return laser.y<canvas.height;
        }
    };

    function checkLaserHit(){
        lasers.forEach(function(laser){
            enemies.forEach(function(enemy){
                if ( Math.abs(laser.x-enemy.x)<10 &&  Math.abs(laser.y-(enemy.y+10) )<5 ){
                    $(enemy).trigger('hit');
                    $(laser).trigger('hit');
                    canvas.score+=10;
                    $('#score').html(canvas.score);
                    var intervalId = window.setInterval(function(){
                        drawExplosion(enemy.x, enemy.y);
                    }, 1);
                    window.setTimeout(function(){
                        window.clearInterval(intervalId);
                    }, 200);
                }
            });
        });
    }

    function checkEnemyHit(){
        var intervalId;
        enemyLasers.forEach(function(laser){
            if (Math.abs(laser.x-ship.x)<10 && Math.abs(laser.y-(ship.y)) < 5){
                canvas.lives--;
                $('#lives').html(canvas.lives);
                if (canvas.lives ==0){
                    canvas.lost =true;
                }
                intervalId = window.setInterval(function(){
                    ship.explode();
                },5);
                window.setTimeout(function(){
                    window.clearInterval(intervalId);
                },200);
            }
        });
    }

    function drawExplosion(x, y){
        canvas.ctx.beginPath();
        canvas.ctx.arc(x, y, 15, 0, 2*Math.PI, false);
        canvas.ctx.fillStyle = "#AB1249";
        canvas.ctx.fill();
        canvas.ctx.beginPath();
        canvas.ctx.arc(x, y, 10, 0, 2*Math.PI, false);
        canvas.ctx.fillStyle = "#D68402";
        canvas.ctx.fill();
        canvas.ctx.stroke();
    }

}



$(function(){

    window.spaceShooter = new SpaceShooter();
    window.spaceShooter.start();

})