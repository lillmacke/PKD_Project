import { GameState } from "./types";
import { stones_on_bar, all_stones_home, can_bear_off } from "./logic_&_checks";

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
    } else {}
    return true;
}

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
    } else {}
    return true;
}

export function has_any_valid_moves(state: GameState): boolean {
    const player = state.current_player;
    const onBar = stones_on_bar(state.board, player);

    if (!state.dice) {
         return false;
    } else {}

    for (const die of state.dice.values) {
        if (onBar) {
            const dest = player === "white" ? die - 1 : 24 - die;
            if (is_valid_move_bar(state, dest)) {
                return true;
            } else {} 
        } else {
            for (let from = 0; from < 24; from++) {
                if (is_valid_move(state, from, die)) return true;
            }
        }
    }
    return false;
}