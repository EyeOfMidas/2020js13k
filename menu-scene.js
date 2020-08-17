class MenuScene {

    constructor() {
        this.board = {
            width: 800,
            height: 600,
        };
    }

    init() {
    }

    update(delta) {
        if (keys[KeyCode.Enter]) {
            changeState(1);
        }
    }
    draw(context) {
        context.fillStyle = "crimson";
        context.beginPath();
        context.rect(50, 50, 50, 50);
        context.fill();
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
