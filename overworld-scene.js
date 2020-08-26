class OverworldScene {

    constructor() {
        this.camera = {};
        this.area = {};
        this.player = {};
        this.quests = [];
        this.rails = [];
    }

    init() {
        loadGame();
        this.camera = { x: 0, y: 0, center: { x: 0, y: 0 }, movementSpeed: 3 };

        this.area = {
            width: 2560,
            height: 2560,
        };

        var railData = [
            [
                { x: 896, y: 1024, node: 10, },
                { x: 1024, y: 1024 },
                { x: 1152, y: 1152 },
                { x: 1280, y: 1152, node: 10, down: 0 },
            ],
            [
                { x: 1280, y: 1152 + 30, node: 10, up: 1 },
                { x: 1408, y: 1152 + 30 },
                { x: 1536, y: 1280 },
                { x: 1664, y: 1280, node: 10 },
            ],
        ];
        this.rails = [];
        for (let i = 0; i < railData.length; i++) {
            let rail = new Rail();
            rail.setPath(railData[i]);
            this.rails.push(rail);
        }

        let currentNode = this.getRailNode(saveData.player.rail, saveData.player.railnode);
        this.player = {
            x: currentNode.x,
            y: currentNode.y,
            width: 20,
            height: 20,
            center: { x: 10, y: 10 },
            angle: 90 * Math.PI / 180,
            rotationSpeed: 3 * Math.PI / 180,
            movementSpeed: 3,
            target: { x: currentNode.x, y: currentNode.y },
            rail: saveData.player.rail,
            railnode: saveData.player.railnode,
        };

        this.camera.x = saveData.camera.x;
        this.camera.y = saveData.camera.y;

        this.quests = [];
        this.quests.push({ width: 3, height: 3, successRail: 1, successNode: 0 });
        this.quests.push({ width: 3, height: 3, successRail: 0, successNode: 3 });


        for (let i = 0; i < 256; i++) {
            keys[i] = false;
        }

        dragCompleted = false;
        isDragging = false;
        this.updateCamera(0);
    }

    getRailNode(rail, node) {
        return this.rails[rail].getPath()[node];
    }

    update(delta) {
        gameTicks++;
        this.updateBackground(delta);
        // this.quest.update(delta);
        this.updatePlayer(delta);

        // if (this.quest.withinBounds(this.player)) {
        //     this.saveScene();
        //     changeState(2);
        // }

        if (keys[KeyCode.Esc]) {
            this.player.rail = 0;
            this.player.railnode = 0;
            this.saveScene();
            changeState(0);
        }
    }
    draw(context) {
        context.save();
        context.translate(-this.camera.x + dragDelta.x, -this.camera.y + dragDelta.y);

        this.drawBackground(context);
        this.drawRail(context);
        this.drawPlayer(context);

        context.restore();
    }

    saveScene() {
        saveData.player.rail = this.player.rail;
        saveData.player.railnode = this.player.railnode;
        saveData.camera.x = this.camera.x;
        saveData.camera.y = this.camera.y;
        saveGame();
    }

    updateCamera(delta) {
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
        context.fillStyle = "#404040";
        context.lineWidth = 3;
        for (let y = 0; y < Math.floor(this.area.height / 128); y++) {
            for (let x = 0; x < Math.floor(this.area.width / 128); x++) {
                context.beginPath();
                context.rect(x * 128, y * 128, 128, 128);
                context.fill();
            }
        }
    }

    drawRail(context) {
        context.strokeStyle = Color.LightBlue;
        context.lineWidth = 4;
        for (let i = 0; i < this.rails.length; i++) {
            let rail = this.rails[i];
            rail.draw(context);
        }
    }

    updatePlayer(delta) {
        let playerInputReceived = false;
        let previousNode = this.getRailNode(this.player.rail, this.player.railnode - 1);
        let nextNode = this.getRailNode(this.player.rail, this.player.railnode + 1);

        if (keys[KeyCode.W] || keys[KeyCode.Up]) {
            this.jumpUpRail();
            playerInputReceived = true;
        }

        if (keys[KeyCode.S] || keys[KeyCode.Down]) {
            this.jumpDownRail();
            playerInputReceived = true;
        }

        if (keys[KeyCode.Enter]) {
            let currentRail = this.getRailNode(this.player.rail, this.player.railnode);
            if (null != currentRail.up) {
                this.jumpUpRail();
            } else {
                if (null != currentRail.down) {
                    this.jumpDownRail();
                }
            }
        }


        if (this.player.x == this.player.target.x && this.player.y == this.player.target.y) {

            if (keys[KeyCode.A] || keys[KeyCode.Left]) {
                this.moveToPreviousNode();
                playerInputReceived = true;
            }

            if (keys[KeyCode.D] || keys[KeyCode.Right] && nextNode) {
                this.moveToNextNode();
                playerInputReceived = true;
            }
        }

        if (Math.abs(this.player.x - this.player.target.x) <= this.player.movementSpeed) {
            this.player.x = this.player.target.x;
        }

        if (Math.abs(this.player.y - this.player.target.y) <= this.player.movementSpeed) {
            this.player.y = this.player.target.y;
        }

        if (previousNode && this.player.x == previousNode.x && this.player.y == previousNode.y) {
            this.player.railnode--;
            this.saveScene();
            let currentNode = this.getRailNode(this.player.rail, this.player.railnode);
            if (!currentNode.node) {
                this.moveToPreviousNode();
            }
        }
        if (nextNode && this.player.x == nextNode.x && this.player.y == nextNode.y) {
            this.player.railnode++;
            this.saveScene();
            let currentNode = this.getRailNode(this.player.rail, this.player.railnode);
            if (!currentNode.node) {
                this.moveToNextNode();
            }
        }

        if (this.player.target.x != this.player.x || this.player.target.y != this.player.y) {
            let angle = (Math.atan2(this.player.target.y - this.player.y, this.player.target.x - this.player.x));
            this.player.x += this.player.movementSpeed * Math.cos(angle);
            this.player.y += this.player.movementSpeed * Math.sin(angle);

            playerInputReceived = true;
        }

        //area boundaries
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
        if (playerInputReceived) {
            this.updateCamera(delta);
        }
    }

    moveToPreviousNode() {
        let previousNode = this.getRailNode(this.player.rail, this.player.railnode - 1);
        if (previousNode) {
            this.player.target.x = previousNode.x;
            this.player.target.y = previousNode.y;
        }
    }

    moveToNextNode() {
        let nextNode = this.getRailNode(this.player.rail, this.player.railnode + 1);
        if (nextNode) {
            this.player.target.x = nextNode.x;
            this.player.target.y = nextNode.y;
        }
    }

    jumpUpRail() {
        let currentRail = this.getRailNode(this.player.rail, this.player.railnode);
        if (null != currentRail.up) {
            let quest = this.quests[currentRail.up];
            puzzleRules = quest;
            this.saveScene();
            changeState(2);
        }
    }

    jumpDownRail() {
        let currentRail = this.getRailNode(this.player.rail, this.player.railnode);
        if (null != currentRail.down) {
            let quest = this.quests[currentRail.down];
            puzzleRules = quest;
            this.saveScene();
            changeState(2);
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

        }
        if (Math.abs(dragDelta.x) > 0 || Math.abs(dragDelta.y) > 0) {
            dragDelta.x = 0;
            dragDelta.y = 0;
            return;
        }
        if (!(this.player.x == this.player.target.x && this.player.y == this.player.target.y)) {
            return;
        }
        if (Math.abs((this.camera.x + event.clientX) - this.player.x) > Math.abs((this.camera.y + event.clientY) - this.player.y)) {
            if (this.camera.x + event.clientX > this.player.x) {
                this.moveToNextNode();
            } else if (this.camera.x + event.clientX < this.player.x) {
                this.moveToPreviousNode();
            }
        } else {
            if (this.camera.y + event.clientY > this.player.y) {
                this.jumpDownRail();
            } else if (this.camera.y + event.clientY < this.player.y) {
                this.jumpUpRail();
            }
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
                if (!(this.player.x == this.player.target.x && this.player.y == this.player.target.y)) {
                    return;
                }
                //is this touch more vertical or horizontal?
                let touchX = parseInt(event.changedTouches[0].clientX);
                let touchY = parseInt(event.changedTouches[0].clientY);

                if (Math.abs((this.camera.x + touchX) - this.player.x) > Math.abs((this.camera.y + touchY) - this.player.y)) {
                    if (this.camera.x + touchX > this.player.x) {
                        this.moveToNextNode();
                    } else if (this.camera.x + touchX < this.player.x) {
                        this.moveToPreviousNode();
                    }
                } else {
                    if (this.camera.y + touchY > this.player.y) {
                        this.jumpDownRail();
                    } else if (this.camera.y + touchY < this.player.y) {
                        this.jumpUpRail();
                    }
                }
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

class Rail {
    constructor() {
        this.vertexes = [];
    }

    setPath(vertexes) {
        this.vertexes = vertexes;
    }
    getPath() {
        return this.vertexes;
    }

    draw(context) {
        for (let i = 0; i < this.vertexes.length - 1; i++) {
            let vertex = this.vertexes[i];
            let nextVertex = this.vertexes[i + 1];
            if (vertex.node) {
                context.beginPath();
                context.arc(vertex.x, vertex.y, vertex.node, 0, 2 * Math.PI);
                context.stroke();
            }
            context.beginPath();
            context.moveTo(vertex.x, vertex.y);
            context.lineTo(nextVertex.x, nextVertex.y);
            context.stroke();
        }

        let lastVertex = this.vertexes[this.vertexes.length - 1];
        if (lastVertex.node) {
            context.beginPath();
            context.arc(lastVertex.x, lastVertex.y, lastVertex.node, 0, 2 * Math.PI);
            context.stroke();
        }
    }
}
