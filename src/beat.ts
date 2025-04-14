export class Beat {
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

        if (dst < 25) {
            return ["Perfect!", "green"]
        }
        else if (dst < 50) {
            return ["Great!", "#98ff98"]
        }
        else if (dst < 100) {
            return ["Good!", "white"]
        }
        else {
            return ["Eh...", "brown"]
        }
    }

    getIntTime(time: number): number {
        return Math.abs(((time - this.startTime) % this.interval) - this.interval / 2);
    }
}