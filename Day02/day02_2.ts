import {parseLines} from '../Util';
let input  = parseLines(__dirname, 'data.txt');
const keypad: any[][] = [[0,0,1,0,0],[0,2,3,4,0],[5,6,7,8,9],[0,'A', 'B', 'C',0],[0,0,'D',0,0]]

class password_presser {
    x: number;
    y: number;
    constructor() {
        this.x = 0;
        this.y = 2;
    }
    move(command: string) {
        const previous_x = this.x;
        const previous_y = this.y;
        if (command === "L") {
            if (this.x >= 1) {
                this.x -= 1;
            }
        }
        if (command === "R") {
            if (this.x <= 3) {
                this.x += 1;
            }
        }
        if (command === "D") {
            if (this.y <= 3) {
                this.y += 1;
            }
        }
        if (command === "U") {
            if (this.y >= 1) {
                this.y -= 1;
            }
        }
        if(keypad[presser.y][presser.x] === 0){
            this.x = previous_x;
            this.y = previous_y;
        }
    }
}

const presser = new password_presser();

for (let element of input) {
    element = element.replace('\n', '');
    for (const inner of element) {
        presser.move(inner);
    }
    console.log(keypad[presser.y][presser.x])
}