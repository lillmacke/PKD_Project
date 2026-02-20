import {Board, Player, GameState, Point, Dice} from "../game_logic/types";
import { apply_move } from "./moves";


/**
 * Checks if a player has stones on the bar. 
 * @param board 
 * @param player 
 * @returns 
 */
export function stones_on_bar(board : Board, player: Player): boolean {
    return board.bar[player] > 0
};

// Ska hitta punkter som endast har en sten, och kolla om den tillhör motståndaren
export function find_single(state: GameState, point: number): boolean {
    const stone_count = state.board.points[point].count;

    const opp = state.current_player === "white"
                ? "black"
                : "white";

    if (stone_count === 1 &&
        (state.current_player !== opp)) {
        return true;
    }
    return false;
};

// "äter upp" en ensam sten om man landar på den, och skickar den till baren
// Invarianten blir väl att "dest"-punkten måste ha en ensam motståndar-sten, så denna
// funktion kallas bara om detta är uppfyllt (se apply_move).
export function to_hit(state: GameState, from: number, die: number): GameState {
    const dest = state.current_player === "white"
                ? from + die 
                : from - die;
    const opp = state.current_player === "white"
                ? "black"
                : "white";
    const point = state.board.points;

    point[from].count--;
    update_player_status(state, from, dest);
    if (state.current_player === "white") {
        state.board.bar.black++; 
    } else {
        state.board.bar.white++;
    }
   return state; 
};

export function update_player_status(state: GameState, from: number, dest : number): GameState {
    const point = state.board.points;

    if (point[from].count === 0) {
        point[from].player = null;
    }
    if (point[dest].count > 0) {        
        point[dest].player = state.current_player;
    }

    return state;

};