class Beat {
    startTime: number;
    currentTime: number;
    interval: number;
    loopSpr: HTMLImageElement;

    constructor(int: number) {
        this.startTime = Date.now();
        this.currentTime = 0;
        this.interval = Math.floor(1000 * 60 / int);
        this.loopSpr = document.querySelector("img");
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

    draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
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
        if (this.currentTime / this.interval < 0.5)
            offset = canvas.width / 2 + this.currentTime * canvas.width * 3 / 4 / this.interval;
        else
            offset = canvas.width / 8 + (this.currentTime / this.interval - 0.5) * canvas.width * 3 / 4;
    
        let factor = 1 - this.getIntTime(Date.now()) / this.interval;
        ctx.drawImage(this.loopSpr, 0, 0, 16, 16, offset - 24 * factor, 455 - 24 * factor - 8 * factor, 64 * factor, 64 * factor);
        ctx.imageSmoothingEnabled = true;
    }
}

const canvas: HTMLCanvasElement = document.querySelector("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;


const beat = new Beat(100);

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

    setElem(index: number, text: string, x: number, y: number, color: string, size: number, duration: number) {
        this.content[index] = [new TextThing(text, x, y, color, size), duration, Date.now()];
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
    ratingText.setElem(0, accuracy[0], canvas.width / 2, 50, accuracy[1], 50, 1000);
}

const ratingText = new TimedText();

function showGood() {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(canvas.width / 2, 400, 35, 0, 360);
    ctx.fill();
}

function update() {
    requestAnimationFrame(update);

    clearBlack();

    beat.update();
    ctx.textAlign = "center";
    ratingText.update();

    switch (beat.getRating(Date.now())[1]) {
        case "green":
            showGood();
            break;
        case "#98ff98":
            showGood();
            break;
        default:
            break;
    }

    beat.draw(canvas, ctx);
}

requestAnimationFrame(update);