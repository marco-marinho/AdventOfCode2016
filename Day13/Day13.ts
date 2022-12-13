const key: number = 1362

function bitCount(n: number) {
    let bits = 0;
    while (n !== 0) {
        bits += bitCount32(n | 0)
        n /= 0x100000000
    }
    return bits
}

function bitCount32(n: number) {
    n = n - ((n >> 1) & 0x55555555)
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
    return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}

class vertex {
    distance: number = 0
    location: number[]
    wall: boolean

    constructor(wall: boolean, location: number[]) {
        this.wall = wall
        this.location = location
    }

    public hash() {
        return 'X:' + this.location[0] + 'Y:' + this.location[1]
    }

    public neighbours() {
        return [[this.location[0] + 1, this.location[1]],
            [this.location[0] - 1, this.location[1]],
            [this.location[0], this.location[1] - 1],
            [this.location[0], this.location[1] + 1]]
    }

}

function is_wall(x: number, y: number) {
    let alpha = (x * x) + (3 * x) + (2 * x * y) + y + (y * y) + key
    return bitCount(alpha) % 2 !== 0
}


function hash(x: number, y: number) {
    return 'X:' + x + 'Y:' + y
}

let visited: Map<string, vertex>
let walls : Map<string, vertex>
let queue : Map<string, vertex>
let start: vertex
let target = [31, 39]

function init(){
    visited = new Map<string, vertex>()
    walls = new Map<string, vertex>()
    queue = new Map<string, vertex>()
    start = new vertex(false, [1, 1])
    start.distance = 0
    queue.set(start.hash(), start)
}

function run(task: number) {
    while (true) {
        let min_dist = Infinity
        let hash_min = ''
        queue.forEach((value, key) => {
                if (value.distance < min_dist) {
                    min_dist = value.distance
                    hash_min = key
                }
            }
        )
        let current = queue.get(hash_min)!
        if (task === 1 && current.location[0] === target[0] && current.location[1] === target[1]) {
            console.log(current.distance)
            break
        }
        queue.delete(hash_min)
        let cost = current.distance + 1
        if (task === 2 && current.distance === 51) {
            console.log(visited.size)
            break
        }
        visited.set(hash_min, current)
        let neighbours = current.neighbours()
        for (let neighbour of neighbours) {
            if (neighbour[0] < 0 || neighbour[1] < 0) {
                continue
            }
            let temp_hash = hash(neighbour[0], neighbour[1])
            if (visited.has(temp_hash)) {
                continue
            }
            if (walls.has(temp_hash)) {
                continue
            }
            if (queue.has(temp_hash)) {
                let temp_vertex = queue.get(temp_hash)!
                if (temp_vertex.distance < cost) {
                    temp_vertex.distance = cost
                }
                continue
            }
            let wall_b = is_wall(neighbour[0], neighbour[1])
            if (wall_b) {
                let new_wall = new vertex(true, [neighbour[0], neighbour[1]])
                walls.set(new_wall.hash(), new_wall)
            } else {
                let new_vertex = new vertex(false, [neighbour[0], neighbour[1]])
                new_vertex.distance = cost
                queue.set(new_vertex.hash(), new_vertex)
            }
        }
    }
}

init()
console.log('Task 01:')
run(1)
init()
console.log('Task 02:')
run(2)