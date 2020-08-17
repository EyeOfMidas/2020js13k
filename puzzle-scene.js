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
        context.fillStyle = "gray";

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
    }

    update(delta) {
    }

    draw(context) {
        context.beginPath();
        context.rect((this.x * 50) + 50, (this.y * 50) + 50, 50, 50);
        context.fill();
    }
}
