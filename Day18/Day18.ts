function gen_next_row(cur_row: boolean[]){
    let next_row: boolean[] = []
    for (let index = 0; index < cur_row.length; index ++){
        let l = index > 0 ? cur_row[index - 1] : false
        let c = cur_row[index]
        let r = index < cur_row.length - 1 ? cur_row[index + 1] : false
        if ((l && c && !r) || (c && r && !l) || (!c && !r && l) || (!c && r &&!l)){
            next_row.push(true)
        }
        else{
            next_row.push(false)
        }
    }
    return next_row
}

function row_to_string(row: boolean[]){
    let output = []
    for (let element of row){
        if (element){
            output.push('^')
        }
        else {
            output.push('.')
        }
    }
    return output.join('')
}

function string_to_row(row: string){
    let output = []
    for (let element of row){
        if (element === '^'){
            output.push(true)
        }
        else {
            output.push(false)
        }
    }
    return output
}

function gen_map(row: boolean[], size: number){
    let rows: boolean[][] = []
    rows.push(row)
    for (let index = 0; index < size - 1; index ++){
        let next_row = gen_next_row(rows[rows.length - 1])
        rows.push(next_row)
    }
    return rows
}

function print_map(rows: boolean[][]){
    for (let row of rows){
        console.log(row_to_string(row))
    }
}

function count_safe(rows: boolean[][]){
    let count = 0
    for (let row of rows){
        for (let element of row){
            if (!element){
                count += 1
            }
        }
    }
    return count
}

const input_18 = '.^^..^...^..^^.^^^.^^^.^^^^^^.^.^^^^.^^.^^^^^^.^...^......^...^^^..^^^.....^^^^^^^^^....^^...^^^^..^'
console.log('Task 01:')
let map = gen_map(string_to_row(input_18), 40)
console.log(count_safe(map))
console.log('Task 02:')
map = gen_map(string_to_row(input_18), 400000)
console.log(count_safe(map))
