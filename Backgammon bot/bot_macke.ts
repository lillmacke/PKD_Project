import { stones_on_bar } from "../game_logic/logic_&_checks";
import { is_valid_move, is_valid_move_bar } from "../game_logic/moves";
import { BotAction, GameState } from "../game_logic/types";


export function get_all_legal_moves(state: GameState): BotAction[] {
    const legal_actions: BotAction[] = [];
    if (!state.dice || state.dice.values.length === 0) {
        return legal_actions;
    }

    const player = state.current_player;
    const on_bar = stones_on_bar(state.board, player);

        for (const die of state.dice.values) {
        if (on_bar) {
            const dest = player === "white" ? die - 1 : 24 - die;
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
    }
    return legal_actions;
}

export function random_bot_move(state: GameState): BotAction | null {
    const legal_actions = get_all_legal_moves(state);

    if (legal_actions.length === 0) {
        return null;
    }

    const random_index = Math.floor(Math.random() * legal_actions.length);
    return legal_actions[random_index];
}

