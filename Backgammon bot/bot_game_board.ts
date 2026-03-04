import {starting_board} from "../game_logic/Starting_board";
import {GameState} from "../game_logic/types";
import {dice_roll} from "../game_logic/Dice";
import {game_over} from "../game_logic/logic_&_checks"
import {make_move} from "../game_logic/moves";
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
/**
 * Runs the main game loop for the backgammon game.
 *
 * The function repeatedly alternates turns between players until the
 * game_over() condition is met. At the beginning of each turn the dice
 * are rolled, after which the current player performs their moves.
 *
 * The loop continues until one player has borne off all 15 stones.
 *
 * @example
 * play_game(starting_board())
 * // Starts a full backgammon game and runs until a winner is determined.
 *
 * @param state The initial GameState used to start the game.
 *
 * @precondition
 * - state must be a valid GameState.
 * - The board must be correctly initialized.
 * - make_move() must correctly perform player or bot moves.
 *
 * @complexity
 * Time: O(T), where T is the number of turns played until the game ends.
 * Space: O(1), since the game state is updated in place.
 *
 * @returns
 * This function does not return a value (void).
 * The game result is printed to the console.
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