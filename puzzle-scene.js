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

        this.buildBoard();
    }

    buildBoard() {
        let currentTile = this.tiles[0];
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
    }
    draw(context) {
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].draw(context);
        }
    }

    onResize() {
        this.board.offset = { x: (canvas.width / 2) - (this.board.width * 50) / 2, y: (canvas.height / 2) - (this.board.height * 50) / 2 };
    }

    onKeyDown(event) {
    }

    onKeyUp(event) {
    }

    onMouseUp(event) {
        let clickedTile = this.tiles.find(tile => tile.isMouseOver(event));
        if (clickedTile) {
            this.tiles.splice(this.tiles.findIndex(tile => tile == clickedTile), 1);
            this.tiles.push(clickedTile);
            clickedTile.targetRadians += 90 * (Math.PI / 180);
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

    onMouseDown(event) {
    }


    onRightClick(event) {
        event.preventDefault();
    }

    onTouchStart(event) {

    }

    onTouchMove(event) {

    }

    onTouchEnd(event) {

    }
}

class Tile {
    constructor(board, x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.center = { x: 25, y: 25 };
        this.radians = (90 * Math.floor(4 * Math.random())) * (Math.PI / 180);
        this.targetRadians = (90 * Math.floor(4 * Math.random())) * (Math.PI / 180);
        this.piece = Math.floor(6 * Math.random());
        this.board = board;
        this.isHovered = false;
    }

    update(delta) {
        if (this.targetRadians != this.radians) {
            this.radians += Math.min((9 * (Math.PI / 180)), this.targetRadians - this.radians);
        }
    }

    draw(context) {
        context.fillStyle = "gray";
        context.strokeStyle = "gray";
        if (activeState.pathTiles.includes(this)) {
            context.fillStyle = "blue";
            context.strokeStyle = "blue";
        }
        if (this.isHovered) {
            context.strokeStyle = "yellow";
        }
        context.save();
        context.translate((this.x * this.width) + this.board.offset.x + (this.x * 3), (this.y * this.height) + this.board.offset.y + (this.y * 3));
        context.rotate(this.radians);
        context.beginPath();
        context.rect(-this.center.x, -this.center.y, this.width, this.height);
        context.fill();
        context.stroke();

        context.fillStyle = "limegreen";
        context.strokeStyle = "limegreen";
        context.lineWidth = 4;

        if (this.piece == 1) {
            context.beginPath();
            context.rect(- 2, -this.center.y, 4, this.height);
            context.fill();
        }
        if (this.piece == 2) {
            context.beginPath();
            context.rect(- 2, -this.center.y, 4, 2 + this.height / 2);
            context.fill();
            context.beginPath();
            context.rect(-this.center.x, -2, 2 + this.width / 2, 4);
            context.fill();
        }
        if (this.piece == 3) {
            context.beginPath();
            context.rect(- 2, -this.center.y, 4, this.height);
            context.fill();
            context.beginPath();
            context.rect(-this.center.x, -2, 2 + this.width / 2, 4);
            context.fill();
        }
        if (this.piece == 4) {
            context.beginPath();
            context.rect(- 2, -this.center.y, 4, this.height);
            context.fill();
            context.beginPath();
            context.rect(- this.center.x, -2, this.width, 4);
            context.fill();
        }
        if (this.piece == 5) {
            context.beginPath();
            context.rect(- 2, -this.center.y, 4, 4 + this.height / 4);
            context.fill();
            context.beginPath();
            context.arc(0, 0, 8, 0, 2 * Math.PI);
            context.stroke();
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
}
