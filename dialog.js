class Dialog {
    constructor() {
    }

    display(character, side, text) {

    }

    draw(context) {

    }
}

class SplashText {
    constructor(text, x, y, size) {
        this.backgroundColor = Color.DarkGray;
        this.textColor = Color.LightBlue;
        this.x = x;
        this.y = y;
        this.width = size.width ? size.width : 400;
        this.height = size.height ? size.height : 100;
        this.center = { x: this.width / 2, y: this.height / 2 };
        this.text = text;
        this.fontSize = 48;
        this.skew = 50;
    }

    update(delta) {
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);

        context.textAlign = "center";
        context.font = `${this.fontSize}px Arial`;
        let textBounds = context.measureText(this.text);

        if (textBounds.width > this.width) {
            this.width = textBounds.width;
            this.center.x = this.width / 2;
        }

        context.fillStyle = Color.Black;
        context.beginPath();
        context.moveTo(- this.center.x - this.skew + 5, - this.center.y + 5);
        context.lineTo(+ this.center.x + 5, - this.center.y + 5);
        context.lineTo(+ this.center.x + this.skew + 5, + this.center.y + 5);
        context.lineTo(- this.center.x + 5, + this.center.y + 5);
        context.lineTo(- this.center.x - this.skew + 5, - this.center.y + 5);
        context.fill();

        context.fillStyle = this.backgroundColor;
        context.beginPath();
        context.moveTo(- this.center.x - this.skew, - this.center.y);
        context.lineTo(+ this.center.x, - this.center.y);
        context.lineTo(+ this.center.x + this.skew, + this.center.y);
        context.lineTo(- this.center.x, + this.center.y);
        context.lineTo(- this.center.x - this.skew, - this.center.y);
        context.fill();

        context.fillStyle = this.textColor;
        context.fillText(this.text, 0, this.fontSize / 3);
        context.restore();
    }
}
