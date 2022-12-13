import {parseLines} from "../Util";

function permute(permutation: any[]) {
    let length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

class Puzzle {
    spots: Map<string, number[]>
    map: string[][]

    constructor(map: string[][], spots: Map<string, number[]>) {
        this.map = map
        this.spots = spots
    }

    public is_wall(coords: number[]) {
        return this.map[coords[0]][coords[1]] === '#'
    }

    public is_target(coords: number[]) {
        return this.map[coords[0]][coords[1]] !== '#' && this.map[coords[0]][coords[1]] !== '.'
    }
}

function get_map() {
    let lines = parseLines(__dirname, 'data.txt')
    let spots = new Map<string, number[]>()
    let map: string[][] = []
    for (let x = 0; x < lines.length; x++) {
        let line = lines[x]
        map.push([])
        for (let y = 0; y < line.length - 1; y++) {
            if (line[y] !== '.' && line[y] !== '#') {
                spots.set(line[y], [x, y])
            }
            map[x][y] = line[y]
        }
    }
    return new Puzzle(map, spots)
}

function BFS(next: number[][], puzzle: Puzzle) {
    let steps = 0
    let visited = new Set<string>()
    visited.add(next[0].toString())
    let dist = new Map<number, number>()
    while (next.length > 0) {
        let current_nodes: number[][] = [...next]
        next = []
        while (current_nodes.length > 0) {
            let current = current_nodes.pop()!
            if (puzzle.is_target(current)) {
                dist.set(Number(puzzle.map[current[0]][current[1]]), steps)
            }
            let neighbours = [[current[0] + 1, current[1]], [current[0] - 1, current[1]], [current[0], current[1] + 1], [current[0], current[1] - 1]]
            for (let neightbour of neighbours) {
                if (!visited.has(neightbour.toString()) && !puzzle.is_wall(neightbour)) {
                    visited.add(neightbour.toString())
                    next.push(neightbour)
                }
            }
        }
        steps += 1
    }
    return dist
}


function collect_all(puzzle: Puzzle) {
    let num_targets = puzzle.spots.size
    let path_sizes = new Map<string, number>()
    for (let start = 0; start < num_targets; start++) {
        let start_pos = puzzle.spots.get(start.toString())!
        let dists = BFS([start_pos], puzzle)
        for (let [key, value] of dists) {
           path_sizes.set([start, key].toString(), value)
        }
    }
    return path_sizes
}

function shortest(paths: Map<string, number>, puzzle: Puzzle, task2: boolean = false) {
    let num_targets = puzzle.spots.size
    let order = [...Array(num_targets).keys()].slice(1)
    let permutations = permute(order)
    let min_path = Infinity
    for (let permutation of permutations) {
        permutation.unshift(0)
        if (task2){
            permutation.push(0)
        }
        let path_len = 0
        for (let idx = 0; idx < permutation.length - 1; idx++) {
            let start = permutation[idx]
            let end = permutation[idx + 1]
            path_len += paths.get([start, end].toString())!
        }
        if (path_len < min_path) {
            min_path = path_len
        }
    }
    return min_path
}

let puzzle = get_map()
let paths = collect_all(puzzle)
let min = shortest(paths, puzzle)
console.log('Task 01: ', min)
min = shortest(paths, puzzle, true)
console.log('Task 02: ', min)
