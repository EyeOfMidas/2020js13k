class MenuScene {

    constructor() {
        this.playButton = null;
    }

    init() {
        this.playButton = new Button(canvas.width / 2, canvas.height / 2, "Play", () => { changeState(1); });
        this.deleteSave = new Button(canvas.width / 2, canvas.height - 100, "Delete Save", () => { if (confirm('Are you sure you want to delete your game save?')) { deleteGame(); alert("Save deleted.") } });
        this.deleteSave.width = 100;
        this.deleteSave.height = 40;
        this.deleteSave.fontSize = 18;
        this.deleteSave.fontFamily = "Trebuchet MS";
        this.deleteSave.buttonColor = "darkred";
        this.deleteSave.buttonHoverColor = "crimson";
        this.deleteSave.textColor = "crimson";
        this.deleteSave.textHoverColor = "white";
    }

    update(delta) {
        if (keys[KeyCode.Enter]) {
            changeState(1);
        }
        this.playButton.update(delta);
        this.deleteSave.update(delta);
    }
    draw(context) {
        context.fillStyle = Color.LightBlue;
        context.textAlign = "center";
        context.font = "48px Trebuchet MS";
        context.fillText("404", canvas.width / 2, (canvas.height / 4));
        context.font = "18px Trebuchet MS";
        context.fillText("Theme (not) Found", canvas.width / 2, (canvas.height / 4) + 20);
        this.playButton.draw(context);
        this.deleteSave.draw(context);
    }

    onResize() {
        this.playButton.x = canvas.width / 2;
        this.playButton.y = canvas.height / 2;
        this.deleteSave.x = canvas.width / 2;
        this.deleteSave.y = canvas.height - 100;
    }

    onMouseMove(event) {
        this.playButton.isHovered = false;
        document.body.style.cursor = "default";
        if (this.playButton.isMouseOver(event)) {
            this.playButton.isHovered = true;
            document.body.style.cursor = "pointer";
        }
        this.deleteSave.isHovered = false;
        if (this.deleteSave.isMouseOver(event)) {
            this.deleteSave.isHovered = true;
            document.body.style.cursor = "pointer";

        }
    }

    onMouseUp(event) {
        if (this.playButton.isMouseOver(event)) {
            this.playButton.triggerHandler();
            document.body.style.cursor = "default";
        }
        if (this.deleteSave.isMouseOver(event)) {
            this.deleteSave.triggerHandler();
            document.body.style.cursor = "default";
        }
    }

    onTouchEnd(event) {
        if (this.playButton.isTouchOver(event)) {
            changeState(1);
            document.body.style.cursor = "default";
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
        this.isHovered = false;
        this.buttonColor = Color.DarkBlue;
        this.buttonHoverColor = Color.LightGray;
        this.textColor = Color.LightBlue;
        this.textHoverColor = Color.White;
        this.fontSize = 48;
        this.fontFamily = "Trebuchet MS";
    }
    update(delta) {
    }

    draw(context) {
        context.fillStyle = this.buttonColor;
        if (this.isHovered) {
            context.fillStyle = this.buttonHoverColor;
        }
        context.save();
        context.translate(this.x, this.y);
        context.beginPath();
        context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.fill();
        context.fillStyle = this.textColor;
        if (this.isHovered) {
            context.fillStyle = this.textHoverColor;
        }
        context.textAlign = "center";
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillText(this.text, 0, this.fontSize / 3);
        context.restore();

    }

    isMouseOver(event) {
        return event.clientX > this.x - (this.width / 2) && event.clientX < this.x + this.width - (this.width / 2) &&
            event.clientY > this.y - (this.height / 2) && event.clientY < this.y + this.height - (this.height / 2);
    }

    isTouchOver(event) {
        return event.changedTouches[0].clientX > this.x - (this.width / 2) && event.changedTouches[0].clientX < this.x + this.width - (this.width / 2) &&
            event.changedTouches[0].clientY > this.y - (this.height / 2) && event.changedTouches[0].clientY < this.y + this.height - (this.height / 2);
    }

    triggerHandler() {
        this.handler();
    }
}
