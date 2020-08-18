class MenuScene {

    constructor() {
        this.playButton = null;
    }

    init() {
        this.playButton = new Button(canvas.width / 2, canvas.height / 2, "Play", () => { alert('play'); });
    }

    update(delta) {
        if (keys[KeyCode.Enter]) {
            changeState(1);
        }
        this.playButton.update(delta);
    }
    draw(context) {
        this.playButton.draw(context);
    }

    onResize() {
        this.playButton.x = canvas.width / 2;
        this.playButton.y = canvas.height / 2;
    }

    onMouseMove(event) {
        if (this.playButton.isMouseOver(event)) {
            console.log("over button");
        }
    }

    onMouseUp(event) {
        if (this.playButton.isMouseOver(event)) {
            changeState(1);
        }
    }
}

class Button {
    constructor(x, y, text, handler) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 80;
        this.text = text;
        this.handler = handler;
    }
    update(delta) {
    }

    draw(context) {
        context.fillStyle = "crimson"
        context.save();
        context.translate(this.x, this.y);
        context.beginPath();
        context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.fill();
        context.fillStyle = "black";
        context.textAlign = "center";
        context.font = "48px Arial";
        context.fillText(this.text, 0, 0);
        context.restore();

    }

    isMouseOver(event) {
        return event.clientX > this.x - (this.width / 2) && event.clientX < this.x + this.width - (this.width / 2) &&
            event.clientY > this.y - (this.height / 2) && event.clientY < this.y + this.height - (this.height / 2);
    }
}
