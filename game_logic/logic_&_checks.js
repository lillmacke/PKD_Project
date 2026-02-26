"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stones_on_bar = stones_on_bar;
exports.find_single = find_single;
exports.to_hit = to_hit;
exports.update_player_status = update_player_status;
exports.all_stones_home = all_stones_home;
exports.borne_off = borne_off;
exports.higher_stone_in_home = higher_stone_in_home;
exports.can_bear_off = can_bear_off;
exports.switch_player = switch_player;
exports.game_over = game_over;
/**
 * Checks if a player has stones on the bar.
 * @param board
 * @param player
 * @returns
 */
function stones_on_bar(board, player) {
    return board.bar[player] > 0;
}
;
// Ska hitta punkter som endast har en sten, och kolla om den tillhör motståndaren
function find_single(state, index) {
    const point = state.board.points[index];
    if (point.count === 1 && point.player !== null &&
        point.player !== state.current_player) {
        return true;
    }
    return false;
}
;
// "äter upp" en ensam sten om man landar på den, och skickar den till baren
// Invarianten blir väl att "dest"-punkten måste ha en ensam motståndar-sten, så denna
// funktion kallas bara om detta är uppfyllt (se apply_move).
function to_hit(state, index) {
    const point = state.board.points[index];
    point.count--;
    if (point.count === 0) {
        point.player = null;
    }
    if (state.current_player === "white") {
        state.board.bar.black++;
    }
    else {
        state.board.bar.white++;
    }
    return state;
}
;
function update_player_status(state, index) {
    const point = state.board.points;
    if (point[index].count === 0) {
        point[index].player = null;
    }
    if (point[index].count > 0) {
        point[index].player = state.current_player;
    }
    return state;
}
//BORNE OFF
// ska kolla om en spelare har alla sina stenar hemma
// Om man tex slår en 4 men har stenar på 5 eller 6, måste man flytta dessa först,
// innan man tar hem de på 1-3
/**
 * Checks if a all of a players stone is home
 * @param state
 * @returns
 */
function all_stones_home(state) {
    const point = state.board.points;
    if (state.board.bar[state.current_player] > 0) {
        return false;
    }
    if (state.current_player === "white") {
        for (let i = 0; i < 18; i++) {
            if (point[i].player === "white" && point[i].count > 0) {
                return false;
            }
        }
    }
    else {
        for (let i = 6; i < 24; i++) {
            if (point[i].player === "black" && point[i].count > 0) {
                return false;
            }
        }
    }
    return true;
}
;
function borne_off(state, from) {
    const board = state.board;
    board.points[from].count--;
    if (board.points[from].count === 0) {
        board.points[from].player = null;
    }
    board.borne_off[state.current_player]++;
    return state;
}
function higher_stone_in_home(state, from) {
    if (state.current_player === "white") {
        for (let i = 18; i < from; i++) {
            if (state.board.points[i].player === "white"
                && state.board.points[i].count > 0)
                return true;
        }
    }
    else {
        for (let i = from + 1; i <= 5; i++) {
            if (state.board.points[i].player === "black"
                && state.board.points[i].count > 0)
                return true;
        }
    }
    return false;
}
function can_bear_off(state, from, die) {
    const dist = state.current_player === "white"
        ? 24 - from
        : from + 1;
    if (die === dist) {
        return true;
    }
    if (die < dist) {
        return false;
    }
    return !higher_stone_in_home(state, from);
}
function switch_player(state) {
    if (state.current_player === "white") {
        state.current_player = "black";
    }
    else {
        state.current_player = "white";
    }
}
function game_over(state) {
    if (state.board.borne_off.white === 15) {
        return "white";
    }
    if (state.board.borne_off.black === 15) {
        return "black";
    }
    return null;
}
