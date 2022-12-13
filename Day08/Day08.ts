import {parseLines} from '../Util';
let data = parseLines(__dirname, 'data.txt');

const rect = Symbol('rect');
const rot_row = Symbol('rot_row');
const rot_col = Symbol('rot_col');

const nrows = 50;
const ncols = 6;

let grid = new Array(ncols).fill(false).map(() => new Array(nrows).fill(false));

tasks();

function tasks() {
    for (let entry of data) {
        let command = parse_command(entry);
        execute_command(command, grid);
    }
    console.log('Task 01: ' + count_pixels(grid));
    console.log('Task 02: ');
    print_grid(grid);
}

function count_pixels(grid: boolean[][]): number {
    let total = 0;
    for (let row of grid) {
        total = row.reduce((acc, element) => element ? acc+1 : acc, total);
    }
    return total;
}

function execute_command(command: { command: Symbol, args: number[] }, grid: boolean[][]) {
    const num_cols = grid[0].length;
    const num_rows = grid.length;
    switch (command.command) {
        case rect:
            for (let row of Array(command.args[0]).keys()) {
                for (let col of Array(command.args[1]).keys()) {
                    grid[col][row] = true;
                }
            }
            break;
        case rot_row: {
            const row = command.args[0];
            const rot = command.args[1];
            let temp = new Array(num_cols).fill(false);
            for (let element of Array(num_cols).keys()) {
                temp[(element + rot) % num_cols] = grid[row][element];
            }
            grid[row] = temp;
            break;
        }
        case rot_col:
            const col = command.args[0];
            const rot = command.args[1];
            let temp = new Array(num_rows).fill(false);
            for (let element of Array(num_rows).keys()) {
                temp[(element + rot) % num_rows] = grid[element][col];
            }
            for (let element of Array(num_rows).keys()) {
                grid[element][col] = temp[element];
            }
            break;
    }
}

function print_grid(grid: boolean[][]) {
    console.log('');
    for (let row of grid) {
        let string_rep = row.map(x => x ? '##' : '..');
        console.log(string_rep.join(''));
        console.log(string_rep.join(''));
    }
    console.log('');
}

function parse_command(command: string): { command: Symbol, args: number[] } {
    if (command.includes('rect')) {
        let args = command.split(' ')[1].split('x');
        return {'command': rect, 'args': args.map(x => parseInt(x))};
    }
    if (command.includes('x=')) {
        let args = command.split('=')[1].split('by');
        return {'command': rot_col, 'args': args.map(x => parseInt(x))};
    } else {
        let args = command.split('=')[1].split('by');
        return {'command': rot_row, 'args': args.map(x => parseInt(x))};
    }
}