import {parseLines} from '../Util';
import * as crypto from "crypto-js";

task_01();
task_02();

function task_01() {
    let data: string = parseLines(__dirname, 'data.txt')[0];
    let password: string[] = [];
    let current: number = 0;
    while (password.length < 8) {
        const buff = data + current.toString();
        const hash = crypto.MD5(buff).toString();
        if (hash.slice(0, 5) === '00000') {
            password.push(hash[5]);
        }
        current++;
    }
    console.log('task 01: ' + password.join(''));
}

function task_02() {
    let data: string = parseLines(__dirname, 'data.txt')[0];
    let password: string[] = [];
    let current = 0;
    let status: number[] = [];
    while (status.length < 8) {
        const buff = data + current.toString();
        const hash = crypto.MD5(buff).toString();
        if (hash.slice(0, 5) === '00000') {
            const pos = parseInt(hash[5]);
            if (!isNaN(pos) && pos <= 7 && !status.includes(pos)) {
                password[pos] = hash[6];
                status.push(pos);
            }
        }
        current++;
    }
    console.log('Task 02: ' + password.join(''));
}