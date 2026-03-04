import { starting_board } from "../game_logic/Starting_board";
import {GameState} from "../game_logic/types";
import {dice_roll} from "../game_logic/Dice";
import {
    stones_on_bar, switch_player, game_over, check_move
} from "../game_logic/logic_&_checks"
import {
    is_valid_move, is_valid_move_bar, has_any_valid_moves
} from "../game_logic/valid_move";
import {apply_move, apply_move_bar} from "../game_logic/moves";
import {choose_best_move_by_order} from "./combo_sequence";
import {render_board} from "../game_logic/UI";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });
const new_state = starting_board();
console.log("Welcome to Backgammon!");
const answer = prompt("Do you want to start a new game?: ");
const real_answer = answer.toLowerCase();
if (real_answer === "yes") {  
    console.log("Starting new game...")
    play_game(new_state);
} else {
    console.log("Goodbye!");
}

function play_game(state: GameState): void {
    const bot_player = "black";

    function make_move(state: GameState): void {
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
                }

                let from = -1;
                    if (!onBar) {
                        const input_point = prompt("From what point do you make a move?: ");
                        from = Number(input_point) - 1;
                } else {
                    console.log("You have stones on the bar.");
                }

                if (!check_move(state, from, die)) {
                    console.log("Try again.");
                }
        }
    }


    while (game_over(state) === null) {

        if (state.dice === null) {
            console.log("\nRolling dice...");
            state.dice = dice_roll();
        }

        make_move(state);
    }

    const winner = game_over(state);
    console.log(`${winner} wins!`);
}





