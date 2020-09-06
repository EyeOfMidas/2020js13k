class PuzzleScene {

    constructor() {
        this.board = {
            width: 7,
            height: 8,
            offset: { x: 100, y: 100 },
            tileSize: { width: 50, height: 50 },
        };

        this.tiles = [];
        this.pathTiles = [];
        this.isWon = false;
        this.splashText = null;
        this.splashTextTweenId = -1;
    }

    init() {
        this.isWon = false;
        this.tiles = [];
        let maxWidth = Math.floor(canvas.width / (this.board.tileSize.width + 3)) - 3;
        let maxHeight = Math.floor(canvas.height / (this.board.tileSize.height + 3)) - 3;
        this.board = {
            width: Math.floor(maxWidth * Math.random()) + 2,
            height: Math.floor(maxHeight * Math.random()) + 2,
            offset: { x: 100, y: 100 },
            tileSize: { width: 50, height: 50 },
        };
        if (puzzleRules.width > 0) {
            this.board.width = puzzleRules.width;
        }
        if (puzzleRules.height > 0) {
            this.board.height = puzzleRules.height;
        }
        // this.board.width = maxWidth + 1;
        // this.board.height = maxHeight + 1;
        this.board.offset = { x: (canvas.width / 2) - (this.board.width * this.board.tileSize.width) / 2, y: (canvas.height / 2) - (this.board.height * this.board.tileSize.height) / 2 };
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x <= this.board.width; x++) {
                this.tiles.push(new Tile(this.board, x, y));
            }
        }

        this.buildPath();

        this.splashText = new SplashText("Connected!", - canvas.width - 200, canvas.height / 2);
        this.cancelPuzzle = new Button(canvas.width - 100, 50, "Back", () => {
            changeState(1);
        });
        this.cancelPuzzle.width = 100;
        this.cancelPuzzle.height = 40;
        this.cancelPuzzle.fontSize = 18;
        this.cancelPuzzle.buttonColor = Color.LightGray;
        this.cancelPuzzle.buttonHoverColor = Color.DarkGray;
        this.cancelPuzzle.textColor = Color.DarkGray;
        this.cancelPuzzle.textHoverColor = Color.White;
    }

    buildPath() {
        this.pathTiles = [];
        let validStartTiles = [];
        if (this.board.width >= this.board.height) {
            validStartTiles = this.tiles.filter(tile => tile.x == 0);
        } else {
            validStartTiles = this.tiles.filter(tile => tile.y == 0);
        }
        let currentTile = validStartTiles[Math.floor(validStartTiles.length * Math.random())];
        this.pathTiles.push(currentTile);
        let invalidTiles = [];

        while (this.isEndingConditionMet(currentTile)) {
            let validPathChoices = this.tiles.filter(tile => this.isValidNearby(tile, currentTile, invalidTiles));
            if (validPathChoices.length == 0) {
                this.pathTiles.splice(this.pathTiles.findIndex(tile => tile == currentTile), 1);
                invalidTiles.push(currentTile);
                currentTile = this.pathTiles[this.pathTiles.length - 1];
                continue;
            }
            let randomTile = validPathChoices[Math.floor(validPathChoices.length * Math.random())];
            currentTile = randomTile;
            this.pathTiles.push(currentTile);
        }

        let startTile = this.pathTiles[0];
        let nextTile = this.pathTiles[1];
        startTile.piece = TileType.Node;
        startTile.isPowered = true;
        if (startTile.x < nextTile.x && startTile.y == nextTile.y) {
            startTile.goal = [90];
        } else if (startTile.x == nextTile.x && startTile.y < nextTile.y) {
            startTile.goal = [180];
        } else if (startTile.x == nextTile.x && startTile.y > nextTile.y) {
            startTile.goal = [0];
        } else if (startTile.x > nextTile.x && startTile.y == nextTile.y) {
            startTile.goal = [270];
        }
        startTile.targetRadians = startTile.goal[0] * (Math.PI / 180);

        for (let i = 1; i < this.pathTiles.length - 1; i++) {
            let previousTile = this.pathTiles[i - 1];
            let currentTile = this.pathTiles[i];
            let nextTile = this.pathTiles[i + 1];
            currentTile.piece = TileType.Straight;
            if (previousTile.x == nextTile.x && previousTile.y != nextTile.y) {
                currentTile.goal = [0, 180];
            } else if (previousTile.x != nextTile.x && previousTile.y == nextTile.y) {
                currentTile.goal = [90, 270];
            } else if (previousTile.x != nextTile.x && previousTile.y != nextTile.y) {
                currentTile.piece = TileType.Corner;
                let prev = [previousTile.x - currentTile.x, previousTile.y - currentTile.y].join(', ');
                let next = [nextTile.x - currentTile.x, nextTile.y - currentTile.y].join(', ');

                if (
                    prev == "0, -1" && next == "-1, 0" ||
                    next == "0, -1" && prev == "-1, 0") {
                    currentTile.goal = [0];
                } else if (
                    prev == "0, -1" && next == "1, 0" ||
                    next == "0, -1" && prev == "1, 0") {
                    currentTile.goal = [90];
                } else if (
                    prev == "1, 0" && next == "0, 1" ||
                    next == "1, 0" && prev == "0, 1") {
                    currentTile.goal = [180];
                } else if (
                    prev == "-1, 0" && next == "0, 1" ||
                    next == "-1, 0" && prev == "0, 1") {
                    currentTile.goal = [270];
                }
            }
        }

        let pentultimateTile = this.pathTiles[this.pathTiles.length - 2];
        let lastTile = this.pathTiles[this.pathTiles.length - 1];
        lastTile.piece = TileType.Node;
        if (lastTile.x > pentultimateTile.x && lastTile.y == pentultimateTile.y) {
            lastTile.goal = [270];
        } else if (lastTile.x == pentultimateTile.x && lastTile.y < pentultimateTile.y) {
            lastTile.goal = [180];
        } else if (lastTile.x == pentultimateTile.x && lastTile.y > pentultimateTile.y) {
            lastTile.goal = [0];
        } else if (lastTile.x < pentultimateTile.x && lastTile.y == pentultimateTile.y) {
            lastTile.goal = [90];
        }
    }

    isEndingConditionMet(currentTile) {
        if (this.board.width >= this.board.height) {
            return currentTile.x <= this.board.width - 1;
        }
        return currentTile.y < this.board.height - 1;
    }

    isValidNearby(tile, currentTile, invalidTiles) {
        if (invalidTiles.includes(tile)) {
            return false;
        }
        if (this.pathTiles.includes(tile)) {
            return false;
        }

        //TOP
        if (tile.x == currentTile.x && tile.y == currentTile.y - 1) {
            return true;
        }
        //LEFT
        if (tile.x == currentTile.x - 1 && tile.y == currentTile.y) {
            return true;
        }
        //BOTTOM
        if (tile.x == currentTile.x && tile.y == currentTile.y + 1) {
            return true;
        }
        //RIGHT
        if (tile.x == currentTile.x + 1 && tile.y == currentTile.y) {
            return true;
        }
        return false;
    }

    update(delta) {
        Tween.update();
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].update(delta);
        }
        if (keys[KeyCode.Esc]) {
            changeState(1);
        }
        if (this.isWon) {
            this.splashText.update(delta);

            if (keys[KeyCode.Enter]) {
                Tween.cancel(this.splashTextTweenId);
                changeState(1);
            }
            return;
        }
        this.clearPower();
        this.calculatePower(this.pathTiles[0]);
        if (this.pathTiles[this.pathTiles.length - 1].isPowered) {
            this.isWon = true;
            saveData.player.rail = puzzleRules.successRail;
            saveData.player.railnode = puzzleRules.successNode;
            saveGame();
            sound.playPingSequence(["E6", "C6", "C6", "C6", "C7"], 75);
            this.splashTextTweenId = Tween.create(this.splashText, { x: canvas.width / 2 }, 2000, Tween.Easing.Elastic.EaseOut, () => {
                setTimeout(() => {
                    changeState(1);
                }, 750);
            });

        }

        this.cancelPuzzle.update(delta);
    }
    draw(context) {
        this.drawBackground(context);

        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].draw(context);
        }
        if (this.isWon) {
            this.splashText.draw(context);
        } else {
            this.cancelPuzzle.draw(context);
        }
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

    clearPower() {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].isPowered = false;
        }
    }

    calculatePower(startingTile, source) {
        if (!startingTile.canReceivePower(source)) {
            return;
        }
        startingTile.isPowered = true;
        let possibleCoords = startingTile.getPoweringTileCoordinates();
        for (let i = 0; i < possibleCoords.length; i++) {
            let foundTile = this.tiles.find(tile => tile.x == possibleCoords[i][0] + startingTile.x && tile.y == possibleCoords[i][1] + startingTile.y && !tile.isPowered);
            if (foundTile) {
                this.calculatePower(foundTile, startingTile);
            }
        }
    }

    onResize() {
        this.board.offset = { x: (canvas.width / 2) - (this.board.width * this.board.tileSize.width) / 2, y: (canvas.height / 2) - (this.board.height * this.board.tileSize.height) / 2 };
    }

    onKeyUp(event) {
        if (keys[KeyCode.W]) {
            this.pathTiles.forEach(tile => { tile.targetRadians = tile.goal[0] * (Math.PI / 180); tile.targetRadians %= 360 * (Math.PI / 180) });
        }
    }

    onMouseUp(event) {
        if (this.isWon) {
            Tween.cancel(this.splashTextTweenId);
            changeState(1);
            return;
        }
        let clickedTile = this.tiles.find(tile => tile.isMouseOver(event));
        if (clickedTile) {
            this.tiles.splice(this.tiles.findIndex(tile => tile == clickedTile), 1);
            this.tiles.push(clickedTile);
            clickedTile.targetRadians += 90 * (Math.PI / 180);
            clickedTile.targetRadians %= (360 * (Math.PI / 180));
            sound.playPing("C6", 0, 0.1);
        }
        if (this.cancelPuzzle.isMouseOver(event)) {
            this.cancelPuzzle.triggerHandler();
            document.body.style.cursor = "default";
        }
    }

    onMouseMove(event) {
        if (this.isWon) {
            return;
        }
        for (let tileIndex in this.tiles) {
            this.tiles[tileIndex].isHovered = false;
        }
        this.cancelPuzzle.isHovered = false;
        document.body.style.cursor = "default";
        if (this.cancelPuzzle.isMouseOver(event)) {
            this.cancelPuzzle.isHovered = true;
            document.body.style.cursor = "pointer";
        }

        let hoveredTile = this.tiles.find(tile => tile.isMouseOver(event));

        if (hoveredTile) {
            hoveredTile.isHovered = true;
        }
    }

    onTouchEnd(event) {
        if (this.cancelPuzzle.isTouchOver(event)) {
            event.preventDefault();
            this.cancelPuzzle.triggerHandler();
            document.body.style.cursor = "default";
        }
    }

    onRightClick(event) {
        event.preventDefault();
    }
}

