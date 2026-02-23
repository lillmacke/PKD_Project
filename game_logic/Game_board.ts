import { starting_board } from "./Starting_board";
import {Dice, GameState, Board, Player} from "./types";
import {dice_roll} from "./Dice";
import {find_single, stones_on_bar, to_hit, update_player_status, 
    all_stones_home, can_bear_off, borne_off, switch_player,
    game_over} from "./logic_&_checks"


console.log("Welcome to Backgammon!");

const state = starting_board();

function play_game(state : GameState) : void {

    while(game_over(state) === null) {

        const dice = dice_roll();












        //när ens tur är slut
        switch_player(state);
    
    }

    const winner = game_over(state);

    console.log("{winner} wins!");


}





