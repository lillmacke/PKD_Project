import {GameState} from "./types";
import {
    find_single, stones_on_bar, to_hit, update_player_status, 
    is_valid_move, is_valid_move_bar, borne_off
} from "./logic_&_checks"

/**
 * MÅSTE SKRIVAS KLART 
 * Moves a stone from a point according to the die roll.
 * @example 
 * @param state 
 * @param from 
 * @param die 
 * @precondition 
 * @complexity
 * @returns
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
