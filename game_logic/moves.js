"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_valid_move = is_valid_move;
exports.apply_move = apply_move;
exports.is_valid_move_bar = is_valid_move_bar;
exports.apply_move_bar = apply_move_bar;
const logic___checks_1 = require("./logic_&_checks");
/**
 * Checks if a move is valid according to the rules
 * @param state
 * @param from
 * @param die
 * @returns
 */
function is_valid_move(state, from, die) {
    const player = state.current_player;
    const point = state.board.points;
    const dest = state.current_player === "white"
        ? from + die
        : from - die;
    if ((0, logic___checks_1.stones_on_bar)(state.board, player)) {
        return false;
    }
    if (!(from >= 0 && from < 24)) {
        return false;
    }
    if (point[from].player !== player || point[from].count <= 0) {
        return false;
    }
    const off_board = (player === "white" && dest > 23) ||
        (player === "black" && dest < 0);
    if (off_board) {
        if (!(0, logic___checks_1.all_stones_home)(state)) {
            return false;
        }
        return (0, logic___checks_1.can_bear_off)(state, from, die);
    }
    if ((dest < 0 || dest > 23)) {
        return false;
    }
    if (player === "black" &&
        point[dest].player === "white" &&
        point[dest].count > 1) {
        console.log("Invalid move");
        return false;
    }
    else if (player === "white" &&
        point[dest].player === "black" &&
        point[dest].count > 1) {
        console.log("Invalid move");
        return false;
    }
    return true;
}
;
/**
 * Moves a stone from a point according to the die roll.
 * @param state
 * @param from
 * @param die
 */
function apply_move(state, from, die) {
    const player = state.current_player;
    const dest = player === "white"
        ? from + die
        : from - die;
    if ((0, logic___checks_1.stones_on_bar)(state.board, player)) {
        return apply_move_bar(state, die);
    }
    if (!is_valid_move(state, from, die)) {
        return state;
    }
    const off_board = (player === "white" && dest > 23) ||
        (player === "black" && dest < 0);
    if (off_board) {
        return (0, logic___checks_1.borne_off)(state, from);
    }
    if ((0, logic___checks_1.find_single)(state, (dest))) {
        (0, logic___checks_1.to_hit)(state, dest);
    }
    const point = state.board.points;
    point[from].count--;
    point[dest].count++;
    (0, logic___checks_1.update_player_status)(state, from);
    (0, logic___checks_1.update_player_status)(state, dest);
    return state;
}
;
function is_valid_move_bar(state, dest) {
    if ((dest < 0 || dest > 23)) {
        return false;
    }
    if (state.current_player === "black" &&
        state.board.points[dest].player === "white" &&
        state.board.points[dest].count > 1) {
        console.log("Invalid move");
        return false;
    }
    else if (state.current_player === "white" &&
        state.board.points[dest].player === "black" &&
        state.board.points[dest].count > 1) {
        console.log("Invalid move");
        return false;
    }
    return true;
}
;
function apply_move_bar(state, die) {
    const dest = state.current_player === "white"
        ? die - 1
        : 24 - die;
    if (state.board.bar[state.current_player] <= 0) {
        return state;
    }
    if (!is_valid_move_bar(state, dest)) {
        return state;
    }
    if ((0, logic___checks_1.find_single)(state, (dest))) {
        (0, logic___checks_1.to_hit)(state, dest);
    }
    state.board.bar[state.current_player]--;
    state.board.points[dest].count++;
    (0, logic___checks_1.update_player_status)(state, dest);
    return state;
}
