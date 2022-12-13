import * as crypto from "crypto-js";

let salt = 'ngcjuoqr'

function find_repeated(input: string) {
    const target_1 = 3
    const target_2 = 5
    let last_char = '$'
    let count = 0
    let target_1_chars = new Set<string>()
    let target_2_chars = new Set<string>()
    for (let index of Array(input.length).keys()) {
        let cur_char = input[index]
        if (cur_char !== last_char) {
            count = 1
            last_char = cur_char
        } else {
            count += 1
            if (count === target_1 && target_1_chars.size === 0) {
                target_1_chars.add(cur_char)
            } else if (count === target_2) {
                target_2_chars.add(cur_char)
            }
        }
    }
    if (target_2_chars.size > 0) {
    }
    return [target_1_chars, target_2_chars]
}

let threes: any[] = []
let fives: any[] = []

function add_results(targets: Set<string>[]) {
    if (targets[0].size > 0) {
        threes.push(targets[0])
    } else {
        threes.push(undefined)
    }
    if (targets[1].size > 0) {
        fives.push(targets[1])
    } else {
        fives.push(undefined)
    }
}

function get_hash(input: string, times: number) {
    for (let i of Array(times).keys()) {
        input = crypto.MD5(input).toString()
    }
    return input
}

function init() {
    threes = []
    fives = []
}


function run(times: number) {
    process.stdout.write('Progress: ' + 0 + '%')
    for (let i of Array(1001).keys()) {
        const hash = get_hash(salt + i, times)
        const targets = find_repeated(hash)
        add_results(targets)
    }

    let next_index = 1001
    let keys = 0
    mainloop:
        while (true) {
            if (threes[0] !== undefined) {
                for (let char of threes[0]) {
                    for (let five of fives.slice(1)) {
                        if (five === undefined) {
                            continue
                        }
                        if (five.has(char)) {
                            keys += 1
                            process.stdout.write('\rProgress: ' + ((keys / 64) * 100) + '%       ')
                            if (keys === 64) {
                                process.stdout.write('\n')
                                console.log(next_index - 1001)
                                break mainloop
                            }
                            break
                        }
                    }
                }
            }
            const hash = get_hash(salt + next_index, times)
            const targets = find_repeated(hash)
            add_results(targets)
            threes.shift()
            fives.shift()
            next_index += 1
        }
}

init()
console.log('Task 01: ')
run(1)
init()
console.log('Task 02:')
run(2017)