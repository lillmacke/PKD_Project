import {GameState} from "./types";

import {stones_on_bar, all_stones_home, can_bear_off} from "./logic_&_checks";


/**
 * Checks if a move is valid according to the rules
 * 
 * The function verifies:
 * - Player has no stones on bar
 * - Starting point is within board bounds
 * - Starting point contatins at least one stone belonging to the current player
 * - Destination point is legal
 * - Bearing off is only allowed if all stones are in the home board.
 * 
 * @example
 * is_valid_move(state, 12, 3)
 * // Returns true if the current player can move from point 12 using die 3.
 * 
 * @param state The current game state
 * @param from The board index from which the stone is moved
 * @param die The die value to use for the move
 * 
 * @precondition 
 * State must be a valid GameState object
 * Die must be a valid dice value
 * state.current_player must be correctly set
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns 
 * true if the move is legal
 * false otherwise
 */
export function is_valid_move(state: GameState, 
                              from: number, die: number): boolean {
    const player = state.current_player;
    const point = state.board.points;
    const dest = state.current_player === "white"
                 ? from + die
                 : from - die;

    if (stones_on_bar(state.board, player)) {
        return false;
    } else {}

    if (!(from >= 0 && from < 24)) {
        return false;
    } else {}

    if (point[from].player !== player || point[from].count <= 0) {
        return false;
    } else {}

    const off_board = (player === "white" && dest > 23) ||
                      (player === "black" && dest < 0);

    if (off_board) {
        if (!all_stones_home(state)) {
            return false;
        } else {}
        return can_bear_off(state, from, die);
    } else {}

    if ((dest < 0 || dest > 23)) {
        return false;
    } else {}

    if (player === "black" && 
        point[dest].player === "white" && point[dest].count > 1) {
        return false;                  
    } else if (player === "white" && 
        point[dest].player === "black" && point[dest].count > 1) {
        return false;             
    }
    return true;
}

/**
 * Checks whether entering a stone from bar is a valid move
 * 
 * A player must enter from the bar before making any other move (if player has a stone on the bar).
 * This function verifies:
 * - Destination point is within board bounds (0-23)
 * - The destination point is not blocked by two or more opponent stones.
 * 
 * @example
 *  * is_valid_move_bar(state, 22)
 * // Returns true if the current player can enter from the bar to point 22.
 * 
 * @param state The current game state
 * @param dest The board index where the stone would enter
 * 
 * @precondition
 * state must be a valid GameState object.
 * state.current_player must have at least one stone on the bar.
 * dest must be calculated correctly based on die value.
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns 
 * true if the bar entry move is legal
 * false otherwise
 */

export function is_valid_move_bar(state: GameState, dest: number): boolean {
    const points = state.board.points;
    const player = state.current_player;

    if ((dest < 0 || dest > 23)) {
        return false;
    } else {}

    if (player === "black" && 
        points[dest].player === "white" && points[dest].count > 1) {
        return false; 
                      
    } else if (player === "white" && 
        points[dest].player === "black" && points[dest].count > 1) {
        return false;             
    }
    return true;
}
