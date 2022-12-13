import {parseLines} from '../Util';

class Instruction{
    type: string
    arg1: string
    arg2: string

    constructor(type: string, arg1: string, arg2: string) {
        this.type = type
        this.arg1 = arg1
        this.arg2 = arg2
    }
}

class CPU{

    instruction_pointer: number = 0
    status = new Map<string, number>()
    registers: string[] = ['a', 'b', 'c', 'd']

    constructor() {
        for (let register of this.registers){
            this.status.set(register, 0)
        }
    }

    public set_register(register: string, value: string){
        if (this.registers.indexOf(value) !== -1){
            let val = this.status.get(value)!
            this.status.set(register, val)
        }
        else{
            let val = Number(value)
            this.status.set(register, val)
        }
        this.instruction_pointer += 1
    }

    public decrement_register(register: string){
        let val = this.status.get(register)! - 1
        this.status.set(register, val)
        this.instruction_pointer += 1
    }

    public increment_register(register: string){
        let val = this.status.get(register)! + 1
        this.status.set(register, val)
        this.instruction_pointer += 1
    }

    public jump(offset: string, register: string){
        let val = this.status.get(register)
        if (val !== 0){
            this.instruction_pointer += Number(offset)
        }
        else{
            this.instruction_pointer += 1
        }
    }
}

let data = parseLines(__dirname, 'data.txt')
let instructions: Instruction[] = []

for (let line of data){
    let buff = line.trim().split(' ')
    if (buff.length < 3){
        buff[2] = ""
    }
    let ninst = new Instruction(buff[0], buff[1], buff[2])
    instructions.push(ninst)
}

function run(instructions: Instruction[], cpu: CPU){
    while(cpu.instruction_pointer < instructions.length){
        let next_instruction = instructions[cpu.instruction_pointer]
        if (next_instruction.type === 'cpy'){
            cpu.set_register(next_instruction.arg2, next_instruction.arg1)
        }
        else if (next_instruction.type === 'inc'){
            cpu.increment_register(next_instruction.arg1)
        }
        else if (next_instruction.type === 'dec'){
            cpu.decrement_register(next_instruction.arg1)
        }
        else if (next_instruction.type === 'jnz'){
            cpu.jump(next_instruction.arg2, next_instruction.arg1)
        }
    }
    console.log(cpu.status.get('a'))
}

let cpu = new CPU()
console.log('Task 01:')
run(instructions, cpu)

let cpu2 = new CPU()
cpu2.status.set('c', 1)
console.log('Task 02:')
run(instructions, cpu2)