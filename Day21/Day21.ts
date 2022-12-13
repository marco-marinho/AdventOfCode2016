import {parseLines} from "../Util";


class command {
    type: string
    arg1: number | string
    arg2: number | string

    constructor(type: string, arg1: number | string, arg2: number | string) {
        this.type = type
        this.arg1 = arg1
        this.arg2 = arg2
    }

}

function get_commands() {
    let commands: command[] = []
    let lines = parseLines(__dirname, 'data.txt')
    for (let line of lines) {
        line = line.trimEnd()
        if (line.indexOf('rotate based') !== -1) {
            commands.push(new command('rb', line[line.length - 1], 0))
        } else if (line.indexOf('swap letter') !== -1) {
            let buff = line.split(' ')
            commands.push(new command('sl', buff[2], buff[5]))
        } else if (line.indexOf('move position') !== -1) {
            let buff = line.split(' ')
            commands.push(new command('mv', Number(buff[2]), Number(buff[5])))
        } else if (line.indexOf('reverse positions') !== -1) {
            let buff = line.split(' ')
            commands.push(new command('rv', Number(buff[2]), Number(buff[4])))
        } else if (line.indexOf('rotate right') !== -1) {
            let buff = line.split(' ')
            commands.push(new command('rt', Number(buff[2]), 0))
        } else if (line.indexOf('rotate left') !== -1) {
            let buff = line.split(' ')
            commands.push(new command('rt', -Number(buff[2]), 0))
        } else if (line.indexOf('swap position') !== -1) {
            let buff = line.split(' ')
            commands.push(new command('wp', Number(buff[2]), Number(buff[5])))
        }
    }
    return commands
}

class Scrambler {
    password: string[]

    constructor(password: string[]) {
        this.password = [...password]
    }

    public swap_position(x: number, y: number) {
        let buff = this.password[x]
        this.password[x] = this.password[y]
        this.password[y] = buff
    }

    public swap_letter(x: string, y: string) {
        this.swap_position(this.password.indexOf(x), this.password.indexOf(y))
    }

    public rotate(steps: number) {
        let end = this.password.length - 1
        if (steps < 0) {
            steps *= -1
            for (let rotation = 0; rotation < steps; rotation++) {
                let buff = this.password[0]
                for (let i = 0; i < end; i++) {
                    this.password[i] = this.password[i + 1]
                }
                this.password[end] = buff
            }
        } else if (steps > 0) {
            for (let rotation = 0; rotation < steps; rotation++) {
                let buff = this.password[end]
                for (let i = 0; i < end; i++) {
                    this.password[end - i] = this.password[end - i - 1]
                }
                this.password[0] = buff
            }
        }
    }

    public rotate_based_on(letter: string) {
        let index = this.password.indexOf(letter)
        if (index >= 4) {
            index += 1
        }
        index += 1
        this.rotate(index)
    }

    public reverse(x: number, y: number) {
        let middle = Math.ceil((y - x) / 2)
        for (let i = 0; i < middle; i++) {
            let i_end = y - i
            let buff = this.password[x + i]
            this.password[x + i] = this.password[i_end]
            this.password[i_end] = buff
        }
    }

    public move(x: number, y: number) {
        if (y > x) {
            let buff = this.password[x]
            for (let i = x; i < y; i++) {
                this.password[i] = this.password[i + 1]
            }
            this.password[y] = buff
        } else {
            let buff = this.password[x]
            for (let i = x; i > y; i--) {
                this.password[i] = this.password[i - 1]
            }
            this.password[y] = buff
        }
    }

    public print() {
        console.log(this.password.join(''))
    }

    public string() {
        return this.password.join('')
    }

}

function run_commands(commands: command[], password: Scrambler) {
    for (let command of commands) {
        if (command.type === 'rb') {
            password.rotate_based_on(command.arg1.toString())
        } else if (command.type === 'sl') {
            password.swap_letter(command.arg1.toString(), command.arg2.toString())
        } else if (command.type === 'mv') {
            password.move(Number(command.arg1), Number(command.arg2))
        } else if (command.type === 'rv') {
            password.reverse(Number(command.arg1), Number(command.arg2))
        } else if (command.type === 'rt') {
            password.rotate(Number(command.arg1))
        } else if (command.type === 'wp') {
            password.swap_position(Number(command.arg1), Number(command.arg2))
        }
    }
}

function permute(permutation) {
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

function task_01() {
    let password = Array.from('abcdefgh')
    let commands = get_commands()
    let scramble = new Scrambler(password)
    run_commands(commands, scramble)
    console.log('Task 01:')
    scramble.print()
}

function task_02() {
    let target = 'fbgdceah'
    let commands = get_commands()
    let permutations = permute(Array.from('abcdefgh'))

    for (let permutation of permutations) {
        let scramble = new Scrambler(permutation)
        run_commands(commands, scramble)
        let output = scramble.string()
        if (output === target) {
            console.log('Task 02:')
            console.log(permutation.join(''))
            break
        }
    }
}

task_01()
task_02()