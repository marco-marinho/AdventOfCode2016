import {parseLines} from '../Util';
import {Element} from "./Element";
import {State} from "./State";

const MAX_FLOORS = 4
let invalid_states = new Map<string, Set<string>>()

function get_initial_state(filename: string) {
    let data = parseLines(__dirname, filename);
    let microchip_regex = new RegExp('\\w+-compatible microchip', 'gm')
    let generator_regex = new RegExp('\\w+ generator', 'g')


    let positions = new Array<Array<Element>>()
    for (let index of Array(data.length).keys()) {
        let microchips = data[index].match(microchip_regex)
        let generators = data[index].match(generator_regex)
        positions[index] = []
        if (microchips !== null) {
            for (let microchip of microchips) {
                let type = microchip.split('-')[0]
                positions[index].push(new Element(microchip, type, false))
            }
        }
        if (generators !== null) {
            for (let generator of generators) {
                let type = generator.split(' ')[0]
                positions[index].push(new Element(generator, type, true))
            }
        }
    }
    let status = new State(0, positions)
    status.father = [-1, -1]
    return status
}

function print_status(state: State) {
    console.log('___________________')
    for (let floor of Array(MAX_FLOORS).keys()) {
        floor = MAX_FLOORS - floor - 1
        let output = "F" + (floor + 1) + " "
        if (state.elevator == floor) {
            output += "E "
        } else {
            output += ". "
        }
        if (state.positions[floor].length > 0) {
            for (let entry of state.positions[floor]) {
                output += entry + " "
            }
        }
        console.log(output)
    }
    console.log('___________________')
}

function print_history(state: State, history: Array<Array<State>>) {
    print_status(state)
    if (state.father[0] === -1 || state.father[1] === -1) {
        return
    }
    print_history(history[state.father[0]][state.father[1]], history)
}

function check_if_valid(state: State): boolean {
    for (let elements of state.positions) {
        let chips = []
        let generators = []
        for (let element of elements) {
            if (!element.is_generator) {
                chips.push(element)
            } else {
                generators.push(element)
            }
        }
        if (chips.length === 0 || generators.length === 0) {
            continue
        }
        for (let chip of chips) {
            let type = chip.type
            let safe = false
            let in_danger = false
            for (let generator of generators) {
                if (generator.type === type) {
                    safe = true
                    break
                } else {
                    in_danger = true
                }
            }
            if (in_danger && !safe) {
                return false
            }
        }
    }
    return true
}

function check_combination_valid(combination: Element[], others: Element[]) {
    let buff = [...others]
    if (combination.length > 1) {
        if (combination[0].is_generator && !combination[1].is_generator && combination[0].type !== combination[1].type) {
            return false
        }
        if (combination[1].is_generator && !combination[0].is_generator && combination[0].type !== combination[1].type) {
            return false
        }
    }
    buff = removeAllItems(buff, combination)
    for (let element of buff) {
        if (!element.is_generator) {
            let type = element.type
            let safe = false
            let in_danger = false
            for (let other of buff) {
                if (other.is_generator && other.type === type) {
                    safe = true
                }
                if (other.is_generator && other.type !== type) {
                    in_danger = true
                }
            }
            if (in_danger && !safe) {
                return false
            }
        }
    }
    return true
}

function generate_next_states(status: State, prev_states: Map<string, Set<String>>, father: number[]): State[] {
    let elements = [...status.positions[status.elevator]]
    let combinations = allPossibleCombinations(elements)
    let invalid = []
    for (let combination of combinations) {
        if (!check_combination_valid(combination, elements)) {
            invalid.push(combination)
        }
    }
    combinations = removeAllItems(combinations, invalid)
    let next_states: State[] = []
    let possible_floor = [status.elevator - 1, status.elevator + 1]
    for (let floor of possible_floor) {
        if (floor === -1 || floor >= MAX_FLOORS) {
            continue
        }
        let cur_floor_elements = [...status.positions[floor]]
        for (let combination of combinations) {
            let new_status = new State(status.elevator, [...status.positions])
            new_status.father = [...father]
            let tentative_new_floor = cur_floor_elements.concat(combination)
            new_status.elevator = floor
            new_status.positions[floor] = tentative_new_floor
            new_status.positions[status.elevator] = removeAllItems(new_status.positions[status.elevator], combination)
            if (get_map_state(invalid_states, new_status)!.has(new_status.hash_string())){
                continue
            }
            if (!check_if_valid(new_status)) {
                push_map_state(invalid_states, new_status)
                continue
            }
            if (get_map_state(prev_states, new_status)!.has(new_status.hash_string())) {
                continue
            }
            next_states.push(new_status)
            push_map_state(prev_states, new_status)
        }
    }
    return next_states
}

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
    arr = [...arr]
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function removeAllItems<T>(arr: Array<T>, del: Array<T>): Array<T> {
    let buff = [...arr]
    for (let element of del) {
        buff = removeItem(buff, element)
    }
    return buff
}

function allPossibleCombinations<T>(arr: Array<T>): Array<Array<T>> {
    return arr.flatMap(
        (v, i) => arr.slice(i + 1).map(w => [v, w])
    ).concat(arr.flatMap(
        i => [[i]]
    ))
}

function get_key(status: State): string {
    return [status.elevator,
        status.positions[0].length, status.num_generators(0),
        status.positions[1].length, status.num_generators(1),
        status.positions[2].length, status.num_generators(2),
        status.positions[3].length, status.num_generators(3)].toString()
}

function set_map_state(map: Map<string, Set<String>>, status: State, value: Set<string>) {
    let key = get_key(status)
    map.set(key, value)
}

function push_map_state(map: Map<string, Set<String>>, status: State) {
    let key = get_key(status)
    if (!map.has(key)) {
        set_map_state(map, status, new Set<string>())
    }
    if (map.has(key)) {
        map.get(key)!.add(status.hash_string())
    }
}

function get_map_state(map: Map<string, Set<String>>, status: State) {
    let key = get_key(status)
    if (!map.has(key)) {
        set_map_state(map, status, new Set<string>())
    }
    return map.get(key)
}

function task(filename: string) {
    let status = get_initial_state(filename)
    let next_states = [status]
    let prev_states_map = new Map<string, Set<string>>()
    push_map_state(prev_states_map, status)
    let level = 0
    mainloop:
        while (true) {
            let new_states = new Array<State>()
            let coord = 0
            for (let state of next_states) {
                if (state.check_success()) {
                    break mainloop
                }
                let buff = generate_next_states(state, prev_states_map, [level, coord])
                new_states = new_states.concat(buff)
                coord += 1
            }
            level += 1
            next_states = [...new_states]
        }
    console.log('Target reached after ' + level + ' steps.')
}

console.log('Task 01: ')
task('data.txt')
console.log('Task 02: ')
task('data_02.txt')