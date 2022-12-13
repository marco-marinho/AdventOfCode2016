import {parseLines} from "../Util";

let num_regex = RegExp('#(\\d+)')
let n_pos_regex =RegExp('(\\d+) positions')
let pos_regex = RegExp('position (\\d+)')

class disc{
    num: number
    n_pos: number
    pos: number

    constructor(num: number, n_pos: number, pos: number) {
        this.num = num
        this.n_pos = n_pos
        this.pos = pos
    }

    public check_aligned(time: number): boolean{
        return (time + this.num + this.pos) % this.n_pos === 0
    }
}

function run(path: string) {
    let discs = new Array<disc>()
    let data = parseLines(__dirname, path)

    for (let line of data) {
        let num = Number(line.match(num_regex)![1])
        let n_pos = Number(line.match(n_pos_regex)![1])
        let pos = Number(line.match(pos_regex)![1])
        discs.push(new disc(num, n_pos, pos))
    }

    let time = 0
    while (true) {
        let all_aligned = discs.reduce<boolean>((acc: boolean, val: disc) => {
            return acc && val.check_aligned(time)
        }, true)
        if (all_aligned) {
            console.log(time)
            break
        }
        time += 1
    }
}

console.log('Task 1:')
run('data.txt')
console.log('Task 2:')
run('data_2.txt')