import { switch_player } from "./logic_&_checks";
import { apply_move, is_valid_move } from "./moves";
import { GameState } from "./types";



const move_count = 0;

function helper();
if (is_valid_move(state, from, die)) {
    apply_move(state, from, die);
    move_count = move_count + 1;
}   
    
    if (move_count = state.dice.values.length) 
        du får inte göra fler moves
        return switch_player;


1. Spela med tärning "dice.values[0]"
2. Spelaa asdasgg we 

Om 1:
apply_move(med tärning 1);

VIll du spela med tärninge "som är kvar"?

function make_move(state: GameState) : void  {
    if (state.dice?.values.length === 4) {
        for ( let i = 0; i < 4; i++) {
            console.log("Double dice! Nice");
            const input_point = prompt("From what point do you make a move?");
            const point = Number(input_point);
            check_move(state, point, state.dice.values[i]);
        }
    }
    
    console.log("Make your move");
    const input_move = prompt (`1. Make move with ${state.dice?.values[0]} \n
            2. Make move with ${state.dice?.values[1]}`);
    
    if (input_move === "1") {
        const input_point = prompt("From what point do you make a move?")
        const point = Number(input_point);
        check_move(state, point, state.dice?.values[0])
    } else if (input_move === "2") {
        const input_point = prompt("From what point do you make a move?")
        const point = Number(input_point);
        check_move(state, point, state.dice?.values[1])
    } else {
        console.log ("Wrong choice, try again")
        make_move(state); 
    }

};