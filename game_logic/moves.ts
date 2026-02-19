import {Dice, GameState, Board, Player} from "./types";
import {stones_on_bar} from "./logic_&_checks"

/**
 * Checks if a move is valid according to the rules
 * @param state 
 * @param from 
 * @param die 
 * @returns 
 */
export function is_valid_move(state: GameState, from: number, die: number): boolean {
    const destination = state.current_player === "white"
                      ? from + die
                      : from - die;

    if(!(from >= 0 && from < 24)) {
        return false;
    }

    if((destination < 0 || destination > 23)) {
        return false;
    }

    if(state.board.points[from].player !== state.current_player) {
        return false;
    }

    if (state.current_player === "black" && 
        state.board.points[destination].player === "white" &&
        state.board.points[destination].count > 1) {
        console.log("Invalid move");
            return false; 
                      
    } else if (state.current_player === "white" && 
        state.board.points[destination].player === "black" &&
        state.board.points[destination].count > 1) {
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
        apply_move_bar;
    if (stones_on_bar(state.board, state.current_player)) {
        apply_move_bar(state);
    }

    if (is_valid_move(state, from, die)) {
        const point = state.board.points;
        point[from].count--;
        point[dest].count++;
        return state;
    
    }
    return state;
};

function update_player_status(state: GameState, from: number, destination : number): GameState {
    const point = state.board.points;

    if (point[from].count === 0) {
        point[from].player = null;
    }
    if (point[destination].count > 0) {        
        point[destination].player = state.current_player;
    }

    return state;

}

function update_player_status(state: GameState, from: number, destination : number): GameState {
    const point = state.board.points;

    if (point[from].count === 0) {
        point[from].player = null;
    }
    if (point[destination].count > 0) {        
        point[destination].player = state.current_player;
    }

    return state;

}

export function apply_move_bar(state: GameState, die: number): GameState {
    const dest = state.current_player === "white"
                ? 5 + die
                : 18 - die ;

    const bar = state.current_player === "white"
                ? 5
                : 18;

    if (is_valid_move(state, bar, die)) {
        state.board.points[dest];
    }
    return state;
};
