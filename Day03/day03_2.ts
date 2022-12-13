import {parseLines} from '../Util';
let input  = parseLines(__dirname, 'data.txt');

function range(start: number, stop: number, step: number): number[]{
    if (typeof stop == 'undefined') {
        stop = start;
        start = 0;
    }
    if (typeof step == 'undefined') {
        step = 1;
    }
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }
    let result = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }
    return result;
}

function check_if_triangle(sides: number[]): boolean{
    let a = sides[0];
    let b = sides[1];
    let c = sides[2];
    return a + b > c && a + c > b && b + c > a;
}

let number_input: number[][] = [];


for(let element of input){
    let sides = element.trim().split(/[ ]+/).map(
        function(item){
            return parseInt(item, 10);
    });
    number_input.push(sides);
}

let num_possible: number = 0;
for(let idx of range(0, number_input.length, 3)){
    for(let col = 0; col < 3; col++){
        if(check_if_triangle([number_input[idx][col], number_input[idx+1][col], number_input[idx+2][col]])){
            num_possible++;
        }
    }
}

console.log(num_possible);