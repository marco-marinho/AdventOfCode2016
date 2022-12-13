
class Elf{
    next: Elf | null = null
    previous: Elf | null = null
    index: number

    constructor(index: number) {
       this.index = index
    }
}

function pop_head(input: {head: Elf | null, tail: Elf | null}){
    if (input.head === null){
        return null
    }
    let ret = input.head
    let next = input.head.next
    if (next !== null){
        next.previous = null
    }
    if (input.tail === input.head){
        input.tail = next
    }
    input.head = next
    ret.next = null
    ret.previous = null
    return ret
}

function pop_tail(input: {head: Elf | null, tail: Elf | null}){
    if (input.tail === null){
        return null
    }
    let ret = input.tail
    let previous = input.tail.previous
    if (previous !== null){
        previous.next = null
    }
    input.tail = previous
    ret.next = null
    ret.previous = null
    return ret
}

function push_tail(val: Elf | null, input: {head: Elf | null, tail: Elf | null}){
    if (val === null){
        return
    }
    if (input.tail === null){
        input.tail = val
        if (input.head === null){
            input.head = input.tail
        }
        return
    }
    let previous = input.tail
    input.tail.next = val
    input.tail = val
    input.tail.previous = previous
    if (input.head === null){
        input.head = input.tail
    }
}

function print_state(left: {head: Elf | null, tail: Elf | null}, right: {head: Elf | null, tail: Elf | null}){
    let next = left.head
    let oleft = []
    while(next !== null){
        oleft.push(next.index)
        next = next.next
    }
    next = right.head
    let oright = []
    while(next !== null){
        oright.push(next.index)
        next = next.next
    }
    console.log([oleft, oright])
}

function task_01() {
    let head = new Elf(1)

    let current = head
    for (let index = 2; index < 3017957 + 1; index++) {
        current.next = new Elf(index)
        current = current.next
    }
    current.next = head

    current = head

    while (current !== current.next) {
        current.next = current.next!.next
        current = current.next!
    }
    console.log(current.index)
}

function task_02() {
    let target = 3017957
    let left_head = new Elf(1)
    let current = left_head
    let left = Math.floor(target / 2)
    for (let index = 1; index < Math.floor(target / 2); index++) {
        current.next = new Elf(index + 1)
        current.next.previous = current
        current = current.next
    }
    let left_tail = current
    let right = Math.ceil(target / 2)
    let right_head = new Elf(right)
    current = right_head
    for (let index = right + 1; index <= target; index ++){
        current.next = new Elf(index)
        current.next.previous = current
        current = current.next
    }
    let right_tail = current
    let left_vec = {tail: left_tail, head: left_head}
    let right_vec = {tail: right_tail, head: right_head}
    while(left > 0 && right > 0){
        if (right >= left){
            pop_head(right_vec)
            right--
        }
        else{
            pop_tail(left_vec)
            left--
        }
        let to_shift_right = pop_head(left_vec)
        let to_shift_left = pop_head(right_vec)
        push_tail(to_shift_right, right_vec)
        push_tail(to_shift_left, left_vec)
    }
    if (right_vec.head !== null){
        console.log(right_vec.head.index)
    }
    if (left_vec.head !== null){
        console.log(left_vec.head.index)
    }
}

console.log('Task 01:')
task_01()
console.log('Task 02:')
task_02()

