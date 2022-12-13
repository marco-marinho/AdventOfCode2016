import {parseLines} from "../Util";

class Node {
    size: number
    used: number
    available: number

    constructor(size: number, used: number, available: number) {
        this.size = size
        this.used = used
        this.available = available
    }

    check_viable(other: Node) {
        return this.used !== 0 && this !== other && this.used <= other.available
    }

    check_empty() {
        return this.used === 0
    }

    get_string() {
        if (this.used === 0) {
            return 'E'
        }
        if (this.used < 100) {
            return '.'
        }
        return '#'
    }

}

function get_data() {
    let nodes: Node[][] = []
    let lines = parseLines(__dirname, 'data.txt')
    for (let line of lines) {
        let buff = line.split(' ')
        buff = buff.filter(element => element !== '')
        let node = buff[0].split('-')
        let x_coord = Number(node[1].slice(1))
        let y_coord = Number(node[2].slice(1))
        let size = Number(buff[1].slice(0, -1))
        let used = Number(buff[2].slice(0, -1))
        let available = size - used
        if (nodes[y_coord] === undefined) {
            nodes[y_coord] = []
        }
        nodes[y_coord][x_coord] = new Node(size, used, available)
    }
    return nodes
}


function count_viable_pairs(nodes: Node[][]) {
    let x_len = nodes.length
    let y_len = nodes[0].length
    let count = 0

    for (let x = 0; x < x_len; x++) {
        for (let y = 0; y < y_len; y++) {
            let cur_node = nodes[x][y]
            for (let x_i = 0; x_i < x_len; x_i++) {
                for (let y_i = 0; y_i < y_len; y_i++) {
                    let other_node = nodes[x_i][y_i]
                    if (cur_node.check_viable(other_node)) {
                        count += 1
                    }
                }
            }
        }
    }
    return count
}

let wall_end: number[]
let empty_pos: number[]
let y_size: number
let g_pos: number[]
let t_pos: number[] = [0, 0]

function print_grid(nodes: Node[][]) {
    let x_len = nodes.length
    let y_len = nodes[0].length
    y_size = y_len
    let output: string[][] = []
    let wall_found = false
    for (let x = 0; x < x_len; x++) {
        output[x] = []
        for (let y = 0; y < y_len; y++) {
            if (x === 0 && y ===0){
                output[x][y] = 'T'
                continue
            }
            if (x === 0 && y === y_len - 1) {
                g_pos = [x, y]
                output[x][y] = 'G'
                continue
            }
            let cur_node = nodes[x][y]
            let node_str = cur_node.get_string()
            if(!wall_found && node_str === '#'){
                wall_end = [x, y-1]
                wall_found = true
            }
            if(node_str === 'E'){
                empty_pos = [x, y]
            }
            output[x][y] = cur_node.get_string()
        }
    }
    return output
}

function dist(pos1: number[], pos2: number[]){
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1])
}


let nodes = get_data()

let count = count_viable_pairs(nodes)
console.log('Task 01:')
console.log(count)


console.log('Board:')
let to_print = print_grid(nodes)
for (let line of to_print) {
    console.log(line.join(''))
}

let a = dist(empty_pos, wall_end)
let b = dist(wall_end, g_pos)
let c = (dist(g_pos, t_pos) - 1)*5
let d = a + b + c
console.log('Task 02:')
console.log(d)
