class PuzzleScene {

    constructor() {
        this.board = {
            width: 8,
            height: 8,
        };

        this.tiles = [];
    }

    init() {
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                this.tiles.push(new Tile(x, y));
            }
        }
    }

    update(delta) {
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].update(delta);
        }
    }
    draw(context) {
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].draw(context);
        }
    }

    onResize() {
    }

    onKeyDown(event) {
    }

    onKeyUp(event) {
    }

    onMouseUp(event) {
    }

    onMouseMove(event) {
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].isHovered = false;
        }

        let boardOffsetX = event.clientX - 50;
        let boardOffsetY = event.clientY - 50;

        let x = Math.floor(boardOffsetX / 50);
        let y = Math.floor(boardOffsetY / 50);


        let hoveredTile = this.tiles.find(tile => tile.x == x && tile.y == y);

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
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.piece = 1;
        this.isHovered = false;
    }

    update(delta) {
    }

    draw(context) {
        if (!this.isHovered) {
            context.fillStyle = "gray";
        } else {
            context.fillStyle = "yellow";
        }
        context.beginPath();
        context.rect((this.x * 50) + 50, (this.y * 50) + 50, 50, 50);
        context.fill();
    }
}
