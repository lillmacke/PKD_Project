import { starting_board } from "./Starting_board";
import {Dice, GameState, Board, Player} from "./types";
import {find_single, stones_on_bar, to_hit, update_player_status, 
    all_stones_home, can_bear_off, borne_off, switch_player} from "./logic_&_checks"


console.log("Welcome to Backgammon!");

const state = starting_board();
















//när ens tur är slut
switch_player(state);





