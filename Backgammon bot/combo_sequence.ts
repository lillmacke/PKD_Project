import {GameState, BotAction} from "../game_logic/types";
import {
    stones_on_bar
} from "../game_logic/logic_&_checks";

import { is_valid_move, is_valid_move_bar } from "../game_logic/valid_move";
import {apply_move} from "../game_logic/moves";
import {clone} from "./clone";
import { evaluation } from "./Evaluation";

/**
 * Generates all legal moves for the current player using a single die value.
 *
 * The function checks every board point to determine whether a move is
 * valid with the specified die. If the player has stones on the bar,
 * only bar-entry moves are considered.
 *
 * @example
 * legal_moves_one_die(state, 4)
 * // Returns all valid moves that can be performed using die value 4.
 *
 * @param state The current game state.
 * @param die The die value to test moves for.
 *
 * @precondition
 * - state must be a valid GameState.
 * - state.dice must not be null and should contain the current dice values.
 * - die should be one of the remaining dice values.
 *
 * @complexity
 * Time: O(n), where n = 24 board points.
 * Space: O(k), where k is the number of legal moves generated.
 *
 * @returns
 * An array of BotAction objects representing all legal moves
 * the current player can perform using the given die.
 * Each action contains:
 * - from: the starting point (0–23) or -1 if entering from the bar
 * - die: the die value used for the move
 */
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

/**
 * Simulates all legal move sequences for a specific dice order.
 *
 * Given an ordered list of dice values (e.g. [6,3]), the function explores
 * all legal moves for the first die, then all legal moves for the second die,
 * and so on, producing every possible move sequence and its resulting final state.
 *
 * If no legal move exists for a given die at some step, that die is skipped
 * and the search continues with the next die value.
 *
 * @example
 * sim_seq_order(state, [6, 3])
 * // Returns all legal sequences where die 6 is used first, then die 3.
 *
 * sim_seq_order(state, [4, 4, 4, 4])
 * // Returns all legal sequences for a double roll in the given order.
 *
 * @param state The starting game state.
 * @param dice_order An ordered list of die values (length 1–4).
 *
 * @precondition
 * - state must be a valid GameState.
 * - dice_order must contain values in the range 1–6.
 *
 * @complexity
 * Time: Exponential in the number of dice due to branching.
 * Let b be the average number of legal moves for a die (0 ≤ b ≤ 24),
 * and d = dice_order.length (≤ 4). Worst-case complexity is O(b^d).
 * Space: O(b^d) for storing all resulting sequences and states.
 *
 * @returns
 * An array of objects where each object contains:
 * - sequence: the list of BotAction moves performed in order
 * - final_state: the GameState after applying the entire sequence
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

/**
 * Chooses the best move sequence for the current player based on the current dice.
 *
 * The function simulates all legal move sequences and selects the sequence
 * that results in the highest evaluation score.
 *
 * Dice handling:
 * - If there are exactly 2 dice values (non-double roll), the function evaluates
 *   both possible play orders: [die1, die2] and [die2, die1].
 * - If there is 1 die value or more than 2 values (e.g. doubles -> 4 dice),
 *   the function simulates sequences using the dice list as given.
 *
 * @example
 * const seq = choose_best_move_by_order(state);
 * if (seq) {
 *   for (const action of seq) {
 *     check_move(state, action.from, action.die);
 *   }
 * }
 *
 * @param state The current game state. Must contain non-null dice values.
 *
 * * @precondition
 * - state must be a valid GameState.
 * - state.dice must not be null and must contain at least one die value.
 * - sim_seq_order() must correctly generate legal sequences.
 * - evaluation() must return higher values for better positions for the bot.
 *
 * @complexity
 * Time: Dominated by sim_seq_order(). Exponential in dice length due to branching.
 * For two dice, it computes two sequence sets (two orders) and compares them.
 * Space: O(number of generated sequences) to store all sequences and final states.
 *
 * @returns
 * - A BotAction[] representing the best sequence of moves for this turn.
 * - null if no legal sequences exist (i.e. the player must pass).
 */

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
