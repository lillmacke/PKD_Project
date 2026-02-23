import { starting_board } from "./Starting_board";

import {Dice, GameState, Board, Player} from "./types";

import {dice_roll} from "./Dice";

import {find_single, stones_on_bar, to_hit, update_player_status, 
    all_stones_home, can_bear_off, borne_off, switch_player,
    game_over} from "./logic_&_checks"

import { apply_move, is_valid_move } from "./moves";

console.log("Welcome to Backgammon!");

const new_state = starting_board();

const answer = prompt("Do you want to start a new game?: ");
if (answer === "yes") {
    console.log("Starting new game...")
    play_game(new_state);
} else {
    console.log("Goodbye!");
}

function play_game(state : GameState) : void {

    let move_count = 0;

    function check_move(state: GameState, from: number, die: number) : boolean {
        if(is_valid_move(state, from, die)) {
         apply_move(state, from, die)
            move_count = move_count + 1;
            if(move_count === state.dice?.values.length) {
                switch_player(state);
                move_count = 0;
            }
        }
        return false;
    }

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
            check_move(state, point, state.dice?.values[0]!)
        } else if (input_move === "2") {
            const input_point = prompt("From what point do you make a move?")
            const point = Number(input_point);                
            check_move(state, point, state.dice?.values[1]!)
        } else {
            console.log ("Wrong choice, try again")
            make_move(state); 
        }

    }

    while(game_over(state) === null) {

        if (state.dice === null) {
            state.dice = dice_roll();
        }    
        
        make_move(state);

    const winner = game_over(state);

    console.log(`${winner} wins!`);

    }

}





