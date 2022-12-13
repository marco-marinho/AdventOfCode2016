import * as util from "util";

export class Element {
    name: string;
    type: string;
    is_generator: boolean;

    constructor(name: string, type: string, is_generator: boolean) {
        this.name = name
        this.type = type
        this.is_generator = is_generator
    }

    public toString = (): string => {
        if (this.is_generator){
            return 'G'
        }
        else{
            return 'C'
        }
    }

    [util.inspect.custom]() {
        return this.toString();
    }

    public equals(obj: Element){
        return this.type === obj.type && this.is_generator === obj.is_generator
    }
}