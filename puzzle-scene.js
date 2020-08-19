class PuzzleScene {

    constructor() {
        this.board = {
            width: 8,
            height: 8,
            offset: { x: 100, y: 100 }
        };

        this.tiles = [];
        this.pathTiles = [];
    }

    init() {
        this.tiles = [];
        this.board.offset = { x: (canvas.width / 2) - (this.board.width * 50) / 2, y: (canvas.height / 2) - (this.board.height * 50) / 2 };
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                this.tiles.push(new Tile(this.board, x, y));
            }
        }

        this.buildPath();
    }

    buildPath() {
        this.pathTiles = [];
        let validStartTiles = this.tiles.filter(tile => tile.x == 0);
        let currentTile = validStartTiles[Math.floor(validStartTiles.length * Math.random())];
        this.pathTiles.push(currentTile);
        let invalidTiles = [];

        while (currentTile.x < 7) {
            let validPathChoices = this.tiles.filter(tile => this.isValidNearby(tile, currentTile, invalidTiles));
            if (validPathChoices.length == 0) {
                this.pathTiles.splice(this.pathTiles.findIndex(tile => tile == currentTile), 1);
                invalidTiles.push(currentTile);
                currentTile = this.pathTiles[this.pathTiles.length - 1];
                continue;
            }
            let randomTile = validPathChoices[Math.floor(validPathChoices.length * Math.random())];
            currentTile = randomTile;
            this.pathTiles.push(currentTile);
        }

        let startTile = this.pathTiles[0];
        let nextTile = this.pathTiles[1];
        startTile.piece = TileType.Node;
        startTile.isPowered = true;
        if (startTile.x < nextTile.x && startTile.y == nextTile.y) {
            startTile.goal = [90];
        } else if (startTile.x == nextTile.x && startTile.y < nextTile.y) {
            startTile.goal = [180];
        } else if (startTile.x == nextTile.x && startTile.y > nextTile.y) {
            startTile.goal = [0];
        }
        startTile.targetRadians = startTile.goal[0] * (Math.PI / 180);

        for (let i = 1; i < this.pathTiles.length - 1; i++) {
            let previousTile = this.pathTiles[i - 1];
            let currentTile = this.pathTiles[i];
            currentTile.isPowered = true;
            let nextTile = this.pathTiles[i + 1];
            currentTile.piece = TileType.Straight;
            if (previousTile.x == nextTile.x && previousTile.y != nextTile.y) {
                currentTile.goal = [0, 180];
            } else if (previousTile.x != nextTile.x && previousTile.y == nextTile.y) {
                currentTile.goal = [90, 270];
            } else if (previousTile.x != nextTile.x && previousTile.y != nextTile.y) {
                currentTile.piece = TileType.Corner;
                let prev = [previousTile.x - currentTile.x, previousTile.y - currentTile.y].join(', ');
                let next = [nextTile.x - currentTile.x, nextTile.y - currentTile.y].join(', ');

                if (
                    prev == "0, -1" && next == "-1, 0" ||
                    next == "0, -1" && prev == "-1, 0") {
                    currentTile.goal = [0];
                } else if (
                    prev == "0, -1" && next == "1, 0" ||
                    next == "0, -1" && prev == "1, 0") {
                    currentTile.goal = [90];
                } else if (
                    prev == "1, 0" && next == "0, 1" ||
                    next == "1, 0" && prev == "0, 1") {
                    currentTile.goal = [180];
                } else if (
                    prev == "-1, 0" && next == "0, 1" ||
                    next == "-1, 0" && prev == "0, 1") {
                    currentTile.goal = [270];
                }
            }
            currentTile.targetRadians = (90 + currentTile.goal[0]) * (Math.PI / 180);
            currentTile.targetRadians %= 360 * (Math.PI / 180);


        }

        let pentultimateTile = this.pathTiles[this.pathTiles.length - 2];
        let lastTile = this.pathTiles[this.pathTiles.length - 1];
        lastTile.piece = TileType.Node;
        if (lastTile.x > pentultimateTile.x && lastTile.y == pentultimateTile.y) {
            lastTile.goal = [270];
        } else if (lastTile.x == pentultimateTile.x && lastTile.y < pentultimateTile.y) {
            lastTile.goal = [180];
        } else if (lastTile.x == pentultimateTile.x && lastTile.y > pentultimateTile.y) {
            lastTile.goal = [0];
        }
    }

    isValidNearby(tile, currentTile, invalidTiles) {
        if (invalidTiles.includes(tile)) {
            return false;
        }
        if (this.pathTiles.includes(tile)) {
            return false;
        }

        //TOP
        if (tile.x == currentTile.x && tile.y == currentTile.y - 1) {
            return true;
        }
        //LEFT
        if (tile.x == currentTile.x - 1 && tile.y == currentTile.y) {
            return true;
        }
        //BOTTOM
        if (tile.x == currentTile.x && tile.y == currentTile.y + 1) {
            return true;
        }
        //RIGHT
        if (tile.x == currentTile.x + 1 && tile.y == currentTile.y) {
            return true;
        }
        return false;
    }

    update(delta) {
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].update(delta);
        }
        if (keys[KeyCode.Esc]) {
            changeState(1);
        }

        if (this.pathTiles.filter(tile => !tile.isOrientedCorrectly()).length == 0) {
            alert("You win!");
            changeState(1);
        }
    }
    draw(context) {
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].draw(context);
        }
    }

    onResize() {
        this.board.offset = { x: (canvas.width / 2) - (this.board.width * 50) / 2, y: (canvas.height / 2) - (this.board.height * 50) / 2 };
    }

    onMouseUp(event) {
        let clickedTile = this.tiles.find(tile => tile.isMouseOver(event));
        if (clickedTile) {
            this.tiles.splice(this.tiles.findIndex(tile => tile == clickedTile), 1);
            this.tiles.push(clickedTile);
            clickedTile.targetRadians += 90 * (Math.PI / 180);
            clickedTile.targetRadians %= (360 * (Math.PI / 180));
        }
    }

    onMouseMove(event) {
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].isHovered = false;
        }

        let hoveredTile = this.tiles.find(tile => tile.isMouseOver(event));

        if (hoveredTile) {
            hoveredTile.isHovered = true;
        }
    }

    onRightClick(event) {
        event.preventDefault();
    }
}

