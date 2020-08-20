class OverworldScene {

    constructor() {
        this.camera = {};
        this.area = {};
        this.player = {};
        this.quest = {};
    }

    init() {
        loadGame();
        this.camera = { x: 0, y: 0, center: { x: 0, y: 0 }, movementSpeed: 3 };

        this.area = {
            width: 2560,
            height: 2560,
        };
        this.player = {
            x: saveData.player.x,
            y: saveData.player.y,
            width: 20,
            height: 20,
            center: { x: 10, y: 10 },
            angle: 90 * Math.PI / 180,
            rotationSpeed: 3 * Math.PI / 180,
            movementSpeed: 3,
            target: { x: saveData.player.x, y: saveData.player.y },
        };

        // this.quest = {
        //     x: 1400, y: 1200,
        //     bounds: { width: 25, height: 25 },
        // };

        this.quest = new Quest(1400, 1200);

        for (let i = 0; i < 256; i++) {
            keys[i] = false;
        }

        dragCompleted = false;
        isDragging = false;
    }

    update(delta) {
        gameTicks++;
        this.updateCamera(delta);
        this.updateBackground(delta);
        this.quest.update(delta);
        this.updatePlayer(delta);

        if (this.quest.withinBounds(this.player)) {
            saveData.player.x = this.quest.x;
            saveData.player.y = this.quest.y + this.quest.bounds.height;
            saveGame();
            changeState(2);
        }

        if (keys[KeyCode.Esc]) {
            saveData.player.x = 1280;
            saveData.player.y = 1280;
            saveGame();
            changeState(0);
        }
    }
    draw(context) {
        context.save();
        context.translate(-this.camera.x + dragDelta.x, -this.camera.y + dragDelta.y);

        this.drawBackground(context);

        this.drawPlayer(context);
        this.quest.draw(context);

        context.restore();
    }

    updateCamera(delta) {
        if (dragCompleted) {
            return;
        }
        let playerRatioX = (this.player.x - this.camera.x) / canvas.width;
        if (playerRatioX < 0.3) {
            this.camera.x = this.player.x - (0.3 * canvas.width);
        }

        if (playerRatioX > 0.7) {
            this.camera.x = this.player.x - (0.7 * canvas.width);
        }

        let playerRatioY = (this.player.y - this.camera.y) / canvas.height;
        if (playerRatioY < 0.3) {
            this.camera.y = this.player.y - (0.3 * canvas.height);
        }

        if (playerRatioY > 0.7) {
            this.camera.y = this.player.y - (0.7 * canvas.height);
        }
    }

    updateBackground(delta) {
    }

    drawBackground(context) {
        context.strokeStyle = Color.DarkGray;
        context.lineWidth = 3;
        for (let y = 0; y < Math.floor(this.area.height / 128); y++) {
            for (let x = 0; x < Math.floor(this.area.width / 128); x++) {
                context.beginPath();
                context.rect(x * 128, y * 128, 128, 128);
                context.stroke();
            }
        }
    }

    updatePlayer(delta) {
        if (keys[KeyCode.W] || keys[KeyCode.Up]) {
            this.player.y += -this.player.movementSpeed * delta;
            this.player.target.y = this.player.y;
        }

        if (keys[KeyCode.S] || keys[KeyCode.Down]) {
            this.player.y += this.player.movementSpeed * delta;
            this.player.target.y = this.player.y;
        }

        if (keys[KeyCode.A] || keys[KeyCode.Left]) {
            this.player.x += -this.player.movementSpeed * delta;
            this.player.target.x = this.player.x;
        }

        if (keys[KeyCode.D] || keys[KeyCode.Right]) {
            this.player.x += this.player.movementSpeed * delta;
            this.player.target.x = this.player.x;
        }

        if (keys[KeyCode.Q]) {
            this.player.angle -= this.player.rotationSpeed * delta;
        }

        if (keys[KeyCode.E]) {
            this.player.angle += this.player.rotationSpeed * delta;
        }

        if (Math.abs(this.player.x - this.player.target.x) <= this.player.movementSpeed) {
            this.player.x = this.player.target.x;
        }

        if (Math.abs(this.player.y - this.player.target.y) <= this.player.movementSpeed) {
            this.player.y = this.player.target.y;
        }

        if (this.player.target.x != this.player.x || this.player.target.y != this.player.y) {
            let angle = (Math.atan2(this.player.target.y - this.player.y, this.player.target.x - this.player.x));
            this.player.x += this.player.movementSpeed * Math.cos(angle);
            this.player.y += this.player.movementSpeed * Math.sin(angle);
        }

        if (this.player.x > this.area.width - this.player.width / 2) {
            this.player.x = this.area.width - this.player.width / 2;
            this.player.target.x = this.player.x;
        }
        if (this.player.x < 0 + this.player.width / 2) {
            this.player.x = this.player.width / 2;
            this.player.target.x = this.player.x;
        }
        if (this.player.y > this.area.height - this.player.height / 2) {
            this.player.y = this.area.height - this.player.height / 2;
            this.player.target.y = this.player.y;
        }
        if (this.player.y < 0 + this.player.height / 2) {
            this.player.y = this.player.height / 2;
            this.player.target.y = this.player.y;
        }
    }
    drawPlayer(context) {
        context.save();
        context.fillStyle = Color.LightBlue;
        context.translate(this.player.x, this.player.y);
        context.rotate(this.player.angle);
        context.beginPath();
        context.rect(-this.player.center.x, -this.player.center.y, this.player.width, this.player.height);
        context.fill();
        context.restore();
    }

    onResize() {
        this.camera.center.x = canvas.width / 2;
        this.camera.center.y = canvas.height / 2;
    }

    onMouseUp(event) {
        if (isDragging) {
            isDragging = false;
            dragCompleted = true;
            this.camera.x -= dragDelta.x;
            this.camera.y -= dragDelta.y;
            dragDelta.x = 0;
            dragDelta.y = 0;
        }
        if (event.button == 2) { //startDrag.time + 100 >= new Date().getUTCMilliseconds()
            this.player.target.x = this.camera.x + event.clientX;
            this.player.target.y = this.camera.y + event.clientY;
            return;
        }

    }

    onMouseMove(event) {
        if (isDragging) {
            dragDelta.x = event.clientX - startDrag.x;
            dragDelta.y = event.clientY - startDrag.y;
        }
    }

    onMouseDown(event) {
        if (event.button == 0) {
            isDragging = true;
            startDrag.x = event.clientX;
            startDrag.y = event.clientY;
            dragDelta.x = 0;
            dragDelta.y = 0;
            startDrag.time = new Date().getUTCMilliseconds();
            return;
        }

        dragCompleted = false;
    }


    onRightClick(event) {
        event.preventDefault();
    }

    onTouchStart(event) {
        startDrag.x = parseInt(event.targetTouches[0].clientX);
        startDrag.y = parseInt(event.targetTouches[0].clientY);
        dragDelta.x = 0;
        dragDelta.y = 0;
        startDrag.time = new Date().getUTCMilliseconds();
        dragCompleted = false;
    }

    onTouchMove(event) {
        isDragging = true;
        dragDelta.x = parseInt(event.targetTouches[0].clientX) - startDrag.x;
        dragDelta.y = parseInt(event.targetTouches[0].clientY) - startDrag.y;
    }

    onTouchEnd(event) {
        if (event.touches.length == 0) { //I've let go of all points
            if (isDragging) {
                isDragging = false;
                dragCompleted = true;
                this.camera.x -= dragDelta.x;
                this.camera.y -= dragDelta.y;
                dragDelta.x = 0;
                dragDelta.y = 0;
                return;
            }

            if (!isDragging && !dragCompleted) {
                this.player.target.x = this.camera.x + parseInt(event.changedTouches[0].clientX);
                this.player.target.y = this.camera.y + parseInt(event.changedTouches[0].clientY);
            }
        }
    }
}

