class OverworldScene {

    constructor() {
        this.camera = {};
        this.area = {};
        this.player = {};
        this.quests = [];
        this.rails = [];
        this.events = [];
        this.script = [];
    }

    init() {
        loadGame();
        this.camera = { x: 0, y: 0, center: { x: 0, y: 0 }, movementSpeed: 3 };

        this.area = {
            width: 2560,
            height: 2560,
        };

        var railData = [
            {
                isActivated: true,
                isVisible: true,
                activationUnlock: 0,
                visibleUnlock: 0,
                path: [
                    // { x: 768, y: 1024, node: 10 },
                    { x: 896, y: 1024, node: 10, enter: 0 },
                    { x: 1024, y: 1024 },
                    { x: 1152, y: 1152 },
                    { x: 1280, y: 1152, node: 10, down: 0, enter: 1 },
                    { x: 1408, y: 1024 },
                    { x: 1536, y: 1024, node: 10 },
                ],
                pathUnlocks: [
                    { node: 5, unlock: 3, up: 2 },
                ],
            },
            {
                isActivated: false,
                isVisible: true,
                activationUnlock: 2,
                visibleUnlock: 0,
                path: [
                    { x: 1280, y: 1152 + 30, node: 10, up: 1, enter: 2 },
                    { x: 1408, y: 1152 + 30 },
                    { x: 1536, y: 1280 },
                    { x: 1664, y: 1280, node: 10, enter: 3 },
                ],
                pathUnlocks: [],
            },
            {
                isActivated: false,
                isVisible: false,
                activationUnlock: 4,
                visibleUnlock: 3,
                path: [
                    { x: 1536, y: 1024 - 30, node: 10, down: 3, enter: 4 },
                    { x: 1664, y: 896 },
                    { x: 1664, y: 768 },
                    { x: 1792, y: 768, node: 10 },
                ],
                pathUnlocks: [],
            },
        ];
        this.rails = [];
        for (let i = 0; i < railData.length; i++) {
            let rail = new Rail();
            rail.setPath(railData[i].path);
            rail.setPathUnlocks(railData[i].pathUnlocks);
            rail.activationUnlock = railData[i].activationUnlock;
            rail.visibleUnlock = railData[i].visibleUnlock;
            rail.isActivated = railData[i].isActivated;// || saveData.unlocked.includes(rail.activationUnlock);
            rail.isVisible = railData[i].isVisible;// || saveData.unlocked.includes(rail.visibleUnlock);
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
        this.quests.push({ width: 3, height: 8, successRail: 2, successNode: 0 });
        this.quests.push({ width: 3, height: 8, successRail: 0, successNode: 5 });

        this.events = [];

        let railEvent = new RailEvent(this, 0);
        railEvent.addDialog(1, 1, "What are you doing here?");
        railEvent.addDialog(0, 0, "Oh, uh... hello there :D");
        railEvent.addDialog(1, 1, "What are you looking for?");
        this.events.push(railEvent);

        railEvent = new RailEvent(this, 1);
        railEvent.addDialog(1, 1, "That connection is broken.");
        railEvent.addDialog(0, 0, "So I can't go this way?");
        railEvent.addDialog(1, 1, "Not unless you can fix the connection.");
        this.events.push(railEvent);

        railEvent = new RailEvent(this, 2);
        railEvent.addDialog(1, 1, "How did you get here?");
        railEvent.addDialog(0, 0, "I made the thingie light up?");
        railEvent.addDialog(1, 1, "You can't be here! Stop it.");
        this.events.push(railEvent);

        railEvent = new RailEvent(this, 3);
        railEvent.addDialog(0, 0, "Hey, are you there?");
        railEvent.addDialog(1, 1, "You're still here? What do you want?");
        railEvent.addDialog(0, 0, "I'm stuck. What do I do now?");
        railEvent.addDialog(1, 1, "Go away. Go back where you came from. You're not allowed here.");

        this.events.push(railEvent);

        railEvent = new RailEvent(this, 4);
        railEvent.addDialog(1, 1, "This is getting tiresome.");
        railEvent.addDialog(0, 0, "I want to see where this goes! ;)");
        railEvent.addDialog(1, 1, "Nowhere fast.");

        this.events.push(railEvent);

        for (let i = 0; i < 256; i++) {
            keys[i] = false;
        }

        dragCompleted = false;
        isDragging = false;
        this.updateCamera(0);

        this.dialog = new Dialog();

        this.script = [];
        if (currentNode.enter != null) {
            this.events[currentNode.enter].run();
        }
        this.updateRailUnlocks();
    }

    updateRailUnlocks() {
        for (let i = 0; i < this.rails.length; i++) {
            let rail = this.rails[i];
            rail.isActivated = rail.activationUnlock == 0 || saveData.unlocked.includes(rail.activationUnlock);
            rail.isVisible = rail.visibleUnlock == 0 || saveData.unlocked.includes(rail.visibleUnlock);
            for (let j = 0; j < rail.pathUnlocks.length; j++) {
                let unlock = rail.pathUnlocks[j];
                if (saveData.unlocked.includes(unlock.unlock)) {
                    rail.vertexes[unlock.node].up = unlock.up;
                }
            }
        }
    }

    getRailNode(rail, node) {
        return this.rails[rail].getPath()[node];
    }

    update(delta) {
        gameTicks++;
        this.updateBackground(delta);

        if (keys[KeyCode.Esc]) {
            this.player.rail = 0;
            this.player.railnode = 0;
            this.saveScene();
            changeState(0);
        }

        // this.quest.update(delta);
        if (this.script.length > 0) {
            this.dialog.display(this.script[0].character, this.script[0].side, this.script[0].text);
            this.dialog.update(delta);

            if (keys[KeyCode.Space] || keys[KeyCode.Enter]) {
                this.script.shift();
                keys[KeyCode.Space] = false;
                keys[KeyCode.Enter] = false;
            }
            return;
        } else {
            this.dialog.hide();
        }
        this.updatePlayer(delta);
    }
    draw(context) {
        context.save();
        context.translate(-this.camera.x + dragDelta.x, -this.camera.y + dragDelta.y);

        this.drawBackground(context);
        this.drawRail(context);
        this.drawPlayer(context);

        context.restore();

        this.dialog.draw(context);
    }

    saveScene() {
        saveData.player.rail = this.player.rail;
        saveData.player.railnode = this.player.railnode;
        saveData.camera.x = this.camera.x;
        saveData.camera.y = this.camera.y;
        saveGame();
        this.updateRailUnlocks();
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
        context.lineWidth = 4;
        for (let i = 0; i < this.rails.length; i++) {
            let rail = this.rails[i];
            if (!rail.isVisible) {
                continue;
            }
            if (rail.isActivated) {
                context.strokeStyle = Color.LightBlue;
            } else {
                context.strokeStyle = Color.DarkBlue;
            }
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
            } else {
                if (currentNode.enter != null) {
                    this.events[currentNode.enter].run();
                }
            }
        }
        if (nextNode && this.player.x == nextNode.x && this.player.y == nextNode.y) {
            this.player.railnode++;
            this.saveScene();
            let currentNode = this.getRailNode(this.player.rail, this.player.railnode);
            if (!currentNode.node) {
                this.moveToNextNode();
            } else {
                if (currentNode.enter != null) {
                    this.events[currentNode.enter].run();
                }
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
        let currentRailNode = this.getRailNode(this.player.rail, this.player.railnode);
        if (null != currentRailNode.up) {
            let quest = this.quests[currentRailNode.up];
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
        this.dialog.onResize();
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
        if (this.script.length > 0) {
            this.script.shift();
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
                if (this.script.length > 0) {
                    return;
                }

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

class Rail {
    constructor() {
        this.vertexes = [];
        this.isActivated = false;
        this.activationUnlock = 0;
        this.visibleUnlock = 0;
        this.pathUnlocks = [];
    }

    setPath(vertexes) {
        this.vertexes = vertexes;
    }
    getPath() {
        return this.vertexes;
    }

    setPathUnlocks(unlocks) {
        this.pathUnlocks = unlocks;
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
            let angle = -Math.atan2(vertex.x - nextVertex.x, vertex.y - nextVertex.y) - (90 * Math.PI / 180);

            if (vertex.node) {
                context.moveTo(vertex.x + vertex.node * Math.cos(angle), vertex.y + vertex.node * Math.sin(angle));
            } else {
                context.moveTo(vertex.x, vertex.y);
            }
            if (nextVertex.node) {
                // let angle = -Math.atan2(vertex.x - nextVertex.x, vertex.y - nextVertex.y) - (90 * Math.PI / 180);
                context.lineTo(nextVertex.x - nextVertex.node * Math.cos(angle), nextVertex.y - nextVertex.node * Math.sin(angle));
            } else {
                context.lineTo(nextVertex.x, nextVertex.y);
            }
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

class RailEvent {
    constructor(container, lock) {
        this.container = container;
        this.lock = lock;
        this.script = [];
    }

    addDialog(character, side, text) {
        this.script.push({ character: character, side: side, text: text });
    }

    run() {
        if (saveData.unlocked.includes(this.lock)) {
            return;
        }
        this.container.script = this.container.script.concat(this.script);
        saveData.unlocked.push(this.lock);
    }
}
