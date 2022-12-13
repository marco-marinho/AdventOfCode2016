import {parseLines} from '../Util';

task_01();
task_02();

function task_01() {
    let data = parse_data();
    let score = data.reduce(function (acc, entry) {
        if (entry.decoded === entry.code) {
            return acc + entry.score;
        }
        return acc;
    }, 0)
    console.log('Task 01: ' + String(score));
}

function task_02() {
    let data = parse_data();
    for (let entry of data) {
        let rotated = shift(entry.original, entry.score);
        if (rotated === 'northpole object storage') {
            console.log('Task 02: ' + String(entry.score));
        }
    }
}

function shift(input: string, times: number) {
    let output = Array.from(input);
    let rotated = output.map(x => x === ' ' ? x : String.fromCharCode(((x.charCodeAt(0) + times - 97) % 26) + 97));
    return rotated.toString().replaceAll(',', '');
}

function parse_data(): { original: string, letters: string, decoded: string, score: number, code: string }[] {
    let lines = parseLines(__dirname, 'data.txt');
    let output: { original: string, letters: string, decoded: string, score: number, code: string }[] = [];
    for (let line of lines) {
        const lastIndex = line.lastIndexOf('-');
        const original = line.slice(0, lastIndex).replaceAll('-', ' ');
        const letters = line.slice(0, lastIndex).replaceAll('-', '');
        const score = parseInt(line.slice(lastIndex + 1).split('[')[0]);
        const code = line.slice(lastIndex + 1).split('[')[1].replace(']', '');
        const out = count_letters(Array.from(letters));
        output.push({
            'original': original,
            'letters': letters,
            'decoded': out.toString().replaceAll(',', ''),
            'score': score,
            'code': code
        });
    }
    return output;
}

function count_letters(letters: string[]): string[] {
    const unq_letters: Set<string> = new Set(letters);
    let counter = new Map<string, number>();
    for (let letter of unq_letters) {
        const count = letters.filter(val => val === letter).length;
        counter.set(letter, count);
    }
    let output: string[] = [];
    while (output.length < 5) {
        let to_insert: string = 'z' + 1;
        let count = 0;
        for (let key of counter.keys()) {
            if (counter.get(key)! > count) {
                to_insert = key;
                count = counter.get(key)!;
            } else if (counter.get(key)! === count && to_insert > key) {
                to_insert = key;
            }
        }
        output.push(to_insert);
        counter.delete(to_insert);
    }
    return output;
}