import {Dice, GameState, Board, Player} from "./types";


/**
 * Checks if a move is valid according to the rules
 * @param state 
 * @param from 
 * @param die 
 * @returns 
 */
function is_valid_move(state: GameState, from: number, die: number): boolean {
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
 * Checks if a player has stones on the bar. 
 * @param board 
 * @returns 
 */
function stones_on_bar(board: Board): boolean {
    if (board.bar.black > 0) {
        return true;
    }
    if (board.bar.white > 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * Moves a stone from a point according to the die roll.
 * @param state 
 * @param from 
 * @param die 
 */
function apply_move(state: GameState, from: number, die: number): GameState {
    if (stones_on_bar(state.board)) {
        apply_move_bar;
    }
    if (is_valid_move(state, from, die)) {
        return state;
    }
    return state;
};

function apply_move_bar(state: GameState): GameState {

};
