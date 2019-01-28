
    var myGamePiece;
    var myObstacles = [];
    var mySound;
    var myMusic;
    var myScore;
    var myblast;

    function startGame() {
        var elem = document.getElementById("btn");
        elem.parentNode.removeChild(elem);
        myGamePiece = new component(80, 70, "images/ship.png", 100, 120,"image");//add image
        mySound = new sound("sounds/expo.mp3");
        myMusic = new sound("sounds/Warfare.mp3");
        myMusic.play();
        myScore = new component("30px", "Consolas", "White", 280, 40, "text");
        myGameArea.start();
    }

    var myGameArea = {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.frameNo = 0;
            this.interval = setInterval(updateGameArea, 10);
        },
        stop : function() {
            clearInterval(this.interval);
        },    
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    function component(width, height, color, x, y,type) {
        this.type = type;
        this.score = 0;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.width = width;
        this.height = height;
        this.speedX = 15;
        this.speedY = 15;    
        this.x = x;
        this.y = y;    
        this.update = function() {
            ctx = myGameArea.context;
            if (this.type == "text") {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            } 
            if (type == "image") {
              ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
            }else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        this.newPos = function() {
            this.x += this.speedX;
            this.y += this.speedY;        
        }    
        this.crashWith = function(otherobj) {
            var myleft = this.x;
            var myright = this.x + (this.width)/2;
            var mytop = this.y;
            var mybottom = this.y + (this.height);
            var otherleft = otherobj.x;
            var otherright = otherobj.x + (otherobj.width);
            var othertop = otherobj.y;
            var otherbottom = otherobj.y + (otherobj.height);
            var crash = true;
            if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                crash = false;
            }

            return crash;
        }
    }
    function updateGameArea() {
        var x, height, gap, minHeight, maxHeight, minGap, maxGap;
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePiece.crashWith(myObstacles[i])) {
                myMusic.stop();
                mySound.play();
                myGameArea.stop();
                return;
            } 
        }
        myGameArea.clear();
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(250)) {
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 300;
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
            minGap = 200;
            maxGap = 300;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
            myObstacles.push(new component(40, height, "green", x, 0));
            myObstacles.push(new component(40, x - height - gap, "green", x, height + gap));
            
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x -= 1;
            myObstacles[i].update();
        }
        myMusic.play();
        /*add scores*/
        myScore.text="SCORE: " + myGameArea.frameNo;
        myScore.update();
        myGamePiece.newPos();
        myGamePiece.update();
    }
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }    
    }
    function everyinterval(n) {
        if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
        return false;
    }
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
                myGamePiece.speedX = -5; 
                break;
            case 38:
                myGamePiece.speedY = -5; 
                break;
            case 39:
                myGamePiece.speedX = 5; 
                break;
            case 40:
                myGamePiece.speedY = 5; 
                break;          
        }
    };
    document.onkeyup = function(e) {
        myGamePiece.speedX = 0; 
        myGamePiece.speedY = 0; 
    };

