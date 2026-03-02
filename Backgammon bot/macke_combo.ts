import {GameState, BotAction} from "../game_logic/types";
import {stones_on_bar} from "../game_logic/logic_&_checks";
import {is_valid_move_bar, is_valid_move, apply_move} from "../game_logic/moves";
import {clone} from "./clone";
import { evaluation } from "./Evaluation";

//Hjälpfunktioner för att evaluera move-träd som tar tärningsordning i åtanke


//Returnar lagliga move för en tärning
export function legal_moves_one_die(state: GameState, die: number): BotAction[] {
    const legal_actions: BotAction[] = []; 
    const player = state.current_player;
    const on_bar = stones_on_bar(state.board, player);

    if(!state.dice || state.dice.values.length === 0) {
        return legal_actions;
    }

    if (on_bar) {
        const dest = player === "white" 
                            ? die - 1 
                            : 24 - die;
        if (is_valid_move_bar(state, dest)) {
            legal_actions.push({from: -1, die});
        }
    } else {
        for (let from = 0; from < 24; from++) {
            if (is_valid_move(state, from, die)) {
                legal_actions.push({from, die});
            }
        }
    }
    return legal_actions;
}

//Simulerar alla move-sekvenser för en specifik tärningsorder
//returnerar en array av {sequence: BotAction[], final_state: Gamestate}. 
export function sim_seq_order(state: GameState, dice_order: number[]) {
    const results: {sequence: BotAction[]; final_state: GameState}[] = [];

    function helper(currentState: GameState, index: number, seq: BotAction[]){
        if (index >= dice_order.length) {
            results.push({sequence: seq.slice(), final_state: currentState});
            return;
        }

        const die = dice_order[index];
        const moves = legal_moves_one_die(currentState, die);
        
        //Om inga legal moves för denna tärning, skippa den och gå vidare till nästa
        if (moves.length === 0) {
        helper(currentState, index + 1, seq);
        }

        for (const m of moves) {
            const cloned = clone(currentState);
            const new_state = apply_move(cloned, m.from, m.die);
            helper(new_state, index + 1, seq.concat(m));
        }
    }

    helper(clone(state), 0, []);
    return results;
}

export function choose_best_move_by_order(state: GameState): BotAction[] | null {
    if (!state.dice || !state.dice.values || state.dice.values.length === 0) {
        return null;
    }

    const dice = state.dice.values.slice();
    
    //Om bara 1 tärning(eller fler än 2), gå tillbaka till att hantera single-tärning
    if (dice.length === 1 || dice.length > 2) {
        const seq = sim_seq_order(state, dice);
        if (seq.length === 0) {
            return null;
        }
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
    }

    // Om 2 tärningar, gå igenom alla sekvenser med dice1->dice2 och dice2->dice1
    const order_a = [dice[0], dice[1]];
    const order_b = [dice[1], dice[0]];

    const seq_a = sim_seq_order(state, order_a);
    const seq_b = sim_seq_order(state, order_b);
    const all_seq = seq_a.concat(seq_b);

     if (all_seq.length === 0) {
        return null;
    }

    let best = all_seq[0];
    let best_score = evaluation(best.final_state);
    for (let i = 1; i < all_seq.length; i++) {
        const score = evaluation(all_seq[i].final_state);
        if (score > best_score) {
            best_score = score;
            best = all_seq[i];
        }
    }
    return best.sequence.length > 0 ? best.sequence : null;
}
