import {parseLines} from '../Util';
let data = parseLines(__dirname, 'data.txt');
let regex_token = RegExp('\\(\\d+x\\d+\\)')

task_01();
task_02();

function task_01() {
    let cur_data = data[0];
    let prev_len = cur_data.length;
    let cur_pos = 0;
    do {
        prev_len = cur_data.length;
        let out = expand_once({data: cur_data, start_pos: cur_pos});
        cur_data = out.data;
        cur_pos = out.start_pos;
    } while (cur_data.length !== prev_len)
    console.log('Task 01: ' + cur_data.length);
}

function task_02() {
    let cur_data = data[0];
    let total = expand(cur_data);
    console.log('Task 02: ' + total);
}

function expand_once(input: { data: string, start_pos: number }): { data: string, start_pos: number } {
    const data = input.data;
    const start_pos = input.start_pos;
    const slice = data.slice(start_pos, data.length);
    const token = slice.match(regex_token);
    if (token && token.index !== undefined) {
        const len = parseInt(token[0].split('x')[0].replace('(', ''));
        const times = parseInt(token[0].split('x')[1].replace(')', ''));
        const start_idx = token[0].length + token.index;
        const to_repeat = slice.slice(start_idx, start_idx + len);
        const to_replace = slice.slice(token.index, token.index + token[0].length + len);
        const repeated = to_repeat.repeat(times);
        const out_data = data.slice(0, start_pos) + slice.replace(to_replace, repeated);
        const out_pos = start_pos + repeated.length + token.index;
        return {data: out_data, start_pos: out_pos};
    }
    return input;
}

function expand(input: string): number {
    let output = 0;
    while (input.match(regex_token)) {
        const token = input.match(regex_token);
        if (token && token.index !== undefined) {
            const len = parseInt(token[0].split('x')[0].replace('(', ''));
            const times = parseInt(token[0].split('x')[1].replace(')', ''));
            const slice = input.slice(token.index + token[0].length, token.index + token[0].length + len);
            output += times * (expand(slice));
            input = input.slice(token.index + token[0].length + len);
        }
    }
    output += input.length;
    return output;
}