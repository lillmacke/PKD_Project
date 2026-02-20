import {Dice, GameState, Board, Player} from "./types";
import {find_single, stones_on_bar, to_hit, update_player_status} from "./logic_&_checks"

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
        return apply_move_bar(state, die);
    }

    if (!is_valid_move(state, from, die)) {
        return state; 
    }

    if (find_single(state, (dest))) {
        to_hit(state, from);
        to_hit(state, dest);
    }
    const point = state.board.points;
    point[from].count--;
    point[dest].count++;
    update_player_status(state, from);
    update_player_status(state, dest);
    
    return state;
};


export function is_valid_move_bar(state: GameState, dest: number): boolean {

    if((dest < 0 || dest > 23)) {
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

export function apply_move_bar(state: GameState, die: number): GameState {
    const dest = state.current_player === "white"
                ? die - 1
                : 24 - die ;
    if(state.board.bar[state.current_player] <= 0) {
        return state;
    }
    if (!is_valid_move_bar(state, dest)) {
        return state;
    }
    if (find_single(state, (dest))) {
        to_hit(state, dest);
    }

    state.board.bar[state.current_player]--;
    state.board.points[dest].count++;
    update_player_status(state, dest);

    return state;
}
