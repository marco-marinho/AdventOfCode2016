import {parseLines} from "../Util";

class block_range {
    start: number
    end: number

    constructor(start: number, end: number) {
        this.start = start
        this.end = end
    }

    merge(start: number, end: number): boolean {
        if (end === this.start || end === this.start - 1){
            this.start = start
            return true
        }
        if (start === this.end || start === this.end + 1){
            this.end = end
            return true
        }
        if (end < this.start || start > this.end) {
            return false
        }
        if (start > this.start && end < this.end) {
            return true
        }
        if (start > this.start && end > this.end) {
            this.end = end
            return true
        }
        if (start < this.start && end < this.end) {
            this.start = start
            return true
        }
        return false
    }

}

function get_data() {
    let data = parseLines(__dirname, 'data.txt')
    let others: number[][] = []
    for (let line of data) {
        line = line.trimEnd()
        let nums = line.split('-')
        others.push([Number(nums[0]), Number(nums[1])])
    }

    let other = others.pop()
    let range = new block_range(other![0], other![1])
    let ranges = [range]
    for (let other of others) {
        let merged = false
        for (let range of ranges) {
            if (range.merge(other[0], other[1])) {
                merged = true
                break
            }
        }
        if (!merged) {
            ranges.push(new block_range(other[0], other[1]))
        }
    }

    while (true) {
        let to_remove = Infinity
        outer_loop:
            for (let inner of ranges){
                for (let outer of ranges){
                    if (inner === outer){
                        continue
                    }
                    let other = [outer.start, outer.end]
                    if (inner.merge(other[0], other[1])){
                        to_remove = ranges.indexOf(outer)
                        break outer_loop
                    }
                }
            }
        if (to_remove === Infinity){
            break
        }
        ranges.splice(to_remove, 1)
    }
    return ranges
}


function task_01(ranges: block_range[]) {
    let min = Infinity
    for (let tentative of ranges) {
        if (tentative.end + 1 < min){
            min = tentative.end + 1
        }
    }
    return min
}

function task_02(ranges: block_range[]) {
    let valid = 0
    for (let tentative of ranges) {
        let testing = tentative.end + 1
        let limit = 2 ** 32
        for (let element of ranges) {
            if (element.start < limit && element.start > testing) {
                limit = element.start
            }
        }
        valid += limit - testing
    }
    return valid
}

let ranges = get_data()
let ip = task_01(ranges)
console.log(ip)
let valid = task_02(ranges)
console.log(valid)