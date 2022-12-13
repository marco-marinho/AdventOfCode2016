import * as crypto from "crypto-js";

function get_open(key: string, steps: string[]): Set<string> {
    const step_pos = ['U', 'D', 'L', 'R']
    let to_hash = key.concat(steps.join(''))
    let hash = crypto.MD5(to_hash).toString()
    let possible_steps = new Set<string>()
    for (let index = 0; index < step_pos.length; index++) {
        if (hash[index] >= 'b' && hash[index] <= 'f') {
            possible_steps.add(step_pos[index])
        }
    }
    return possible_steps
}

let solutions: string[][] = []
let min = Infinity
let max = 0

function step(key: string, steps: string[], pos: number[]){
    if (pos[0] === 3 && pos[1] === 3){
        if (steps.length < min){
            min = steps.length
        }
        if (steps.length > max){
            max = steps.length
        }
        solutions.push(steps)
        return
    }
    let open = get_open(key, steps)
    if (pos[1] > 0 && open.has('U')){
        step(key, [... steps, 'U'], [pos[0], pos[1] - 1])
    }
    if (pos[1] < 3 && open.has('D')){
        step(key, [... steps, 'D'], [pos[0], pos[1] + 1])
    }
    if (pos[0] > 0 && open.has('L')){
        step(key, [... steps, 'L'], [pos[0] - 1, pos[1]])
    }
    if (pos[0] < 3 && open.has('R')){
        step(key, [... steps, 'R'], [pos[0] + 1, pos[1]])
    }
}

function shortest(solutions: string[][], size: number){
    for (let solution of solutions){
        if (solution.length === size){
            return solution.join('')
        }
    }
    return 'None'
}

step('ioramepc', [], [0,0])
console.log('Task 01:')
console.log(shortest(solutions, min))
console.log('Task 02:')
console.log(max)