var TileType = {};
TileType.Blank = 0;
TileType.Straight = 1;
TileType.Corner = 2;
TileType.Tee = 3;
TileType.Cross = 4;
TileType.Node = 5;

class Tile {
    constructor(board, x, y) {
        this.x = x;
        this.y = y;
        this.width = board.tileSize.width;
        this.height = board.tileSize.height;
        this.center = { x: board.tileSize.width / 2, y: board.tileSize.height / 2 };
        this.radians = (90 * Math.floor(4 * Math.random())) * (Math.PI / 180);
        this.targetRadians = (90 * Math.floor(4 * Math.random())) * (Math.PI / 180);
        this.goal = [];
        this.piece = Math.floor(5 * Math.random());
        this.board = board;
        this.isHovered = false;
        this.isPowered = false;
        this.powerPellets = [];
    }

    update(delta) {
        if (this.targetRadians != this.radians) {
            this.radians += (9 * (Math.PI / 180));
            this.radians %= (360 * (Math.PI / 180));
        }
        //for (let i = 0; i < this.powerPellets.length; i++) {
        //    let pellet = this.powerPellets[i];
        //    pellet.lifetime -= delta * 10;
        //}

        //if (this.powerPellets.length == 0) {
        //    this.powerPellets.push({ lifetime: 500 });
        //}

        //this.powerPellets = this.powerPellets.filter(pellet => pellet.lifetime > 0);
    }

