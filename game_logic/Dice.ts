import {Dice} from "./types";

/**
 * Randomizes two dice rolls to the game
 * 
 * If both dice show the same value (double),
 * four identical dice values are returned according to Backgammon rules.
 * 
 * @example 
 * const roll = dice_roll()
 * { values : [3, 5] }
 * { values : [4, 4, 4, 4] }
 * 
 * @param None 
 * 
 * @precondition 
 * - Math.random() must be available
 * - Dice type must contain a `values: number[]` field.
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns 
 * An object containing an array of dice values
 * - Two values on a normal role
 * - Four identical values if double
 */
export function dice_roll(): Dice {
    let roll_1 = Math.floor(Math.random() * 6) + 1;
    let roll_2 = Math.floor(Math.random() * 6) + 1;

    if (roll_1 === roll_2) {
        console.log("Double:", roll_1, roll_1, roll_1, roll_1);
        return {values: [roll_1, roll_1, roll_1, roll_1]};
    } else {}
    console.log(roll_1, roll_2);
    return {values: [roll_1, roll_2]}; 
}