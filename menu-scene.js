class MenuScene {

    constructor() {
        this.playButton = null;
        this.deleteSave = null;
        this.muteButton = null;
    }

    init() {
        this.playButton = new Button(canvas.width / 2, canvas.height / 2, "Start", () => {
            changeState(1);
        });
        this.deleteSave = new Button(canvas.width / 2, canvas.height - 100, "Delete Save", () => {
            if (confirm('Are you sure you want to delete your game save?')) {
                deleteGame();
                alert("Save deleted.");
                window.location.reload();
            }
        });
        this.deleteSave.width = 100;
        this.deleteSave.height = 40;
        this.deleteSave.fontSize = 18;
        this.deleteSave.buttonColor = Color.LightGray;
        this.deleteSave.buttonHoverColor = "crimson";
        this.deleteSave.textColor = Color.DarkGray;
        this.deleteSave.textHoverColor = Color.White;

        let startIcon = saveData.mute ? "🔇" : "🔈";
        this.muteButton = new Button(canvas.width - 50, 50, startIcon, () => {
            if (saveData.mute) {
                this.muteButton.text = "🔈";
            } else {
                this.muteButton.text = "🔇";
            }
            saveData.mute = !saveData.mute;
            sound.isMuted = saveData.mute;
        });
        this.muteButton.width = 20;
        this.muteButton.height = 28;
        this.muteButton.fontSize = 18;
        this.muteButton.buttonColor = "transparent";
        this.muteButton.buttonHoverColor = Color.LightGray;

        sound.isMuted = saveData.mute;
    }

    update(delta) {
        if (keys[KeyCode.Enter]) {
            changeState(1);
        }
        this.playButton.update(delta);
        this.deleteSave.update(delta);
        this.muteButton.update(delta);
    }
    draw(context) {
        this.drawBackground(context);
        context.fillStyle = Color.LightBlue;
        context.textAlign = "center";
        context.font = "48px Trebuchet MS";
        context.fillText("P4ck3t", canvas.width / 2, Math.max(70, (canvas.height / 4)));
        context.font = "22px Trebuchet MS";
        context.fillText("A js13k game entry", canvas.width / 2, Math.max(100, (canvas.height / 4) + 30));
        context.fillText("by EyeOfMidas", canvas.width / 2, Math.max(130, (canvas.height / 4) + 60));
        this.playButton.draw(context);
        this.deleteSave.draw(context);
        this.muteButton.draw(context);
    }

    drawBackground(context) {
        context.fillStyle = Color.VeryDarkBlue;

        for (let y = 0; y < canvas.height / 128; y++) {
            for (let x = 0; x < canvas.width / 128; x++) {
                let wobble = (Math.sin((x * 45) + new Date().getTime() / 500));
                context.save();
                context.translate(x * 128 + (10 * wobble), y * 128 + (20 * wobble));
                context.rotate(45 * (Math.PI / 180));
                context.beginPath();
                context.rect(-(wobble) - 4, -(wobble) - 4, 2 * wobble + 8, 2 * wobble + 8);
                context.fill();
                context.restore();
            }
        }
    }

    onResize() {
        this.playButton.x = canvas.width / 2;
        this.playButton.y = Math.max(200, canvas.height / 2);
        this.deleteSave.x = canvas.width / 2;
        this.deleteSave.y = Math.max(333, canvas.height - 100);
        this.muteButton.x = canvas.width - 50;
        this.muteButton.y = 50;
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
        this.muteButton.isHovered = false;
        if (this.muteButton.isMouseOver(event)) {
            this.muteButton.isHovered = true;
            document.body.style.cursor = "pointer";
        }
    }

    onMouseUp(event) {
        event.preventDefault();
        if (this.playButton.isMouseOver(event)) {
            this.playButton.triggerHandler();
            document.body.style.cursor = "default";
        }
        if (this.deleteSave.isMouseOver(event)) {
            this.deleteSave.triggerHandler();
            document.body.style.cursor = "default";
        }
        if (this.muteButton.isMouseOver(event)) {
            this.muteButton.triggerHandler();
            document.body.style.cursor = "default";
        }
    }

    onTouchEnd(event) {
        event.preventDefault();
        if (this.playButton.isTouchOver(event)) {
            this.playButton.triggerHandler();
            document.body.style.cursor = "default";
        }

        if (this.deleteSave.isTouchOver(event)) {
            this.deleteSave.triggerHandler();
            document.body.style.cursor = "default";
        }
        if (this.muteButton.isTouchOver(event)) {
            this.muteButton.triggerHandler();
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
        context.textAlign = "center";
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        let bounds = context.measureText(this.text);
        this.width = Math.max(this.width, bounds.width + 8);

        context.save();
        context.translate(this.x, this.y);
        context.beginPath();
        context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.fill();
        context.fillStyle = this.textColor;
        if (this.isHovered) {
            context.fillStyle = this.textHoverColor;
        }

        context.fillText(this.text, 0, this.fontSize / 3);
        context.restore();

    }

    isMouseOver(event) {
        return event.clientX > this.x - (this.width / 2) && event.clientX < this.x + this.width - (this.width / 2) &&
            event.clientY > this.y - (this.height / 2) && event.clientY < this.y + this.height - (this.height / 2);
    }

    isTouchOver(event) {
        let touchX = parseInt(event.changedTouches[0].clientX);
        let touchY = parseInt(event.changedTouches[0].clientY);

        return touchX > this.x - (this.width / 2) && touchX < this.x + this.width - (this.width / 2) &&
            touchY > this.y - (this.height / 2) && touchY < this.y + this.height - (this.height / 2);
    }

    triggerHandler() {
        this.handler();
    }
}
