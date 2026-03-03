import {GameState, BotAction} from "../game_logic/types";
import {
    stones_on_bar
} from "../game_logic/logic_&_checks";

import { is_valid_move, is_valid_move_bar } from "../game_logic/valid_move";
import {apply_move} from "../game_logic/moves";
import {clone} from "./clone";
import { evaluation } from "./Evaluation";

//Hjälpfunktioner för att evaluera move-träd som tar tärningsordning i åtanke

//Returnar lagliga move för en tärning
export function legal_moves_one_die(state: GameState, 
                                    die: number): Array<BotAction> {
    const legal_actions: Array<BotAction> = []; 
    const player = state.current_player;
    const on_bar = stones_on_bar(state.board, player);
    const dice = state.dice;

    if (!dice || dice.values.length === 0) {
        return legal_actions;
    } else {}

    if (on_bar) {
        const dest = player === "white" ? die - 1 : 24 - die;
        if (is_valid_move_bar(state, dest)) {
            legal_actions.push({from: -1, die});
        } else {}
    } else {
        for (let from = 0; from < 24; from++) {
            if (is_valid_move(state, from, die)) {
                legal_actions.push({from, die});
            } else {}
        }
    }
    return legal_actions;
}

//Simulerar alla move-sekvenser för en specifik tärningsorder
//returnerar en array av {sequence: BotAction[], final_state: Gamestate}. 
/**
 * 
 * @example 
 * @param state 
 * @param dice_order 
 * @precondition
 * @complexity
 * @returns 
 */
export function sim_seq_order(state: GameState, dice_order: Array<number>) {
    const results: Array<{sequence: Array<BotAction>; 
                          final_state: GameState}> = [];

    // Recursive helper that computes new states of every legal move in sequences
    function legal_state(currentState: GameState, index: number, 
                    seq: Array<BotAction>) {
        if (index >= dice_order.length) {
            results.push({sequence: seq.slice(), final_state: currentState});
            return;
        } else {}

        const die = dice_order[index];
        const moves = legal_moves_one_die(currentState, die);
        
        //Om inga legal moves för denna tärning, 
        // skippa den och gå vidare till nästa
        if (moves.length === 0) {
        legal_state(currentState, index + 1, seq);
        } else {}

        for (const m of moves) {
            const cloned = clone(currentState);
            const new_state = apply_move(cloned, m.from, m.die);
            legal_state(new_state, index + 1, seq.concat(m));
        }
    }
    legal_state(clone(state), 0, []);
    return results;
}

export function choose_best_move_by_order(
            state: GameState): Array<BotAction> | null {
    const die = state.dice;

    if (!die || !die.values || die.values.length === 0) {
        return null;
    } else {}

    const dice = die.values.slice();

    //Om bara 1 tärning(eller fler än 2), gå tillbaka till att hantera single-tärning
    if (dice.length === 1 || dice.length > 2) {
        const seq = sim_seq_order(state, dice);
        if (seq.length === 0) {
            return null;
        } else {}
        let best = seq[0];
        let best_score = evaluation(best.final_state);
        for (let i = 1; i < seq.length; i++) {
            const score = evaluation(seq[i].final_state);
            if (score > best_score) {
                best_score = score;
                best = seq[i];
            }
        }
        // return the entire sequence, not only the first action
        return best.sequence.length > 0 ? best.sequence : null;
    } else {}

    // Om 2 tärningar, gå igenom alla sekvenser med dice1->dice2 och dice2->dice1
    const order_a = [dice[0], dice[1]];
    const order_b = [dice[1], dice[0]];

    const seq_a = sim_seq_order(state, order_a);
    const seq_b = sim_seq_order(state, order_b);
    const all_seq = seq_a.concat(seq_b);

     if (all_seq.length === 0) {
        return null;
    } else {}

    let best = all_seq[0];
    let best_score = evaluation(best.final_state);
    for (let i = 1; i < all_seq.length; i++) {
        const score = evaluation(all_seq[i].final_state);
        if (score > best_score) {
            best_score = score;
            best = all_seq[i];
        } else {}
    }
    return best.sequence.length > 0 ? best.sequence : null;
}
