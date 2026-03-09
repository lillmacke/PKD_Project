import { GameState } from "./types";
import {
    find_single, stones_on_bar, to_hit, update_player_status, 
    borne_off, check_move, switch_player
} from "./logic_&_checks"
import {
    is_valid_move, is_valid_move_bar, has_any_valid_moves
} from "./valid_move";
import { render_board } from "./UI";
import { choose_best_move_by_order } from "../Backgammon bot/combo_sequence";
import promptSync from "prompt-sync";

const prompt = promptSync({sigint: true});

/**
 * Executes a legal board move according to Backgammon rules.
 *
 * The function:
 * - Checks if the player must enter from the bar first.
 * - Validates the move using is_valid_move().
 * - Handles bearing off if the move goes off the board.
 * - Handles hitting an opponent blot (single stone).
 * - Updates the board state accordingly.
 *
 * @example 
 * apply_move(state, 12, 3)
 * Moves a stone from point 12 using die value 3 if legal.
 * 
 * @param state The current GameState
 * @param from The board index from which the stone is moved.
 * @param die The die value used for the move.
 * 
 * @precondition 
 * - state must be a valid GameState.
 * - state.current_player must be correctly set.
 * - If the player has stones on the bar, bar entry must be handled first.
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns
 * The updated game state after the move is applied.
 * If the move is invalid, the original state is returned unchanged.
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

/**
 * Executes a move from the bar into the board according to Backgammon rules.
 *
 * The function:
 * - Calculates the destination point based on the die value.
 * - Verifies that the current player has stones on the bar.
 * - Validates the bar entry move using is_valid_move_bar().
 * - Handles hitting an opponent blot.
 * - Updates the board and bar counters.
 * 
 * @example
 * apply_move_bar(state, 4)
 * // Enters a stone from the bar using die value 4.
 * 
 * @param state Current GameState
 * @param die Die value used to enter from the bar
 * 
 * @precondition 
 * - state must be a valid GameState.
 * - state.current_player must have at least one stone on the bar.
 * - The destination must be calculated according to Backgammon rules.
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns 
 * The updated game state after the bar move is applied.
 * If the move is invalid or no stones are on the bar,
 * the original state is returned unchanged.
 */
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

/**
 * Executes an entire turn for the current player until all remaining dice
 * have been used or no legal moves exist.
 *
 * The function supports both human input and a bot player.
 * During the turn it repeatedly:
 * - Prints the board and remaining dice.
 * - Checks if the current player has any legal moves; 
 *      if none, the player passes.
 * - If the current player is the bot, 
 *      it chooses a best move sequence and applies it.
 * - If the current player is human, 
 *      it asks for die choice and move origin and applies it.
 *
 * The function consumes dice via check_move(), 
 * and when the dice list becomes empty,the turn ends 
 * (check_move() is responsible for switching player and resetting dice).
 *
 * @example
 * make_move(state)
 * // Runs a full turn for the current player using current dice values.
 *
 * @param state The current game state (mutated in place).
 *
 * @precondition
 * - state must be a valid GameState.
 * - state.dice must not be null when entering the while-loop.
 * - check_move() must correctly validate/apply moves and remove used dice.
 * - choose_best_move_by_order() must return legal 
 *      BotAction sequences for the bot.
 * 
 * @complexity
 * Time: Depends on number of dice (≤ 4) and user/bot logic.
 * - Human branch: bounded by user attempts; 
 *      each validation is O(24) worst-case.
 * - Bot branch: dominated by move-sequence simulation 
 *      in choose_best_move_by_order().
 * Space: O(1) for the game loop itself 
 *      (bot simulation may allocate additional memory).
 *
 * @returns
 * This function does not return a value (void).
 * It updates the GameState directly 
 *      (moves pieces, consumes dice, and may switch player).
 */
export function make_move(state: GameState): void {
    const bot_player = "black";
    while (state.dice && state.dice.values.length > 0) {
        console.log(render_board(state));
        console.log("\nCurrent player:", state.current_player);
        console.log("Remaining dice:", state.dice.values.join(", "));
          
        if (!has_any_valid_moves(state)) {
            console.log("No legal moves. Passing turn.\n");
            switch_player(state);
            state.dice = null;
            return;
        } else {}

        if (state.current_player === bot_player) {
             const seq = choose_best_move_by_order(state);
            if (seq === null || seq.length === 0) {
                console.log("Bot can't make a move");
                switch_player(state);
                state.dice = null;
                return;
            } else {}

            for (const moves of seq) {
                const move_display = moves.from + 1;
                console.log(`Bot plays die ${moves.die} from ${move_display}`);
                if(!check_move(state, moves.from, moves.die)) {
                    console.log("Bot can't make a move");
                    switch_player(state);
                    state.dice = null;
                    return;
                } else {}
                if (state.current_player !== bot_player) {
                    return;
                } else {}
            }
            continue;
        }
        const onBar = stones_on_bar(state.board, state.current_player);
        const dieInput = prompt("Choose die to use: ");
        const die = Number(dieInput);

        if (!state.dice.values.includes(die)) {
            console.log("You don't have that die.");
            continue;
        } else {}

        let from = -1;
            if (!onBar) {
                const input_point = 
                        prompt("From what point do you make a move?: ");
                from = Number(input_point) - 1;
        } else {
             console.log("You have stones on the bar.");
        }

        if (!check_move(state, from, die)) {
            console.log("Try again.");
        }
    }
}
