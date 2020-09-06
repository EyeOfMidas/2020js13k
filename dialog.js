class Dialog {
	constructor() {
		this.height = 150;
		this.margin = { left: 16, bottom: 16, right: 16 };
		this.padding = { left: 8, top: 8, right: 8 };
		this.width = canvas.width;
		this.fontSize = 32;
		this.fontSize = this.width / 25;
		this.portrait = { width: 100, height: 128 };
		this.portraitFloat = 16;
		this.side = 0;
		this.text = "";

		this.characters = [];
		this.characters.push(new HeroCharacter());
		this.characters.push(new VillainCharacter());
		this.characters.push(new EmptyCharacter());
		this.character = this.characters[this.side];

		this.isDisplaying = false;
	}

	display(character, side, text) {
		this.character = this.characters[character];
		this.side = side;
		this.text = text;
		this.isDisplaying = true;
	}

	hide() {
		this.isDisplaying = false;
	}

	update(delta) {
		this.portraitFloat = 16 + (4 * Math.sin(new Date().getTime() / 100));
	}

	draw(context) {
		if (!this.isDisplaying) {
			return;
		}
		context.save();
		context.translate(this.margin.left, canvas.height - this.height);

		if (this.side == 0) {
			context.save();
			context.translate(0, -this.portrait.height - this.portraitFloat);
			context.fillStyle = "rgba(0, 0, 0, 0.5)";
			context.beginPath();
			context.rect(0, 0, this.portrait.width, this.portrait.height);
			context.fill();

			this.character.draw(context);
			context.restore();
		}

		if (this.side == 1) {
			context.save();
			context.translate(this.width - (this.margin.left + this.margin.right + this.portrait.width), - this.portrait.height - this.portraitFloat);
			context.fillStyle = Color.TransparentBlack;
			context.beginPath();
			context.rect(0, 0, this.portrait.width, this.portrait.height);
			context.fill();
			this.character.draw(context);
			context.restore();
		}

		context.fillStyle = Color.TransparentBlack;
		context.beginPath();
		context.rect(0, 0, this.width - (this.margin.left + this.margin.right), this.height - this.margin.bottom);
		context.fill();

		context.fillStyle = Color.White;
		context.textAlign = "left";
		context.font = `${this.fontSize}px Arial`;

		let line = 1;
		let text = this.text;
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
		let textHeight = Math.max(Math.ceil(this.fontSize), bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent);
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

class HeroCharacter {
	constructor() {
		this.currentMood = 0;
	}

	setMood(newMood) {
		this.currentMood = newMood;
	}

	draw(context) {
		switch (this.currentMood) {
			case 0:
			default:
				context.fillStyle = Color.LightBlue;
				context.beginPath();
				context.rect(10, 20, 80, 80);
				context.fill();

				context.strokeStyle = Color.Black;
				context.fillStyle = Color.Black;
				context.lineWidth = 6;
				context.beginPath();
				context.arc(25, 50, 10, Math.PI, 2 * Math.PI);
				context.stroke();
				context.beginPath();
				context.arc(75, 50, 10, Math.PI, 2 * Math.PI);
				context.stroke();
				context.beginPath();
				context.arc(50, 65, 10, 0, Math.PI);
				context.fill();
				break;
		}
	}
	speak() {
		sound.playPingSequence(["C6", "C7", "E6", "E7"], 100, 1);
	}
}

class VillainCharacter {
	constructor() {
		this.currentMood = 1;
	}

	setMood(newMood) {
		this.currentMood = newMood;
	}

	draw(context) {
		switch (this.currentMood) {
			case 1:
			default:
				context.fillStyle = Color.Gray;
				context.beginPath();
				context.arc(20, 35, 10, Math.PI / 2, 3 * Math.PI / 2);
				context.rect(20, 25, 60, 20);
				context.arc(80, 35, 10, 3 * Math.PI / 2, Math.PI / 2);
				context.fill();
				context.beginPath();
				context.arc(20, 55, 10, Math.PI / 2, 3 * Math.PI / 2);
				context.rect(20, 45, 60, 20);
				context.arc(80, 55, 10, 3 * Math.PI / 2, Math.PI / 2);
				context.fill();
				context.beginPath();
				context.arc(20, 75, 10, Math.PI / 2, 3 * Math.PI / 2);
				context.rect(20, 65, 60, 20);
				context.arc(80, 75, 10, 3 * Math.PI / 2, Math.PI / 2);
				context.fill();
				context.beginPath();
				context.arc(20, 95, 10, Math.PI / 2, 3 * Math.PI / 2);
				context.rect(20, 85, 60, 20);
				context.arc(80, 95, 10, 3 * Math.PI / 2, Math.PI / 2);
				context.fill();

				context.fillStyle = Color.Black;
				context.beginPath();
				context.moveTo(30, 40);
				context.lineTo(45, 50);
				context.lineTo(25, 50);
				context.lineTo(30, 40);
				context.fill();

				context.beginPath();
				context.moveTo(70, 40);
				context.lineTo(55, 50);
				context.lineTo(75, 50);
				context.lineTo(70, 40);
				context.fill();

				context.lineWidth = 6;
				context.beginPath();
				context.moveTo(40, 65);
				context.lineTo(60, 65);
				context.stroke();
				break;
		}
	}
	speak() {
		sound.playPingSequence(["C4", "F3", "A3", "D3"], 100, 1);
	}
}

class EmptyCharacter {
	constructor() {
	}
	draw(context) {
	}
	speak() {
	}
}

class SplashText {
	constructor(text, x, y, size) {
		this.backgroundColor = Color.DarkGray;
		this.textColor = Color.LightBlue;
		this.x = x;
		this.y = y;
		this.width = size && size.width ? size.width : 400;
		this.height = size && size.height ? size.height : 100;
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

		this.width = Math.min(canvas.width - 100, Math.max(this.width, textBounds.width));
		this.center.x = this.width / 2;

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

class FadingHelp {
	constructor() {
		this.delay = new Date().getTime() + 5000;
	}

	update(delta) {
	}

	draw(context) {
	}

	mouseHelp(context) {
	}
}
