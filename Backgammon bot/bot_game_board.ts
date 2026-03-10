import { starting_board } from "../game_logic/Starting_board";
import { GameState } from "../game_logic/types";
import { dice_roll } from "../game_logic/Dice";
import { game_over } from "../game_logic/logic_&_checks"
import { make_move } from "../game_logic/moves";
import promptSync from "prompt-sync";

const prompt = promptSync({sigint: true});
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

/**
 * Runs the main game loop for the game.
 * 
 * The function keeps running until one of the players wins.
 * When the current player is done with their moves, the dice 
 * are rolled for the next player.
 *
 * @example
 * play_game(starting_board())
 * // Starts a full game of backgammon.
 * @param state - The current GameState.
 * @precondition - State must be a valid game state.
 * @complexity
 * - Time: O(T), where T is the number of turns played until the game ends.
 */
export function play_game(state: GameState): void {
    while (game_over(state) === null) {
        if (state.dice === null) {
            console.log("\nRolling dice...");
            state.dice = dice_roll();
        } else {}
        make_move(state);
    }
    const winner = game_over(state);
    console.log(`${winner} wins!`);
}