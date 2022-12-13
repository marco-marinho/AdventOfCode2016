export class Bot {
    id: number;
    low: number;
    low_type: string;
    high: number;
    high_type: string;
    storage: number[];

    constructor(id: number, low: number, low_type: string, high: number, high_type: string) {
        this.id = id;
        this.low = low;
        this.high = high;
        this.low_type = low_type;
        this.high_type = high_type;
        this.storage = [];
    }

    isFull() {
        return this.storage.length >= 2;
    }

    distribute(bots: Map<number, Bot>, outputs: Map<number, number[]>) {
        if (this.storage.includes(61) && this.storage.includes(17)) {
            console.log('Task 01: ' + this.id);
        }
        if (this.low_type === 'bot') {
            bots.get(this.low)!.storage.push(Math.min(...this.storage));
            if (bots.get(this.low)!.isFull()) {
                bots.get(this.low)!.distribute(bots, outputs);
            }
        } else {
            if (outputs.has(this.low)) {
                outputs.get(this.low)!.push(Math.min(...this.storage));
            } else {
                outputs.set(this.low, [Math.min(...this.storage)]);
            }
        }
        if (this.high_type === 'bot') {
            bots.get(this.high)!.storage.push(Math.max(...this.storage));
            if (bots.get(this.high)!.isFull()) {
                bots.get(this.high)!.distribute(bots, outputs);
            }
        } else {
            if (outputs.has(this.high)) {
                outputs.get(this.high)!.push(Math.max(...this.storage));
            } else {
                outputs.set(this.high, [Math.max(...this.storage)]);
            }
        }
        this.storage = [];
    }
}