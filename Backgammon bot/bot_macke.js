"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_legal_moves = get_all_legal_moves;
exports.All_next_states = All_next_states;
exports.bot_move = bot_move;
exports.random_bot_move = random_bot_move;
const logic___checks_1 = require("../game_logic/logic_&_checks");
const moves_1 = require("../game_logic/moves");
const Evaluation_1 = require("../Backgammon bot/Evaluation");
function get_all_legal_moves(state) {
    const legal_actions = [];
    if (!state.dice || state.dice.values.length === 0) {
        return legal_actions;
    }
    const player = state.current_player;
    const on_bar = (0, logic___checks_1.stones_on_bar)(state.board, player);
    for (const die of state.dice.values) {
        if (on_bar) {
            const dest = player === "white" ? die - 1 : 24 - die;
            if ((0, moves_1.is_valid_move_bar)(state, dest)) {
                legal_actions.push({ from: -1, die });
            }
        }
        else {
            for (let from = 0; from < 24; from++) {
                if ((0, moves_1.is_valid_move)(state, from, die)) {
                    legal_actions.push({ from, die });
                }
            }
        }
    }
    return legal_actions;
}
function clone(state) {
    return JSON.parse(JSON.stringify(state));
}
function Next_state(move, state) {
    const cloned_state = clone(state);
    return (0, moves_1.apply_move)(cloned_state, move.from, move.die);
}
// generar en array med gamestates för alla moves från get_all_legal_moves. Tänker att vi kan skicka alla dessa states genom evaluate och ta ut det botAction med högst tal. 
function All_next_states(state) {
    const moves = get_all_legal_moves(state);
    const all_states = [];
    for (let i = 0; i < moves.length; i++) {
        all_states.push(Next_state(moves[i], state));
    }
    return all_states;
}
function bot_move(All_next_states, state) {
    const a = All_next_states;
    const b = get_all_legal_moves(state);
    let best_move = b[0];
    let best_state = a[0];
    for (let i = 1; i < a.length; i++) {
        if ((0, Evaluation_1.evaluation)(best_state) < (0, Evaluation_1.evaluation)(a[i])) {
            best_state = a[i];
            best_move = b[i];
        }
    }
    return best_move;
}
function random_bot_move(state) {
    const legal_actions = get_all_legal_moves(state);
    if (legal_actions.length === 0) {
        return null;
    }
    const random_index = Math.floor(Math.random() * legal_actions.length);
    return legal_actions[random_index];
}
