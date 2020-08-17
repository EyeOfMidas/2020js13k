class PuzzleScene {

    constructor() {
        this.board = {
            width: 8,
            height: 8,
            offset: { x: 100, y: 100 }
        };

        this.tiles = [];
    }

    init() {
        this.tiles = [];
        this.board.offset = { x: (canvas.width / 2) - (this.board.width * 50) / 2, y: (canvas.height / 2) - (this.board.height * 50) / 2 };
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                this.tiles.push(new Tile(this.board, x, y));
            }
        }
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

        let boardOffsetX = event.clientX - 50;
        let boardOffsetY = event.clientY - 50;

        let x = Math.floor(boardOffsetX / 50);
        let y = Math.floor(boardOffsetY / 50);


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
        this.radians = 0 * (Math.PI / 180);
        this.targetRadians = 0 * (Math.PI / 180);
        this.piece = 1;
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