var TileType = {};
TileType.Blank = 0;
TileType.Straight = 1;
TileType.Corner = 2;
TileType.Tee = 3;
TileType.Cross = 4;
TileType.Node = 5;

class Tile {
    constructor(board, x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.center = { x: 25, y: 25 };
        this.radians = 0;//(90 * Math.floor(4 * Math.random())) * (Math.PI / 180);
        this.targetRadians = 0;//(90 * Math.floor(4 * Math.random())) * (Math.PI / 180);
        this.goal = [];
        this.piece = Math.floor(5 * Math.random());
        this.board = board;
        this.isHovered = false;
        this.isPowered = false;
        this.powerPellets = [];
    }

    update(delta) {
        if (this.targetRadians != this.radians) {
            this.radians += (9 * (Math.PI / 180));
            this.radians %= (360 * (Math.PI / 180));
        }
        for (let i = 0; i < this.powerPellets.length; i++) {
            let pellet = this.powerPellets[i];
            pellet.lifetime -= delta * 10;
        }

        if (this.powerPellets.length == 0) {
            this.powerPellets.push({ lifetime: 500 });
        }

        this.powerPellets = this.powerPellets.filter(pellet => pellet.lifetime > 0);
    }

    draw(context) {
        context.fillStyle = Color.DarkGray;
        context.strokeStyle = Color.DarkGray;
        if (this.isHovered) {
            context.strokeStyle = Color.LightGray;
        }
        context.save();
        context.translate((this.x * this.width) + this.board.offset.x + (this.x * 3), (this.y * this.height) + this.board.offset.y + (this.y * 3));
        context.rotate(this.radians);
        context.beginPath();
        context.rect(-this.center.x, -this.center.y, this.width, this.height);
        context.fill();
        context.stroke();

        context.fillStyle = Color.DarkBlue;
        context.strokeStyle = Color.DarkBlue;
        context.lineWidth = 4;

        if (this.isOrientedCorrectly()) {
            context.fillStyle = Color.LightBlue;
            context.strokeStyle = Color.LightBlue;
        }

        switch (this.piece) {
            case TileType.Straight:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, this.height);
                context.fill();
                break;
            case TileType.Corner:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, 2 + this.height / 2);
                context.fill();
                context.beginPath();
                context.rect(-this.center.x, -2, 2 + this.width / 2, 4);
                context.fill();
                break;
            case TileType.Tee:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, this.height);
                context.fill();
                context.beginPath();
                context.rect(-this.center.x, -2, 2 + this.width / 2, 4);
                context.fill();
                break;
            case TileType.Cross:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, this.height);
                context.fill();
                context.beginPath();
                context.rect(- this.center.x, -2, this.width, 4);
                context.fill();
                break;
            case TileType.Node:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, 4 + this.height / 4);
                context.fill();
                context.beginPath();
                context.arc(0, 0, 8, 0, 2 * Math.PI);
                context.stroke();
                break;
            case TileType.Blank:
            default:
                break;
        }

        if (this.isPowered && this.isOrientedCorrectly()) {
            context.fillStyle = Color.White;
            for (let i = 0; i < this.powerPellets.length; i++) {
                let pellet = this.powerPellets[i];
                if (this.piece == TileType.Straight) {
                    context.beginPath();
                    context.arc(0, ((1 - pellet.lifetime / 500) * -(2 * this.center.y) + this.center.y), 2, 0, 2 * Math.PI);
                    context.fill();
                }
            }
        }
        context.restore();
    }

    isMouseOver(event) {
        let boardOffsetX = event.clientX - this.board.offset.x - (this.x * 3) + this.center.x;
        let boardOffsetY = event.clientY - this.board.offset.y - (this.y * 3) + this.center.y;

        let x = Math.floor(boardOffsetX / this.width);
        let y = Math.floor(boardOffsetY / this.height);

        return this.x == x && this.y == y;
    }

    isOrientedCorrectly() {
        return this.goal.map(value => value * (Math.PI / 180)).includes(this.radians);
    }
}
