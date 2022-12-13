import {parseLines} from '../Util';

let data = parseLines(__dirname, 'data.txt');

task_01();
task_02();

function task_01(){
    let num_rows = data.length;
    let num_cols = data[0].length;
    let output: string[] = [];
    // Loop to count letters on each column
    for(let col of Array(num_cols).keys()){
        let current = new Map<string, number>();
        // For each column go through all rows
        for(let row of Array(num_rows).keys()){
            const string = data[row];
            const chars = Array.from(string);
            const char = chars[col];
            if(current.has(char)){
                current.set(char, current.get(char)! + 1);
            }
            else{
                current.set(char, 1);
            }
        }
        // Hashmap to array of [key, values] reduced to most frequent key
        let iter = Array.from(current.keys()).map( x => [x, current.get(x)!]);
        let letter = iter.reduce(function (acc, entry){
            if(entry[1] > acc[1]){
                return entry;
            }
            return acc;
        }, ['a', 0]);
        output.push(letter[0].toString());
    }
    let result: string = output.join('');
    console.log('Task 01: ' + result);
}

function task_02(){
    let num_rows = data.length;
    let num_cols = data[0].length;
    let output: string[] = [];

    for(let col of Array(num_cols).keys()){
        let current = new Map<string, number>();
        for(let row of Array(num_rows).keys()){
            const string = data[row];
            const chars = Array.from(string);
            const char = chars[col];
            if(current.has(char)){
                current.set(char, current.get(char)! + 1);
            }
            else{
                current.set(char, 1);
            }
        }
        let iter = Array.from(current.keys()).map( x => [x, current.get(x)!]);
        let letter = iter.reduce(function (acc, entry){
            if(entry[1] < acc[1]){
                return entry;
            }
            return acc;
        }, ['a', Infinity]);
        output.push(letter[0].toString());
    }
    let result: string = output.join('');
    console.log('Task 02: ' + result);
}