    draw(context) {
        context.fillStyle = Color.DarkGray;
        context.strokeStyle = Color.DarkGray;
        if (this.isHovered) {
            context.strokeStyle = Color.LightGray;
        }
        context.save();
        context.translate((this.x * this.width) + this.board.offset.x + (this.x * 3), (this.y * this.height) + this.board.offset.y + (this.y * 3));
        context.rotate(this.radians);
        context.beginPath();
        context.rect(-this.center.x, -this.center.y, this.width, this.height);
        context.fill();
        context.stroke();

        context.fillStyle = Color.DarkBlue;
        context.strokeStyle = Color.DarkBlue;
        context.lineWidth = 4;

        if (this.isPowered) {
            context.fillStyle = Color.LightBlue;
            context.strokeStyle = Color.LightBlue;
        }

        switch (this.piece) {
            case TileType.Straight:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, this.height);
                context.fill();
                break;
            case TileType.Corner:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, 2 + this.height / 2);
                context.fill();
                context.beginPath();
                context.rect(-this.center.x, -2, 2 + this.width / 2, 4);
                context.fill();
                break;
            case TileType.Tee:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, this.height);
                context.fill();
                context.beginPath();
                context.rect(-this.center.x, -2, 2 + this.width / 2, 4);
                context.fill();
                break;
            case TileType.Cross:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, this.height);
                context.fill();
                context.beginPath();
                context.rect(- this.center.x, -2, this.width, 4);
                context.fill();
                break;
            case TileType.Node:
                context.beginPath();
                context.rect(- 2, -this.center.y, 4, 4 + this.height / 4);
                context.fill();
                context.beginPath();
                context.arc(0, 0, 8, 0, 2 * Math.PI);
                context.stroke();
                break;
            case TileType.Blank:
            default:
                break;
        }

        //if (this.isPowered) {
        //    context.fillStyle = Color.White;
        //    for (let i = 0; i < this.powerPellets.length; i++) {
        //        let pellet = this.powerPellets[i];
        //        if (this.piece == TileType.Straight) {
        //            context.beginPath();
        //            context.arc(0, ((1 - pellet.lifetime / 500) * -(2 * this.center.y) + this.center.y), 2, 0, 2 * Math.PI);
        //            context.fill();
        //        }
        //    }
        //}
        context.restore();
    }

    isMouseOver(event) {
        let boardOffsetX = event.clientX - this.board.offset.x - (this.x * 3) + this.center.x;
        let boardOffsetY = event.clientY - this.board.offset.y - (this.y * 3) + this.center.y;

        let x = Math.floor(boardOffsetX / this.width);
        let y = Math.floor(boardOffsetY / this.height);

        return this.x == x && this.y == y;
    }

    getPoweringTileCoordinates() {
        let possibleCoordinates = [];
        switch (this.piece) {
            case TileType.Straight:
                switch (this.radians * (180 / Math.PI)) {
                    case 0:
                    case 180:
                        possibleCoordinates.push([0, -1]);
                        possibleCoordinates.push([0, 1]);
                        break;
                    case 90:
                    case 270:
                        possibleCoordinates.push([-1, 0]);
                        possibleCoordinates.push([1, 0]);
                        break;
                }
                break;
            case TileType.Corner:
                switch (this.radians * (180 / Math.PI)) {
                    case 0:
                        possibleCoordinates.push([-1, 0]);
                        possibleCoordinates.push([0, -1]);
                        break;
                    case 90:
                        possibleCoordinates.push([0, -1]);
                        possibleCoordinates.push([1, 0]);
                        break;
                    case 180:
                        possibleCoordinates.push([1, 0]);
                        possibleCoordinates.push([0, 1]);
                        break;
                    case 270:
                        possibleCoordinates.push([-1, 0]);
                        possibleCoordinates.push([0, 1]);
                        break;
                }
                break;
            case TileType.Tee:
                switch (this.radians * (180 / Math.PI)) {
                    case 0:
                        possibleCoordinates.push([0, 1]);
                        possibleCoordinates.push([-1, 0]);
                        possibleCoordinates.push([0, -1]);
                        break;
                    case 90:
                        possibleCoordinates.push([-1, 0]);
                        possibleCoordinates.push([0, -1]);
                        possibleCoordinates.push([1, 0]);
                        break;
                    case 180:
                        possibleCoordinates.push([0, -1]);
                        possibleCoordinates.push([1, 0]);
                        possibleCoordinates.push([0, 1]);
                        break;
                    case 270:
                        possibleCoordinates.push([1, 0]);
                        possibleCoordinates.push([0, 1]);
                        possibleCoordinates.push([-1, 0]);
                        break;
                }
                break;
            case TileType.Cross:
                possibleCoordinates.push([0, -1]);
                possibleCoordinates.push([0, 1]);
                possibleCoordinates.push([-1, 0]);
                possibleCoordinates.push([1, 0]);
                break;
            case TileType.Node:
                switch (this.radians * (180 / Math.PI)) {
                    case 0:
                        possibleCoordinates.push([0, -1]);
                        break;
                    case 90:
                        possibleCoordinates.push([1, 0]);
                        break;
                    case 180:
                        possibleCoordinates.push([0, 1]);
                        break;
                    case 270:
                        possibleCoordinates.push([-1, 0]);
                        break;
                }
                break;
            case TileType.Blank:
            default:
                break;
        }
        return possibleCoordinates;
    }

    canReceivePower(source) {
        if (!source) {
            return true;
        }
        let possibleHookups = this.getPoweringTileCoordinates();

        for (let i = 0; i < possibleHookups.length; i++) {
            if (source.x == (possibleHookups[i][0]) + this.x && source.y == (possibleHookups[i][1]) + this.y) {
                return true;
            }
        }
        return false;
    }
}
