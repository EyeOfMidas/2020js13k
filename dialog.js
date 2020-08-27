class Dialog {
    constructor() {
        this.height = 150;
        this.margin = { left: 16, bottom: 16, right: 16 };
        this.padding = { left: 8, top: 8, right: 8 };
        this.width = canvas.width;
        this.fontSize = 32;
        this.fontSize = this.width / 25;
    }

    display(character, side, text) {

    }

    update(delta) {
    }

    draw(context) {

        context.save();
        context.translate(this.margin.left, canvas.height - this.height);
        let text = "This is a dialog box. I can make it pretty long to see if it would wrap. On a large screen, this takes a lot of text to do. Surprisingly, I can fit quite a bit of text.";
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.beginPath();
        context.rect(0, 0, this.width - (this.margin.left + this.margin.right), this.height - this.margin.bottom);
        context.fill();

        context.fillStyle = "white";
        context.textAlign = "left";
        context.font = `${this.fontSize}px Arial`;

        let line = 1;
        while (this.textIsTooLong(text, context)) {
            let shortTextIndex = this.getShortTextIndex(text, context);
            let shortText = text.substr(0, shortTextIndex);
            text = text.substr(shortTextIndex);
            this.drawTextLine(shortText, context, line);
            line++;
        }

        this.drawTextLine(text, context, line);
        context.restore();
    }

    drawTextLine(text, context, line) {
        let bounds = context.measureText(text);
        let textHeight = Math.max(this.fontSize, bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent);
        context.fillText(text, this.padding.left, this.padding.top + (line * textHeight));
    }

    getShortTextIndex(text, context) {
        while (this.textIsTooLong(text, context)) {
            let words = text.split(" ");
            words.pop();
            text = words.join(" ");
        }
        return text.length;
    }

    textIsTooLong(text, context) {
        let bounds = context.measureText(text);
        return bounds.width > this.width - (this.padding.left + this.padding.right + this.margin.left + this.margin.right);
    }

    onResize() {
        this.width = canvas.width;

        this.fontSize = Math.min(32, this.width / 25);
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
