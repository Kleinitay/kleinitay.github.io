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
    constructor(x, y, destx, desty, frames) {
        super(x, y);
        this.dx = (destx - this.positionX) / frames;
        this.dy = (desty - this.positionY) / frames;
    }

    draw(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }

    move() {
        this.positionY = this.positionY + this.dy;
        this.positionX = this.positionX + this.dx;
    }
}

class Life extends GameElement {
    constructor(x, y, maxLife, howMuchLife, size) {
        super(x, y);
        this.lifeLeft = howMuchLife;
        this.maxLife = maxLife;
        this.size = size;
        this.dSize = size / maxLife;
        this.dColor = 9 / howMuchLife;
    }

    draw(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = `#${(Math.floor((this.maxLife - this.lifeLeft) * this.dColor))}${Math.floor(this.lifeLeft * this.dColor)}0`;
        ctx.fillRect(this.positionX, this.positionY, 10, this.dSize * this.lifeLeft);
    }
}

class GameStage {
    stage = 0;
    speed = 1;
    maxNumber = 4;
    shipsSize = 200;
    maxSize = 200;

    getGameData() {
        return {
            speed: this.speed,
            maxNumber: this.maxNumber,
            shipSize: this.shipSize
        }
    }

    stageUp() {
        this.stage++;
        if (this.maxNumber > 11 || this.stage % 3 === 0) {
            this.speed++;
        } else {
            this.maxNumber++;
            this.shipsSize = this.maxSize / this.stage;
        }
    }
}


class TheBigGame {
    spaceship;
    missile;
    cannon = undefined;
    MAX_SHIP_SIZE = 40;
    MIN_SHIP_SIZE = 30;
    MAX_SPEED = 6;
    MAX_SHIP_SPEED = 10;
    MIN_SHIP_SPEED = 1;
    MISSILE_SPEED = 5;
    firstNumber = 5;
    secondNumber = 5;
    hits = 0;
    shipSpeed = 1;
    MAX_LIFE = 10;

    constructor(canvas, textInput, excersizeText) {
        this.canvas = canvas;
        this.running = false;
        this.textInput = textInput;
        this.LOWEST_ALTITUDE = 100;
        this.gameStage = new GameStage();
        this.lifeLeft = this.MAX_LIFE;
        this.excersizeText = excersizeText;
    }

    startGame() {
        this.cannon = new Cannon(this.canvas.width / 2, this.canvas.height);
        this.setExcersize();
        this.textInput.focus();
        this.running = true;
        const self = this; // this -> TheBigGame
        setInterval(function () {
            // here this is the function
            if (!self.running) {
                if (this.lifeLeft === 0) {
                    self.gameOver();
                } else {
                    self.showStage();
                }
                return;
            }

            let ctx = self.canvas.getContext("2d");
            ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.sendShips();
            self.updateGameElements();
            self.drawElements();
            self.updateShipsState();
            self.updateMissileState();
            self.checkHits();
        }, 20);
        this.textInput.addEventListener('keydown', function (e) {
            self.fireIf(self.textInput.value + e.key);
        })
    }

    continueGame() {
        this.running = true;
        this.textInput.focus();
    }

    fireIf(userInput) {
        const result = this.firstNumber * this.secondNumber;
        const radix = result < 2 ? 1 : Math.ceil(Math.log10(result + 1));
        if (userInput.length !== radix) {
            return;
        }

        const userResult = parseInt(userInput);
        if (isNaN(userResult)) {
            return;
        }

        if (userResult === result) {
            this.createMissile(this.spaceship.positionX + this.spaceship.size / 2, this.spaceship.positionY);
        } else {
            const diff = result - userResult;
            this.createMissile(this.spaceship.positionX + diff * 100 / (Math.log2(Math.abs(diff)) + 1), this.spaceship.positionY);
        }
    }

    createNewShip() {
        const size = Math.floor(Math.random() * (this.MAX_SHIP_SIZE - this.MIN_SHIP_SIZE)) + this.MIN_SHIP_SIZE;
        const speed = this.shipSpeed;
        const posY = Math.floor(Math.random() * this.LOWEST_ALTITUDE) + size;
        return new Spaceship(0 - size, posY, size, speed);
    }

    sendShips() {
        if (this.spaceship) {
            return;
        }

        this.spaceship = this.createNewShip();
    }

    updateGameElements() {
        this.spaceship?.moveRight();
        this.missile?.move();
    }

    drawElements() {
        const theCanvas = this.canvas;
        this.spaceship?.draw(theCanvas);
        this.missile?.draw(theCanvas);
        this.cannon.draw(theCanvas);
        const lifeBar = new Life(this.canvas.width - 10, 0, this.MAX_LIFE, this.lifeLeft, 200);
        lifeBar.draw(this.canvas);
    }

    updateShipsState() {
        if (this.spaceship.positionX > this.canvas.width + this.spaceship.size) {
            this.spaceship = undefined;
            this.lifeLeft--
            this.setExcersize();
            if (this.lifeLeft === 0) {
                this.gameOver();
                this.running = false;
            }
        }
    }

    createMissile(destX, destY) {
        this.missile = new Missile(this.cannon.positionX, this.cannon.positionY, destX, destY, 5);
    }

    updateMissileState() {
        if (this.missile && this.missile.positionY <= 0) {
            this.missile = undefined;
        }
    }

    checkHits() {
        if (!this.missile || !this.spaceship) {
            return;
        }

        const missile = this.missile;
        const spaceship = this.spaceship;
        if (spaceship.positionX + spaceship.size > missile.positionX
            && spaceship.positionX - spaceship.size < missile.positionX &&
            spaceship.positionY + spaceship.size > missile.positionY &&
            spaceship.positionY - spaceship.size < missile.positionY) {
            this.spaceship = undefined;
            this.missile = undefined;
            this.textInput.value = '';
            this.hits++;
            this.setExcersize();
            if (this.hits === 5) {
                this.hits = 0;
                this.running = false;
                this.gameStage.stageUp();
            }
        }
    }

    showStage() {
        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = "50px Arial";
        ctx.fillText(`${this.gameStage.stage}`, this.canvas.width / 2, this.canvas.height / 2);
    }

    gameOver(){
        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = "50px Arial";
        ctx.fillText(`GAME OVER`, this.canvas.width / 2, this.canvas.height / 2)
        this.lifeLeft = this.MAX_LIFE;
        this.gameStage = new GameStage();
    }

    setExcersize() {
        const gameData = this.gameStage.getGameData();
        this.firstNumber = Math.floor(Math.random() * gameData.maxNumber);
        this.secondNumber = Math.floor(Math.random() * gameData.maxNumber);
        this.shipSize = gameData.shipSize;
        this.shipSpeed = gameData.speed;
        this.excersizeText.innerHTML = `${this.firstNumber} X ${this.secondNumber} = `;
    }
}

let theBigGame;

function startTheBigGame() {
    if (hasTheBigGameStarted) {
        theBigGame.continueGame();
        return;
    }

    const canvas = document.getElementById('myCanvas');
    const userInput = document.getElementById('answer');
    const excersizeText = document.getElementById('excersize');
    theBigGame = new TheBigGame(canvas, userInput, excersizeText);
    theBigGame.startGame();
    hasTheBigGameStarted = true;
}

let hasTheBigGameStarted = false;

