class GameElement {
    positionX = 0;
    positionY = 0;

    constructor(x, y) {
        this.positionX = x;
        this.positionY = y;
    }
}

class Spaceship extends GameElement {
    constructor(x, y, size, speed) {
        super(x, y);
        this.size = size;
        this.blowenUp = false;
        this.speed = speed;
    }

    draw(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        if (this.blowenUp) {
            ctx.strokeStyle = "#FF0000"; // RGB
            ctx.moveTo(this.positionX, this.positionY);
            ctx.lineTo(this.positionX - this.size, this.positionY);
            ctx.moveTo(this.positionX, this.positionY);
            ctx.lineTo(this.positionX - this.size, this.positionY + this.size);
            ctx.moveTo(this.positionX, this.positionY);
            ctx.lineTo(this.positionX - this.size, this.positionY - this.size);
            ctx.moveTo(this.positionX, this.positionY);
            ctx.lineTo(this.positionX + this.size, this.positionY + this.size);
            ctx.moveTo(this.positionX, this.positionY);
            ctx.lineTo(this.positionX + this.size, this.positionY - this.size);
            ctx.moveTo(this.positionX, this.positionY);
            ctx.lineTo(this.positionX + this.size, this.positionY);
        } else {
            ctx.lineWidth = 2;
            ctx.arc(this.positionX, this.positionY, this.size, 0, 2 * Math.PI);
            ctx.moveTo(this.positionX - this.size - 20, this.positionY);
            ctx.lineTo(this.positionX + this.size + 20, this.positionY);
        }
        ctx.stroke();
    }

    moveRight() {
        this.positionX += this.speed;
    }

    blowup() {
        this.blowenUp = true;
    }
}

class Cannon extends GameElement {
    constructor(x, y) {
        super(x, y);
    }

    draw(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(this.positionX, this.positionY);
        ctx.lineTo(this.positionX + 20, this.positionY - 20);
        ctx.lineTo(this.positionX + 40, this.positionY);
        ctx.lineTo(this.positionX, this.positionY);
        ctx.stroke();
    }
}

class Missile extends GameElement {
    constructor(x, y, speed) {
        super(x, y);
        this.speed = speed;
    }

    draw(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(this.positionX, this.positionY);
        ctx.lineTo(this.positionX + 10, this.positionY - 10);
        ctx.lineTo(this.positionX + 20, this.positionY);
        ctx.lineTo(this.positionX, this.positionY);
        ctx.stroke();
    }

    moveUp() {
        this.positionY = this.positionY - this.speed;
    }
}

class TheBigGame {
    spaceships = [];
    missiles = [];
    cannon = undefined;
    MAX_SHIP_SIZE = 40;
    MIN_SHIP_SIZE = 5;
    MAX_SPEED = 6;
    MAX_SHIP_SPEED = 10;
    MIN_SHIP_SPEED = 1;
    MAX_SHIPS = 3;
    MISSILE_SPEED = 5;
    MAX_MISSILES = 4;

    constructor(canvas) {
        this.canvas = canvas;
        this.LOWEST_ALTITUDE = canvas.height - 100;
    }

    startGame() {
        this.cannon = new Cannon(this.canvas.width / 2, this.canvas.height);

        const self = this; // this -> TheBigGame
        setInterval(function () {
            // here this is the function
            let ctx = self.canvas.getContext("2d");
            ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.sendShips();
            self.updateGameElements();
            self.drawElements();
            self.updateShipsState();
            self.updateMissileState();
            self.checkHits();
        }, 20);
        window.addEventListener('keydown', function (e) {
            self.createMissile();
        })
    }

    createNewShip() {
        const size = Math.floor(Math.random() * (this.MAX_SHIP_SIZE - this.MIN_SHIP_SIZE)) + this.MIN_SHIP_SIZE;
        const speed = Math.floor(Math.random() * (this.MAX_SHIP_SPEED - this.MIN_SHIP_SPEED)) + this.MIN_SHIP_SPEED;
        const posY = Math.floor(Math.random() * this.LOWEST_ALTITUDE) + size;
        return new Spaceship(0 - size, posY, size, speed);
    }

    sendShips() {
        if (this.spaceships.length >= this.MAX_SHIPS) {
            return;
        }

        if (this.spaceships.length === 0) {
            const ship = this.createNewShip();
            this.spaceships.push(ship);
            return;
        } 

        if (Math.floor(Math.random() * 10) > 5) {
            const ship = this.createNewShip();
            this.spaceships.push(ship);
        }
    }

    updateGameElements() {
        this.spaceships.forEach(function(spaceship) {
            spaceship.moveRight();
        });
        this.missiles.forEach(function(missile) {
            missile.moveUp();
        });
    }

    drawElements() {
        const theCanvas = this.canvas;
        this.spaceships.forEach(function(spaceship){
            spaceship.draw(theCanvas);
        });

        this.missiles.forEach(function (missile) {
            missile.draw(theCanvas);
        });

        this.cannon.draw(theCanvas);
    }

    updateShipsState() {
        for (let i = 0; i < this.spaceships.length; i = i + 1) {
            if (this.spaceships[i].positionX > this.canvas.width + this.spaceships[i].size) {
                this.spaceships.splice(i, 1);
            }
        }
    }

    createMissile() {
        if (this.missiles.length < this.MAX_MISSILES) {
            const missile = new Missile(this.cannon.positionX, this.cannon.positionY, this.MISSILE_SPEED)
            this.missiles.push(missile);
        }
    }

    updateMissileState() {
        for (let i = 0; i < this.missiles.length; i = i + 1) {
            if (this.missiles[i].positionY <= 0) {
                this.missiles.splice(i, 1);
            }
        } 
    }

    checkHits() {
        for (let i = 0; i < this.missiles.length; i = i + 1) {
            for (let j = 0; j < this.spaceships.length; j = j + 1) {
                const spaceship = this.spaceships[j];
                const missile = this.missiles[i];
                if (spaceship.positionX + spaceship.size > missile.positionX 
                    && spaceship.positionX - spaceship.size < missile.positionX &&
                    spaceship.positionY + spaceship.size > missile.positionY && 
                    spaceship.positionY - spaceship.size < missile.positionY) {
                    this.spaceships.splice(j, 1);
                    this.missiles.splice(i, 1);
                    return;
                }
            }
        }
    }
}

function startTheBigGame() {
    if (hasTheBigGameStarted) {
        return;
    }

    const canvas = document.getElementById('myCanvas');
    const theBigGame = new TheBigGame(canvas);
    theBigGame.startGame();
    hasTheBigGameStarted = true;
}

let hasTheBigGameStarted = false;

