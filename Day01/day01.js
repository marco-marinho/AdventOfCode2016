import {input} from './input.js'

let status = {x: 0, y: 1, coodinates: {x: 0, y: 0}}
let visit_log = []

for (const element of input) {
   if(walk(element, status, visit_log)){
       break;
   }
}

console.log(status.coodinates)


function turn(direction, status) {
    let x = status.x
    let y = status.y
    if(direction === "L"){
        status.y = x
        status.x = -y
    }
    if(direction === "R"){
        status.y = -x
        status.x = y
    }
    return status
}

function walk(command, status, visit_log) {
    let direction = command[0];
    let quantity = Number(command.slice(1))
    status = turn(direction, status)
    let arrived = false;
    for(let step = 0; step < quantity; step++){
        status.coodinates.x += status.x;
        status.coodinates.y += status.y;
        if (visit_log.some(visit => (visit.x === status.coodinates.x && visit.y === status.coodinates.y))) {
            arrived = true
            break;
        }
        visit_log.push({...status.coodinates});
    }
    return arrived
}