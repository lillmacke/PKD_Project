import {GameState} from "./types";
import {
    find_single, stones_on_bar, to_hit, update_player_status, 
    borne_off
} from "./logic_&_checks"

import {is_valid_move, is_valid_move_bar} from "./valid_move";

/**
 * Executes a legal board move according to Backgammon rules.
 *
 * The function:
 * - Checks if the player must enter from the bar first.
 * - Validates the move using is_valid_move().
 * - Handles bearing off if the move goes off the board.
 * - Handles hitting an opponent blot (single stone).
 * - Updates the board state accordingly.
 *
 * @example 
 * apply_move(state, 12, 3)
 * Moves a stone from point 12 using die value 3 if legal.
 * 
 * @param state The current GameState
 * @param from The board index from which the stone is moved.
 * @param die The die value used for the move.
 * 
 * @precondition 
 * - state must be a valid GameState.
 * - state.current_player must be correctly set.
 * - If the player has stones on the bar, bar entry must be handled first.
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns
 * The updated game state after the move is applied.
 * If the move is invalid, the original state is returned unchanged.
 */
export function apply_move(state: GameState, from: number, 
                           die: number): GameState {
    const player = state.current_player;
    const dest = player === "white"
                 ? from + die
                 : from - die;

    if (stones_on_bar(state.board, player)) {
        return apply_move_bar(state, die);
    } else {}

    if (!is_valid_move(state, from, die)) {
        return state; 
    } else {}

    const off_board = (player === "white" && dest > 23) || 
                      (player === "black" && dest < 0);
    if (off_board) {
            return borne_off(state, from);
    } else {}

    if (find_single(state, (dest))) {
        to_hit(state, dest);
    } else {}

    const point = state.board.points;

    point[from].count--;
    point[dest].count++;

    update_player_status(state, from);
    update_player_status(state, dest);
    
    return state;
}

/**
 * Executes a move from the bar into the board according to Backgammon rules.
 *
 * The function:
 * - Calculates the destination point based on the die value.
 * - Verifies that the current player has stones on the bar.
 * - Validates the bar entry move using is_valid_move_bar().
 * - Handles hitting an opponent blot.
 * - Updates the board and bar counters.
 * 
 * @example
 * apply_move_bar(state, 4)
 * // Enters a stone from the bar using die value 4.
 * 
 * @param state Current GameState
 * @param die Die value used to enter from the bar
 * 
 * @precondition 
 * - state must be a valid GameState.
 * - state.current_player must have at least one stone on the bar.
 * - The destination must be calculated according to Backgammon rules.
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns 
 * The updated game state after the bar move is applied.
 * If the move is invalid or no stones are on the bar,
 * the original state is returned unchanged.
 */
export function apply_move_bar(state: GameState, die: number): GameState {
    const dest = state.current_player === "white"
                 ? die - 1
                 : 24 - die;

    if(state.board.bar[state.current_player] <= 0) {
        return state;
    } else {}

    if (!is_valid_move_bar(state, dest)) {
        return state;
    } else {}

    if (find_single(state, (dest))) {
        to_hit(state, dest);
    } else {}

    state.board.bar[state.current_player]--;
    state.board.points[dest].count++;

    update_player_status(state, dest);

    return state;
}
