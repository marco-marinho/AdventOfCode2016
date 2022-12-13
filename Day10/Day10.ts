import {parseLines} from '../Util';
import {Bot} from './Bot'

let data = parseLines(__dirname, 'data.txt');

both_tasks();

function both_tasks() {
    let parsed_data = splitData(data);
    let bots = assemble_bots(parsed_data.bots);
    let outputs = run_bots(bots, parsed_data.vals);
    let val = outputs.get(0)![0] * outputs.get(1)![0] * outputs.get(2)![0];
    console.log('Task 02: ' + val);
}

function run_bots(bots: Map<number, Bot>, instructions: string[]): Map<number, number[]> {
    let outputs = new Map<number, number[]>();
    for (let entry of instructions) {
        const buff = entry.replace('value ', '').replace('goes to bot ', '').split(' ');
        bots.get(parseInt(buff[1]))!.storage.push(parseInt(buff[0]));
        if (bots.get(parseInt(buff[1]))!.isFull()) {
            bots.get(parseInt(buff[1]))!.distribute(bots, outputs);
        }
    }
    return outputs;
}

function assemble_bots(bots_data: string[]): Map<number, Bot> {
    let o_bots = new Map<number, Bot>();
    for (let entry of bots_data) {
        const buff = entry.replace('gives low to ', '').replace('and high to ', '').split(' ');
        const id = parseInt(buff[1]);
        const low_type = buff[2];
        const low = parseInt(buff[3]);
        const high_type = buff[4];
        const high = parseInt(buff[5]);
        let bot = new Bot(id, low, low_type, high, high_type);
        o_bots.set(id, bot);
    }
    return o_bots;
}

function splitData(input: string[]): { bots: string[], vals: string[] } {
    let obots: string[] = [];
    let ovals: string[] = [];
    for (let entry of input) {
        if (entry.includes('gives')) {
            obots.push(entry);
        } else {
            ovals.push(entry);
        }
    }
    return {bots: obots, vals: ovals};
}

