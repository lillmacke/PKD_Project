import {Dice, GameState, Board, Player} from "./types";
import {stones_on_bar, update_player_status} from "./logic_&_checks"

/**
 * Checks if a move is valid according to the rules
 * @param state 
 * @param from 
 * @param die 
 * @returns 
 */
export function is_valid_move(state: GameState, from: number, die: number): boolean {
    const dest = state.current_player === "white"
                      ? from + die
                      : from - die;

    if(!(from >= 0 && from < 24)) {
        return false;
    }

    if((dest < 0 || dest > 23)) {
        return false;
    }

    if(state.board.points[from].player !== state.current_player) {
        return false;
    }

    if (state.current_player === "black" && 
        state.board.points[dest].player === "white" &&
        state.board.points[dest].count > 1) {
        console.log("Invalid move");
            return false; 
                      
    } else if (state.current_player === "white" && 
        state.board.points[dest].player === "black" &&
        state.board.points[dest].count > 1) {
            console.log("Invalid move");
                    return false;             
    }

    return true;
};

/**
 * Moves a stone from a point according to the die roll.
 * @param state 
 * @param from 
 * @param die 
 */
export function apply_move(state: GameState, from: number, die: number): GameState {
    const dest = state.current_player === "white"
                      ? from + die
                      : from - die;

    if (stones_on_bar(state.board, state.current_player)) {
        apply_move_bar(state, die);
    }

    if (is_valid_move(state, from, die)) {
        const point = state.board.points;
        point[from].count--;
        point[dest].count++;
        update_player_status(state, from, dest);
        return state;
    
    }
    return state;
};

export function apply_move_bar(state: GameState, die: number): GameState {
    const dest = state.current_player === "white"
                ? die - 1
                : 23 - die + 1 ;

    const bar = state.current_player === "white"
                ? 0
                : 23;

    if (is_valid_move(state, bar, die)) {
        state.board.points[dest];
        update_player_status(state, bar, dest);
    }
    return state;
}

