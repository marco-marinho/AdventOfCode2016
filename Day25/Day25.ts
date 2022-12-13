function check_buffer(buffer: number[]){
    if (buffer.length %2 != 0){
        return false
    }
    for (let idx = 0; idx < buffer.length; idx+=2){
        if(buffer[idx]!=0 || buffer[idx+1]!=1){
            return false
        }
    }
    return true
}

function cal_buffer(input_val: number){
    let input = input_val + 2534
    let buffer = []
    while(input != 0){
        let b = input % 2
        input = Math.floor(input/2)
        buffer.push(b)
    }
    return buffer
}

let entry = 0
while(true){
    let my_buf = cal_buffer(entry)
    if (check_buffer(my_buf)){
        break
    }
    entry += 1
}