class Quest {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.bounds = { width: 25, height: 25 };
    }

    update(delta) {
        this.y += 0.4 * Math.sin((8 * gameTicks % 360) * (Math.PI / 180));
    }

    draw(context) {
        context.fillStyle = Color.White;
        context.beginPath();
        context.moveTo(this.x, this.y - 70);
        context.bezierCurveTo(this.x - 25, this.y - 70, this.x - 10, this.y - 20, this.x, this.y - 20);
        context.bezierCurveTo(this.x + 10, this.y - 20, this.x + 25, this.y - 70, this.x, this.y - 70);
        context.fill();

        context.beginPath();
        context.arc(this.x, this.y + 0, 10, 0, 2 * Math.PI);
        context.fill();

        // context.strokeStyle = Color.LightBlue;
        // context.beginPath();
        // context.rect(this.x - (this.bounds.width / 2), this.y - (this.bounds.height / 2), this.bounds.width, this.bounds.height);
        // context.stroke();
    }

    withinBounds(player) {
        return player.x > this.x - (this.bounds.width / 2) && player.y > this.y - (this.bounds.height / 2) &&
            player.x < (this.x - (this.bounds.width / 2)) + this.bounds.width && player.y < (this.y - (this.bounds.height / 2)) + this.bounds.height;
    }
}
