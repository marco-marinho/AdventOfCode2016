import {parseLines} from '../Util';

let input  = parseLines(__dirname, 'data.txt');
const keypad: number[][] = [[1,2,3],[4,5,6],[7,8,9]]
class password_presser {
    x: number;
    y: number;
    constructor() {
        this.x = 1;
        this.y = 1;
    }
    move(command: string) {
        if (command === "L") {
            if (this.x >= 1) {
                this.x -= 1;
            }
        }
        if (command === "R") {
            if (this.x <= 1) {
                this.x += 1;
            }
        }
        if (command === "D") {
            if (this.y <= 1) {
                this.y += 1;
            }
        }
        if (command === "U") {
            if (this.y >= 1) {
                this.y -= 1;
            }
        }
    }
}

const presser_2 = new password_presser();


for (let element of input) {
    element = element.replace('\n', '');
    for (const inner of element) {
        presser_2.move(inner);
    }
    console.log(keypad[presser_2.y][presser_2.x])
}

