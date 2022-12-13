function complement(input: string[]) {
    let output = [... input].reverse()
    for (let index = 0; index < input.length; index++){
        if (output[index] === '1'){
            output[index] = '0'
        }
        else{
            output[index] = '1'
        }
    }
    return output
}

function expand(input: string[]) {
    let in_complement = complement(input)
    return [... input, '0', ... in_complement]
}

function expand_to(input: string[], size: number){
    while(input.length < size){
        input = expand(input)
    }
    return input.slice(0, size)
}

function check_sum(input: string[]){
    let cur_input = [... input]
    let check_sum: string[] = []
    while(cur_input.length % 2 === 0){
        check_sum = []
        for (let index = 0; index < cur_input.length; index+=2){
            if (cur_input[index] === cur_input[index + 1]){
                check_sum.push('1')
            }
            else{
                check_sum.push('0')
            }
        }
        cur_input = [... check_sum]
    }
    return check_sum
}

function run(initial: string, size: number){
    let input = Array.from(initial)
    let expanded = expand_to(input, size)
    return check_sum(expanded)
}

let initial = '10010000000110000'

console.log('Task 01:')
console.log(run(initial, 272).join(''))
console.log('Task 02:')
console.log(run(initial, 35651584).join(''))
