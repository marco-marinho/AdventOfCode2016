import {Element} from "./Element";

export class State {

    elevator: number
    positions: Array<Array<Element>>
    father: number[]

    constructor(elevator: number, positions: Array<Array<Element>>) {
        this.father = [0, 0]
        this.elevator = elevator
        this.positions = positions
    }

    public equals(obj: State): boolean {
        return this.elevator === obj.elevator && this.areEqual(this.positions[0], obj.positions[0]) && this.areEqual(this.positions[1], obj.positions[1]) &&
            this.areEqual(this.positions[2], obj.positions[2]) && this.areEqual(this.positions[3], obj.positions[3])
    }

    public check_success(): boolean {
        return (this.positions[0].length + this.positions[1].length + this.positions[2].length) === 0
    }

    public num_generators(floor: number): number {
        let out = 0
        for (let element of this.positions[floor]) {
            if (element.is_generator) {
                out += 1
            }
        }
        return out
    }

    private areEqual(array1: Element[], array2: Element[]) {
        return array1.length === array2.length && array1.sort().toString() === array2.sort().toString()
    }

    public hash_string() {
        return '1:' + this.positions[0].sort().toString() + '2:' + this.positions[1].sort().toString() + '3:' +
            this.positions[2].sort().toString() + '4:' + this.positions[3].sort().toString()
    }
}