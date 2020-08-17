class OverworldScene {

    constructor() {
        this.area = {
            width: 2560,
            height: 2560,
        };
        this.player = {
            x: 1280,
            y: 1280,
            width: 20,
            height: 20,
            center: { x: 10, y: 10 },
            angle: 90 * Math.PI / 180,
            rotationSpeed: 3 * Math.PI / 180,
            movementSpeed: 3,
            target: { x: 1280, y: 1280 },
        };

        this.quest = { x: 1400, y: 1200 };

    }

    init() {
        this.area = {
            width: 2560,
            height: 2560,
        };
        this.player = {
            x: 1280,
            y: 1280,
            width: 20,
            height: 20,
            center: { x: 10, y: 10 },
            angle: 90 * Math.PI / 180,
            rotationSpeed: 3 * Math.PI / 180,
            movementSpeed: 3,
            target: { x: 1280, y: 1280 },
        };

        this.quest = { x: 1400, y: 1200 };
    }

    update(delta) {
        gameTicks++;
        this.updateCamera(delta);
        this.updateBackground(delta);
        this.updateQuest(delta);
        this.updatePlayer(delta);

        if (keys[KeyCode.P]) {
            changeState(2);
        }
    }
    draw(context) {
        context.save();
        context.translate(-camera.x + dragDelta.x, -camera.y + dragDelta.y);

        this.drawBackground(context);

        this.drawQuest(this.quest, context);
        this.drawPlayer(context);

        context.restore();
    }

    updateCamera(delta) {

        let playerRatioX = (this.player.x - camera.x) / canvas.width;
        if (playerRatioX < 0.3) {
            camera.x = this.player.x - (0.3 * canvas.width);
        }

        if (playerRatioX > 0.7) {
            camera.x = this.player.x - (0.7 * canvas.width);
        }

        let playerRatioY = (this.player.y - camera.y) / canvas.height;
        if (playerRatioY < 0.3) {
            camera.y = this.player.y - (0.3 * canvas.height);
        }

        if (playerRatioY > 0.7) {
            camera.y = this.player.y - (0.7 * canvas.height);
        }

    }

    updateBackground(delta) {
    }

    drawBackground(context) {
        context.strokeStyle = "limegreen";
        context.lineWidth = 3;
        for (let y = 0; y < Math.floor(this.area.height / 128); y++) {
            for (let x = 0; x < Math.floor(this.area.width / 128); x++) {
                context.beginPath();
                context.rect(x * 128, y * 128, 128, 128);
                context.stroke();
            }
        }
    }

    updateQuest(delta) {
        this.quest.y += 0.4 * Math.sin((8 * gameTicks % 360) * (Math.PI / 180));
    }

    drawQuest(quest, context) {
        context.fillStyle = "yellow";
        context.beginPath();
        context.moveTo(quest.x, quest.y);
        context.bezierCurveTo(quest.x - 25, quest.y, quest.x - 10, quest.y + 50, quest.x, quest.y + 50);
        context.bezierCurveTo(quest.x + 10, quest.y + 50, quest.x + 25, quest.y, quest.x, quest.y);
        context.fill();

        context.beginPath();
        context.arc(quest.x, quest.y + 70, 10, 0, 2 * Math.PI);
        context.fill();
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
        context.fillStyle = "crimson";
        context.translate(this.player.x, this.player.y);
        context.rotate(this.player.angle);
        context.beginPath();
        context.rect(-this.player.center.x, -this.player.center.y, this.player.width, this.player.height);
        context.fill();
        context.restore();
    }

    onResize() {
    }

    onKeyDown(event) {
    }

    onKeyUp(event) {
    }

    onMouseUp(event) {
        if (event.button == 2) { //startDrag.time + 100 >= new Date().getUTCMilliseconds()
            this.player.target.x = camera.x + startDrag.x;
            this.player.target.y = camera.y + startDrag.y;
            return;
        }

        if (isDragging) {
            isDragging = false;
            dragCompleted = true;
        }
    }

    onMouseMove(event) {
        if (isDragging) {
            dragDelta.x = event.clientX - startDrag.x;
            dragDelta.y = event.clientY - startDrag.y;
        }
    }

    onMouseDown(event) {
        if (isDragging) {
            return;
        }
        dragCompleted = false;
        if (event.button == 0) {
            isDragging = true;
        }

        startDrag.x = event.clientX;
        startDrag.y = event.clientY;
        dragDelta.x = 0;
        dragDelta.y = 0;
        startDrag.time = new Date().getUTCMilliseconds();
    }


    onRightClick(event) {
        event.preventDefault();
    }

    onTouchStart(event) {
        if (event.touches.length == 2) {
            isDragging = true;
            startDrag.x = parseInt(event.targetTouches[0].clientX);
            startDrag.y = parseInt(event.targetTouches[0].clientY);
            dragDelta.x = 0;
            dragDelta.y = 0;
            startDrag.time = new Date().getUTCMilliseconds();
        }
    }

    onTouchMove(event) {
        if (event.touches.length == 2) {
            dragDelta.x = parseInt(event.targetTouches[0].clientX) - startDrag.x;
            dragDelta.y = parseInt(event.targetTouches[0].clientY) - startDrag.y;
        }
    }

    onTouchEnd(event) {
        if (isDragging) {
            isDragging = false;
            dragCompleted = true;
            return;
        }

        if (event.touches.length == 0) { //I've let go of all points
            if (!isDragging && !dragCompleted) {
                this.player.target.x = camera.x + parseInt(event.changedTouches[0].clientX);
                this.player.target.y = camera.y + parseInt(event.changedTouches[0].clientY);
            }
        }
    }
}
