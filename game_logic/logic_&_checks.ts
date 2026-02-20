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

// Ska hitta punkter
export function find_single(state: GameState, point: number): boolean {
    const stone_count = state.board.points[point].count;

    if (stone_count === 1) {
        return true;
    }
    return false;
};

export function to_hit(state: GameState, from: number, die: number): GameState {
    const opp = state.current_player === "white"
                ? "black"
                : "white";    


        
    }
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