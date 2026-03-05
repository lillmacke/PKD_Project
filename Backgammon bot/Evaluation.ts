import {
    GameState
 } from "../game_logic/types";

/**
 * Evaluates a given game state and returns a heuristic score from
 * the perspective of the black player.
 *
 * A higher score means the position is better for black,
 * while a lower score means the position is better for white.
 *
 * The evaluation considers:
 * - Stones borne off
 * - Distance remaining to bear off
 * - Single stones are penalized
 * - Made points (positions with ≥2 stones that block the opponent)
 *
 * @example
 * evaluation(state)
 * // Returns a number representing how favorable the position is for black.
 *
 * @param state The current game state to evaluate.
 *
 * @precondition
 * - state must be a valid GameState.
 * - The board must contain exactly 24 points.
 * - Stone counts and player ownership must be consistent.
 *
 * @complexity
 * Time: O(n), where n = 24 board points.
 * Space: O(1)
 * 
 * @returns
 * A numeric score:
 * - Positive values favor black.
 * - Negative values favor white.
 */
export function evaluation(state: GameState): number {
    let evaluation = 0; 

    evaluation += state.board.borne_off.black * 35; 
    evaluation -= state.board.borne_off.white * 35;
    evaluation += state.board.bar.white * 10
    
    let black_made_points = 0;
    let white_made_points = 0;

    for (let i = 6; i < 24; i++){
        const point = state.board.points[i];
        if (point.player === "black") {
            // Antal steg kvar för en sten att kunna bli borne off
            evaluation -= (i + 1) * point.count
            // Sten som står själv
            if (point.count === 1) {
                evaluation -= (30 - i);
            } else {}

            //Points där svarta har minst 2 stenar
            if (point.count >= 2) {
                black_made_points++;
            }
        }
    }
    for( let i = 0; i < 6; i++ ){
        const point = state.board.points[i];
         if (point.player === "black") {
            // Antal steg kvar för en sten att kunna bli borne off
            evaluation += (1) * point.count
            // Sten som står själv
            if (point.count === 1) {
                evaluation -= 50;
            } else {}

            //Points där svarta har minst 2 stenar
            if (point.count >= 2) {
                black_made_points++;
            }
        }
    }

    

    //Skillnaden i antal points där svart och vit har stenar fler än 1
    evaluation += 2 * (black_made_points - white_made_points);
    return evaluation;
}