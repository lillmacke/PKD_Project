//import {stones_on_bar} from "../game_logic/logic_&_checks";
//import {apply_move} from "../game_logic/moves";
//import { BotAction, GameState } from "../game_logic/types";
//import {evaluation} from "./Evaluation";
//import { clone } from "./clone";
//import {is_valid_move, is_valid_move_bar} from "../game_logic/valid_move";
//
//
//export function get_all_legal_moves(state: GameState): Array<BotAction> {
//    const legal_actions: Array<BotAction> = [];
//    const dice = state.dice;
//    const player = state.current_player;
//    const on_bar = stones_on_bar(state.board, player);
//
//    if (!dice || dice.values.length === 0) {
//        return legal_actions;
//    } else {}
//        for (const die of dice.values) {
//        if (on_bar) {
//            const dest = player === "white" ? die - 1 : 24 - die;
//            if (is_valid_move_bar(state, dest)) {
//                legal_actions.push({from: -1, die});
//            } else {}
//        } else {
//            for (let from = 0; from < 24; from++) {
//                if (is_valid_move(state, from, die)) {
//                    legal_actions.push({from, die});
//                } else {}
//            }
//        }
//    }
//    return legal_actions;
//}
//
//export function next_state(move: BotAction, state : GameState): GameState{
//    const cloned_state = clone(state);
//    return apply_move(cloned_state, move.from, move.die)
//}
//// generar en array med gamestates för alla moves från get_all_legal_moves. 
//// Tänker att vi kan skicka alla dessa states genom evaluate och ta ut det botAction med högst tal. 
//
//export function All_next_states(state : GameState): GameState[]{
//    const moves = get_all_legal_moves(state); 
//    const all_states : GameState[] = []; 
//    for (let i = 0; i < moves.length; i++) {
//        all_states.push(next_state(moves[i], state))
//    }
//    return all_states;
//}
//
//
//export function bot_move(state: GameState): BotAction | null {
//    const moves = get_all_legal_moves(state);
//    
//    if (moves.length === 0) {
//        return null;
//    }
//
//    let best_move = moves[0];
//    let best_score = evaluation(next_state(best_move, state));
//
//    for (let i = 1; i < moves.length; i++) {
//        const nex_state = next_state(moves[i], state);
//        const score = evaluation(nex_state);
//
//        if (score > best_score) {
//            best_score = score;
//            best_move = moves[i];
//        }
//    }
//
//    return best_move;
//}
//
//export function random_bot_move(state: GameState): BotAction | null {
//    const legal_actions = get_all_legal_moves(state);
//
//    if (legal_actions.length === 0) {
//        return null;
//    }
//
//    const random_index = Math.floor(Math.random() * legal_actions.length);
//    return legal_actions[random_index];
//}
//
//