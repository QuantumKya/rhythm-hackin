class Beat {
    startTime: number;
    currentTime: number;
    interval: number;

    constructor(int: number) {
        this.startTime = Date.now();
        this.currentTime = 0;
        this.interval = int;
    }

    update(): void {
        const current = Date.now();
        this.currentTime = current - this.startTime;
        this.currentTime %= this.interval;
    }

    getRating(time: number): [string, string] {
        const dst = this.getIntTime(time);

        if (dst < this.interval / 20) {
            return ["Perfect!", "green"]
        }
        else if (dst < this.interval / 10) {
            return ["Great!", "#98ff98"]
        }
        else if (dst < this.interval / 5) {
            return ["Good", "white"]
        }
        else {
            return ["Eh...", "brown"]
        }
    }

    getIntTime(time: number): number {
        const value = (time - this.startTime) % this.interval;
        if (value > this.interval / 2) {
            return Math.abs(this.interval - value);
        }
        return value;
    }
}

const canvas: HTMLCanvasElement = document.querySelector("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;


const beat = new Beat(1500);

function clearBlack() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

class TextThing {
    text: string;
    x: number;
    y: number;
    color: string;
    size: number;

    constructor(t: string, x: number, y: number, c: string, s: number) {
        this.text = t;
        this.x = x;
        this.y = y;
        this.color = c;
        this.size = s;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

class TimedText {
    content: Array<[TextThing, number, number]>;

    constructor() {
        this.content = [];
    }

    addElem(text: string, x: number, y: number, color: string, size: number, duration: number) {
        this.content.push([new TextThing(text, x, y, color, size), duration, Date.now()]);
    }

    update() {
        for (let i = 0; i < this.content.length; i++) {
            const text = this.content[i];
            if (Date.now() - text[2] >= text[1]) {
                this.content.splice(i, 1);
                i -= 1;
                continue;
            }

            text[0].draw();
        }
    }
}

document.onkeydown = (event) => {
    event.preventDefault();
    const accuracy: [string, string] = beat.getRating(Date.now());
    ratingText.addElem(accuracy[0], canvas.width / 2, 50, accuracy[1], 50, 1000);
}

const ratingText = new TimedText();

const textTest = new TextThing("hi", canvas.width / 2, 50, "green", 48);

const loopSpr = document.querySelector("img");

function update() {
    requestAnimationFrame(update);

    clearBlack();

    beat.update();
    ctx.textAlign = "center";
    ratingText.update();

    /*
    ctx.fillStyle = beat.getRating(Date.now())[1];
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${beat.currentTime}`, canvas.width / 2, 455);
    */

    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 8, 455);
    ctx.strokeStyle = "white";
    ctx.lineTo(canvas.width / 2, 455);
    ctx.moveTo(canvas.width / 2, 425);
    ctx.lineTo(canvas.width / 2, 485);
    ctx.moveTo(canvas.width / 2, 455);
    ctx.lineTo(canvas.width * 7 / 8, 455);
    ctx.stroke();

    ctx.imageSmoothingEnabled = false;
    let offset = 0;
    if (beat.currentTime / beat.interval < 0.5)
        offset = canvas.width / 2 + beat.currentTime * canvas.width * 3 / 4 / beat.interval;
    else
        offset = canvas.width / 8 + (beat.currentTime / beat.interval - 0.5) * canvas.width * 3 / 4;
    ctx.drawImage(loopSpr, 0, 0, 16, 16, offset - 24, 455 - 24, 48, 48);
    ctx.imageSmoothingEnabled = true;
}

requestAnimationFrame(update);