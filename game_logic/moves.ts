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
