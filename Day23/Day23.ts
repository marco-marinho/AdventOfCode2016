import {parseLines} from "../Util";

function is_number(num: string) {
    return !isNaN(Number(num))
}

class Instruction {
    type: string
    arg1: string
    arg2: string

    constructor(type: string, arg1: string, arg2: string) {
        this.type = type
        this.arg1 = arg1
        this.arg2 = arg2
    }

    public is_valid() {
        if (this.type === 'inc' || this.type === 'dec') {
            return !is_number(this.arg1);
        }
        if (this.type === 'jnz') {
            return true
        }
        if (this.type === 'cpy') {
            return !is_number(this.arg2)
        }
        if (this.type === 'tgl') {
            return true
        }
        return true
    }
}

class CPU {

    instruction_pointer: number = 0
    status = new Map<string, number>()
    registers: string[] = ['a', 'b', 'c', 'd']
    rom: Instruction[]

    constructor(rom: Instruction[]) {
        for (let register of this.registers) {
            this.status.set(register, 0)
        }
        this.rom = rom
    }

    public set_register(register: string, value: string) {
        if (this.registers.indexOf(value) !== -1) {
            let val = this.status.get(value)!
            this.status.set(register, val)
        } else {
            let val = Number(value)
            this.status.set(register, val)
        }
        this.instruction_pointer += 1
    }

    public decrement_register(register: string) {
        let val = this.status.get(register)! - 1
        this.status.set(register, val)
        this.instruction_pointer += 1
    }

    public increment_register(register: string) {
        let val = this.status.get(register)! + 1
        this.status.set(register, val)
        this.instruction_pointer += 1
    }

    public multiply() {
        let c = this.status.get('c')!
        let d = this.status.get('d')!
        let res = c * d
        let a = this.status.get('a')!
        this.status.set('a', a + res)
        this.status.set('c', 0)
        this.status.set('d', 0)
        this.instruction_pointer += 1
    }

    public jump(offset: string, register: string) {
        let val
        let offset_n
        if (is_number(offset)) {
            offset_n = Number(offset)
        } else {
            offset_n = this.status.get(offset)!
        }
        if (is_number(register)) {
            val = Number(register)
        } else {
            val = this.status.get(register)
        }
        if (val !== 0) {
            this.instruction_pointer += offset_n
        } else {
            this.instruction_pointer += 1
        }
    }

    public toggle(offset: string) {
        let offset_idx
        if (is_number(offset)) {
            offset_idx = Number(offset)
        } else {
            offset_idx = this.status.get(offset)!
        }
        if (this.instruction_pointer + offset_idx >= this.rom.length || this.instruction_pointer + offset_idx < 0) {
            this.instruction_pointer += 1
            return
        }
        let other = this.rom[this.instruction_pointer + offset_idx]
        if (other.type === 'inc') {
            other.type = 'dec'
        } else if (other.type === 'tgl' || other.type === 'dec') {
            other.type = 'inc'
        } else if (other.type === 'jnz') {
            other.type = 'cpy'
        } else if (other.type === 'cpy') {
            other.type = 'jnz'
        }
        this.instruction_pointer += 1
    }

    public run() {
        while (this.instruction_pointer < this.rom.length) {
            let next_instruction = this.rom[this.instruction_pointer]
            if (!next_instruction.is_valid()) {
                this.instruction_pointer += 1
                continue
            }
            if (next_instruction.type === 'cpy') {
                this.set_register(next_instruction.arg2, next_instruction.arg1)
            } else if (next_instruction.type === 'inc') {
                this.increment_register(next_instruction.arg1)
            } else if (next_instruction.type === 'dec') {
                this.decrement_register(next_instruction.arg1)
            } else if (next_instruction.type === 'jnz') {
                this.jump(next_instruction.arg2, next_instruction.arg1)
            } else if (next_instruction.type === 'tgl') {
                this.toggle(next_instruction.arg1)
            } else if (next_instruction.type === 'mtp') {
                this.multiply()
            }
        }
        console.log(this.status.get('a'))
    }
}

function get_rom() {
    let data = parseLines(__dirname, 'data.txt')
    let instructions: Instruction[] = []

    for (let line of data) {
        let buff = line.trim().split(' ')
        if (buff.length < 3) {
            buff[2] = ""
        }
        let ninst = new Instruction(buff[0], buff[1], buff[2])
        instructions.push(ninst)
    }
    return instructions
}

let cpu = new CPU(get_rom())
console.log('Task 01:')
cpu.status.set('a', 7)
cpu.run()

cpu = new CPU(get_rom())
console.log('Task 02:')
cpu.status.set('a', 12)
cpu.run()
