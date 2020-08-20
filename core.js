var canvas;
var context;
var lastTime;
var updateIntervalId;
var gameTicks;

var camera = { x: 0, y: 0, center: { x: 0, y: 0 }, movementSpeed: 3 };
var isDragging = false;
var dragCompleted = false;
var startDrag = { x: 0, y: 0 };
var dragDelta = { x: 0, y: 0 };
var keys = [];

var states = [];
states.push(new MenuScene());
states.push(new OverworldScene());
states.push(new PuzzleScene());
var activeState = states[0];

var saveData = {
    player: { x: 1280, y: 1280 },
    solves: 0,
};

function animate() {
    context.save();
    context.translate(0.5, 0.5);
    draw(context);
    context.restore();
    requestAnimationFrame(animate);
}

function clearFrame(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
    lastTime = new Date().getUTCMilliseconds();

    keys = [];
    for (let i = 0; i < 256; i++) {
        keys[i] = false;
    }

    gameTicks = 0;

    changeState(0);
}

function changeState(id) {
    states[id].init();
    activeState = states[id];
    onResize();
}

function update(delta) {
    activeState.update(delta);
}

function draw(context) {
    functionExists(activeState, "clearFrame") ? activeState.clearFrame(context) : clearFrame(context);
    activeState.draw(context);
}

function functionExists(obj, method) {
    return typeof obj[method] == "function";
}

function saveGame() {
    localStorage.setItem("eyeofmidas404", JSON.stringify(saveData));
}

function loadGame() {
    let saveString = localStorage.getItem("eyeofmidas404");
    if (!saveString) {
        saveGame();
        saveString = JSON.stringify(saveData);
    }
    saveData = JSON.parse(saveString);
}

function onResize() {
    let dpi = window.devicePixelRatio;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context = canvas.getContext("2d");
    context.width = canvas.clientWidth / dpi;
    context.height = canvas.clientHeight / dpi;

    functionExists(activeState, "onResize") ? activeState.onResize() : null;
}

function onKeyDown(event) {
    keys[event.keyCode] = true;
    functionExists(activeState, "onKeyDown") ? activeState.onKeyDown(event) : null;
}

function onKeyUp(event) {
    functionExists(activeState, "onKeyUp") ? activeState.onKeyUp(event) : null;
    keys[event.keyCode] = false;
}

function onMouseMove(event) {
    functionExists(activeState, "onMouseMove") ? activeState.onMouseMove(event) : null;
}

function onMouseDown(event) {
    functionExists(activeState, "onMouseDown") ? activeState.onMouseDown(event) : null;
}

function onMouseUp(event) {
    functionExists(activeState, "onMouseUp") ? activeState.onMouseUp(event) : null;
}

function onRightClick(event) {
    functionExists(activeState, "onRightClick") ? activeState.onRightClick(event) : null;
}

function onTouchStart(event) {
    functionExists(activeState, "onTouchStart") ? activeState.onTouchStart(event) : null;
}

function onTouchMove(event) {
    functionExists(activeState, "onTouchMove") ? activeState.onTouchMove(event) : null;
}

function onTouchEnd(event) {
    functionExists(activeState, "onTouchEnd") ? activeState.onTouchEnd(event) : null;
}

document.addEventListener("DOMContentLoaded", event => {
    canvas = document.createElement("canvas");
    document.getElementById("game").appendChild(canvas);
    init();
    animate();

    updateIntervalId = setInterval(() => {
        let currentTime = new Date().getUTCMilliseconds();
        update(1 + ((currentTime - lastTime) / 1000));
        lastTime = currentTime;
    }, 16);
});

window.addEventListener("resize", onResize);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("contextmenu", onRightClick);

window.addEventListener("touchstart", onTouchStart);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("touchend", onTouchEnd);
