class Dialog {
}
class SplashText {
    constructor(text, x, y) {
        this.backgroundColor = Color.DarkGray;
        this.textColor = Color.LightBlue;
        this.x = x;
        this.y = y;
        this.width = 400;
        this.height = 100;
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
        context.textAlign = "center";
        context.font = `${this.fontSize}px Arial`;
        context.fillText(this.text, 0, this.fontSize / 3);

        context.restore();
    }
}
