class OverworldScene {

    constructor() {
        this.camera = {};
        this.area = {};
        this.player = {};
        this.rails = [];
        this.events = [];
        this.script = [];
        this.fadeAmount = 0;
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
                unlocks: {
                    isVisible: 0,
                    isActivated: 0,
                    isDamaged: 9,
                },
                path: [
                    // { x: 768, y: 1024, node: 10 },
                    { x: 896, y: 1024, node: 10, enter: 0 },
                    { x: 1024, y: 1024 },
                    { x: 1152, y: 1152 },
                    { x: 1280, y: 1152, node: 10, down: { width: 3, height: 3, successRail: 1, successNode: 0 }, enter: 1 },
                    { x: 1408, y: 1024 },
                    { x: 1536, y: 1024, node: 10 },
                ],
                pathUnlocks: [
                    { node: 5, unlock: 3, up: { width: 4, height: 4, successRail: 2, successNode: 0 } },
                ],
            },
            {
                unlocks: {
                    isVisible: 0,
                    isActivated: 2,
                    isDamaged: 9,
                },
                path: [
                    { x: 1280, y: 1152 + 30, node: 10, up: { width: 3, height: 4, successRail: 0, successNode: 3 }, enter: 2 },
                    { x: 1408, y: 1152 + 30 },
                    { x: 1536, y: 1280 },
                    { x: 1664, y: 1280, node: 10, enter: 3 },
                ],
                pathUnlocks: [],
            },
            {
                unlocks: {
                    isVisible: 3,
                    isActivated: 4,
                    isDamaged: 9,
                },
                path: [
                    { x: 1536, y: 1024 - 30, node: 10, down: { width: 5, height: 4, successRail: 0, successNode: 5 }, enter: 4 },
                    { x: 1664, y: 896 },
                    { x: 1664, y: 768 },
                    { x: 1792, y: 640, node: 10, enter: 5, up: { width: 4, height: 5, successRail: 3, successNode: 0 } },
                ],
                pathUnlocks: [
                    { node: 3, unlock: 6, down: { width: 4, height: 6, successRail: 4, successNode: 0 } },
                ],
            },
            {
                unlocks: {
                    isVisible: 4,
                    isActivated: 6,
                    isDamaged: 9,
                },
                path: [
                    { x: 1792, y: 640 - 30, node: 10, enter: 6, down: { width: 5, height: 4, successRail: 2, successNode: 3 } },
                    { x: 1920, y: 768, },
                    { x: 2048, y: 768 },
                    { x: 2176, y: 896, node: 10, enter: 7 },
                ],
                pathUnlocks: [],
            },
            {
                unlocks: {
                    isVisible: 6,
                    isActivated: 8,
                    isDamaged: 9,
                },
                path: [
                    { x: 1792, y: 640 + 30, node: 10, up: { width: 5, height: 4, successRail: 2, successNode: 3 }, enter: 8 },
                    { x: 1920 - 30, y: 768 + 30, },
                    { x: 2048, y: 768 + 30 },
                    { x: 2176, y: 896 + 30 },
                    { x: 2304 - 30, y: 1024 },
                    { x: 2432, y: 1024, node: 10, enter: 9 },
                ],
                pathUnlocks: [
                    { node: 5, unlock: 9, down: { width: 5, height: 4, successRail: 2, successNode: 3 } },
                ],
            },
            {
                unlocks: {
                    isVisible: 9,
                    isActivated: 9,
                    isDamaged: 10,
                },
                path: [
                    { x: 2176, y: 1152, node: 10, enter: 10 },
                    { x: 2304, y: 1024 + 30, },
                    { x: 2432, y: 1024 + 30, node: 10 },
                ],
                pathUnlocks: [],
            },
            {
                unlocks: {
                    isVisible: 9,
                    isActivated: 9,
                    isDamaged: 11,
                },
                path: [
                    { x: 1792, y: 1280, node: 10, down: { width: 6, height: 4, successRail: 7, successNode: 4 } },
                    { x: 1920, y: 1280 },
                    { x: 2048, y: 1152 },
                    { x: 2176, y: 1152, node: 10 },
                ],
                pathUnlocks: [],
            },
            {
                unlocks: {
                    isVisible: 10,
                    isActivated: 11,
                    isDamaged: 13,
                },
                path: [
                    { x: 1280, y: 1408, node: 10, enter: 12, up: { width: 0, height: 0, successRail: 8, successNode: 7 } },
                    { x: 1408, y: 1408 },
                    { x: 1536, y: 1280 + 30 },
                    { x: 1664, y: 1280 + 30 },
                    { x: 1792, y: 1280 + 30, node: 10, enter: 11 },
                ],
                pathUnlocks: [],
            },
            {
                unlocks: {
                    isVisible: 11,
                    isActivated: 13,
                },
                path: [
                    { x: 384, y: 1536 },
                    { x: 512, y: 1536 },
                    { x: 640, y: 1536 },
                    { x: 768, y: 1536 },
                    { x: 896, y: 1536 },
                    { x: 1024, y: 1536, enter: 14 },
                    { x: 1152, y: 1408 - 50 },
                    { x: 1280, y: 1408 - 50, node: 20, enter: 13 },
                ],
                pathUnlocks: [],
            },
        ];
        this.rails = [];
        for (let i = 0; i < railData.length; i++) {
            let rail = new Rail();
            rail.setPath(railData[i].path);
            rail.setPathUnlocks(railData[i].pathUnlocks);
            rail.unlocks = railData[i].unlocks;
            this.rails.push(rail);
        }

        let currentNode = this.getRailNode(saveData.player.rail, saveData.player.railnode);
        this.player = {
            x: currentNode.x,
            y: currentNode.y,
            width: 20,
            height: 20,
            center: { x: 10, y: 10 },
            angle: 45 * Math.PI / 180,
            rotationSpeed: 3 * Math.PI / 180,
            movementSpeed: 3,
            target: { x: currentNode.x, y: currentNode.y },
            rail: saveData.player.rail,
            railnode: saveData.player.railnode,
        };

        this.camera.x = saveData.camera.x;
        this.camera.y = saveData.camera.y;

        var eventData = [
            {
                lock: 0,
                dialog: [
                    { c: 1, s: 1, t: "What are you doing here?" },
                    { c: 0, s: 0, t: "Oh, uh... hello there :D" },
                    { c: 1, s: 1, t: "What are you looking for?" },
                    { c: 0, s: 0, t: "I'm here to... pick something up." },
                    { c: 1, s: 1, t: "Ha! This place is so old you'll never find what you're looking for." },
                ],
            },
            {
                lock: 1,
                dialog: [
                    { c: 1, s: 1, t: "That connection is broken." },
                    { c: 0, s: 0, t: "So I can't go this way?" },
                    { c: 1, s: 1, t: "Not unless you can fix the connection." },
                ],
            },
            {
                lock: 2,
                dialog: [
                    { c: 1, s: 1, t: "How did you get here?" },
                    { c: 0, s: 0, t: "I made the thingie light up?" },
                    { c: 1, s: 1, t: "You can't be here! Stop it." },
                ],
            },
            {
                lock: 3,
                dialog: [
                    { c: 0, s: 0, t: "Hey, are you there?" },
                    { c: 1, s: 1, t: "You're still here? What do you want?" },
                    { c: 0, s: 0, t: "I'm stuck. What do I do now?" },
                    { c: 1, s: 1, t: "Go away. Go back where you came from. You're not allowed here." },
                ],
            },

            {
                lock: 4,
                dialog: [
                    { c: 1, s: 1, t: "This is getting tiresome." },
                    { c: 0, s: 0, t: "I want to see where this goes! ;)" },
                    { c: 1, s: 1, t: "Nowhere fast." },
                ],
            },
            {
                lock: 5,
                dialog: [
                    { c: 1, s: 1, t: "You are a persistent little square, aren't you?" },
                    { c: 0, s: 0, t: "I have to get something. Do you know where I can get it from?" },
                    { c: 1, s: 1, t: "I might have an idea..." },
                ],
            },
            {
                lock: 6,
                dialog: [],
            },
            {
                lock: 7,
                dialog: [
                    { c: 1, s: 1, t: "What exactly are you looking for?" },
                    { c: 0, s: 0, t: "It's a kind of request. I'm not really sure ;)" },
                    { c: 1, s: 1, t: "Try that other branch. But I'm not making any promises!" },
                ],
            },
            {
                lock: 8,
                dialog: [],
            },
            {
                lock: 9,
                dialog: [
                    { c: 1, s: 1, t: "Fine. Look. You can have this." },
                    { c: 0, s: 0, t: "Woah! This is what I was looking for!" },
                    { c: 1, s: 1, t: "It's not what you think. Plus, you still have to get it out of here." },
                ],
                teleport: { rail: 5, node: 3, x: 2432, y: 1054 },
            },
            {
                lock: 10,
                dialog: [
                    { c: 1, s: 1, t: "Uh oh. Things are shutting down." },
                    { c: 0, s: 0, t: "Oh no! What should I do?!" },
                    { c: 1, s: 1, t: "Just get out of here. I might not see you again." },
                ],
                teleport: { rail: 6, node: 3, x: 2176, y: 1152 },
            },
            {
                lock: 11,
                dialog: [
                    { c: 1, s: 1, t: "I'll miss you, you annoying little square." },
                    { c: 0, s: 0, t: "..." }],
            },
            {
                lock: 12,
                dialog: [
                    { c: 0, s: 0, t: "I'm at the end! But this connection is much bigger than most..." },
                    { c: 0, s: 0, t: "" },
                    { c: 0, s: 0, t: "... server?" },
                ],
            },
            {
                lock: 13,
                dialog: []
            },
            {
                lock: 14,
                dialog: [
                    { c: 0, s: 0, t: "Goodbye, server!" },
                ]
            },
        ];

        this.events = [];
        for (let i = 0; i < eventData.length; i++) {
            let data = eventData[i];
            let railEvent = new RailEvent(this, data.lock);
            railEvent.teleport = data.teleport;
            for (let j = 0; j < data.dialog.length; j++) {
                railEvent.addDialog(data.dialog[j].c, data.dialog[j].s, data.dialog[j].t);
            }
            this.events.push(railEvent);
        }

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
            for (let index in rail.unlocks) {
                rail[index] = rail.unlocks[index] == 0 || saveData.unlocked.includes(rail.unlocks[index]);
            }
            for (let j = 0; j < rail.pathUnlocks.length; j++) {
                let pathUnlock = rail.pathUnlocks[j];
                if (saveData.unlocked.includes(pathUnlock.unlock)) {
                    if (pathUnlock.hasOwnProperty("up")) {
                        rail.vertexes[pathUnlock.node].up = pathUnlock.up;
                    }
                    if (pathUnlock.hasOwnProperty("down")) {
                        rail.vertexes[pathUnlock.node].down = pathUnlock.down;
                    }
                }
            }
        }
    }

    getRailNode(rail, node) {
        return this.rails[rail].getPath()[node];
    }

    update(delta) {
        if (keys[KeyCode.Esc]) {
            this.saveScene();
            changeState(0);
        }

        this.updateBackground(delta);

        if (this.script.length > 0) {
            this.dialog.display(this.script[0].character, this.script[0].side, this.script[0].text);
            this.dialog.update(delta);

            if (keys[KeyCode.Space] || keys[KeyCode.Enter]) {
                this.advanceScript();
                keys[KeyCode.Space] = false;
                keys[KeyCode.Enter] = false;
            }
            return;
        } else {
            this.dialog.hide();
            if (saveData.unlocked.includes(14)) {
                this.fadeAmount += 0.01;
                if (this.fadeAmount >= 1.5) {
                    changeState(3);
                }
            }
        }
        this.updatePlayer(delta);
        this.updateRails(delta);

    }
    draw(context) {
        context.save();
        context.translate(-this.camera.x + dragDelta.x, -this.camera.y + dragDelta.y);

        this.drawBackground(context);
        this.drawRail(context);
        this.drawPlayer(context);

        context.restore();

        context.fillStyle = `rgba(0,0,0,${this.fadeAmount})`;
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fill();

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
        context.fillStyle = Color.VeryDarkBlue;

        for (let y = 0; y < this.area.height / 128; y++) {
            for (let x = 0; x < this.area.width / 128; x++) {
                let wobble = (Math.sin((x * 45) + new Date().getTime() / 1000));
                if (saveData.unlocked.includes(9)) {
                    wobble = (Math.sin((x * 45) + new Date().getTime() / 200));
                    context.fillStyle = `rgb(${140 + (20 * wobble)}, 20, 60)`;
                }
                context.save();
                context.translate(x * 128 + (5 * wobble), y * 128 + (10 * wobble));
                context.rotate(45 * (Math.PI / 180));

                context.beginPath();
                context.rect(-(wobble) - 4, -(wobble) - 4, 2 * wobble + 8, 2 * wobble + 8);
                context.fill();
                context.restore();
            }
        }
    }

    updateRails(delta) {
        for (let i = 0; i < this.rails.length; i++) {
            let rail = this.rails[i];
            if (!rail.isVisible) {
                continue;
            }
            rail.update(delta);
        }
    }

    drawRail(context) {
        context.lineWidth = 4;
        for (let i = 0; i < this.rails.length; i++) {
            let rail = this.rails[i];
            if (!rail.isVisible) {
                continue;
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
            }
            if (currentNode.enter != null) {
                this.events[currentNode.enter].run();
            }

        }
        if (nextNode && this.player.x == nextNode.x && this.player.y == nextNode.y) {
            this.player.railnode++;
            this.saveScene();
            let currentNode = this.getRailNode(this.player.rail, this.player.railnode);
            if (!currentNode.node) {
                this.moveToNextNode();
            }
            if (currentNode.enter != null) {
                this.events[currentNode.enter].run();
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
            let quest = currentRailNode.up;
            puzzleRules = quest;
            this.saveScene();
            changeState(2);
        }
    }

    jumpDownRail() {
        let currentRail = this.getRailNode(this.player.rail, this.player.railnode);
        if (null != currentRail.down) {
            let quest = currentRail.down;
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
            this.advanceScript();
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

    advanceScript() {
        this.script.shift();
        if (this.script.length > 0) {
            this.dialog.characters[this.script[0].character].speak();
        } else {
            this.updateRailUnlocks();
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
        if (event.touches.length != 0) { //I've let go of all points
            return;
        }
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

class Rail {
    constructor() {
        this.vertexes = [];
        this.isVisible = false;
        this.isActivated = false;
        this.isDamaged = false;
        this.activationUnlock = 0;
        this.visibleUnlock = 0;
        this.unlocks = {
            isVisible: 0,
            isActivated: 0,
        };
        this.pathUnlocks = [];
        this.damagedFade = { r: 200, g: 20, b: 60 };
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

    update(delta) {
        this.damagedFade.r = 200 + (40 * Math.sin(new Date().getTime() / 100));
    }

    draw(context) {
        context.strokeStyle = Color.DarkBlue;
        if (this.isActivated && !this.isDamaged) {
            context.strokeStyle = Color.LightBlue;
        } else if (this.isActivated && this.isDamaged) {
            context.strokeStyle = `rgb(${this.damagedFade.r}, ${this.damagedFade.g}, ${this.damagedFade.b})`;
        }
        // let activeNodeWobble = 2 + (1 * Math.sin(new Date().getTime() / 100));
        let activeNodeWobble = 0;
        for (let i = 0; i < this.vertexes.length - 1; i++) {
            let vertex = this.vertexes[i];
            let nextVertex = this.vertexes[i + 1];
            let radius = vertex.node;
            let nextRadius = nextVertex.node;
            if (vertex.node) {
                context.beginPath();
                if (this.isActivated) {
                    radius = vertex.node - activeNodeWobble;
                }
                context.arc(vertex.x, vertex.y, radius, 0, 2 * Math.PI);
                context.stroke();
            }
            context.beginPath();
            let angle = -Math.atan2(vertex.x - nextVertex.x, vertex.y - nextVertex.y) - (90 * Math.PI / 180);

            if (vertex.node) {
                context.moveTo(vertex.x + radius * Math.cos(angle), vertex.y + radius * Math.sin(angle));
            } else {
                context.moveTo(vertex.x, vertex.y);
            }
            if (nextVertex.node) {
                if (this.isActivated) {
                    nextRadius = nextVertex.node - activeNodeWobble;
                }
                context.lineTo(nextVertex.x - nextRadius * Math.cos(angle), nextVertex.y - nextRadius * Math.sin(angle));
            } else {
                context.lineTo(nextVertex.x, nextVertex.y);
            }
            context.stroke();
        }

        let lastVertex = this.vertexes[this.vertexes.length - 1];
        if (lastVertex.node) {
            let lastRadius = lastVertex.node;
            if (this.isActivated) {
                lastRadius = lastVertex.node - activeNodeWobble;
            }
            context.beginPath();
            context.arc(lastVertex.x, lastVertex.y, lastRadius, 0, 2 * Math.PI);
            context.stroke();
        }
    }
}

class RailEvent {
    constructor(container, lock) {
        this.container = container;
        this.lock = lock;
        this.script = [];
        this.teleport = null;
    }

    addDialog(character, side, text) {
        this.script.push({ character: character, side: side, text: text });
    }

    run() {
        if (this.teleport) {
            this.container.player.rail = this.teleport.rail;
            this.container.player.railnode = this.teleport.node;
            this.container.player.target.x = this.teleport.x;
            this.container.player.target.y = this.teleport.y;
        }
        if (saveData.unlocked.includes(this.lock)) {
            return;
        }
        this.container.script = this.container.script.concat(this.script);
        if (this.container.script.length > 0) {
            this.container.dialog.characters[this.script[0].character].speak();
        }

        saveData.unlocked.push(this.lock);
    }
}
