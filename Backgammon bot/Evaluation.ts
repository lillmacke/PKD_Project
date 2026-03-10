import { pid } from "node:process";
import { GameState } from "../game_logic/types";

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
 * higher values favor black.
 * 
 */
export function evaluation(state: GameState): number {
    let evaluation = 0; 
    evaluation += state.board.borne_off.black * 35; 
    
    for (let i = 0; i < 18; i++) {
        const point = state.board.points[i];
        if (point.player === "white" && point.count === 1) {
            evaluation -= i + 6;
        } else {}
    }

    for (let i = 18; i < 24; i++) {
        const point = state.board.points[i];
        if (point.player === "white" && point.count === 1) {
            evaluation -= 50;
        } else {}
    }

    for (let i = 6; i < 24; i++) {
        const point = state.board.points[i];
        if (point.player === "black") {
            //Number of steps left for a stone to be borne off
            evaluation += (30 - i) * point.count;
            //Point with only one stone
            if (point.count === 1) {
                evaluation -= (30 - i);
            } else {}
            //Points where black has at least two stones
            if (point.count >= 2) {
                evaluation += (30- i) * point.count;
            } else {}
        } else {}
    }
    for (let i = 0; i < 6; i++) {
        const point = state.board.points[i];
         if (point.player === "black") {
            //Number of steps left for a stone to be borne off
            evaluation += 30 * point.count;
            //Point with only one stone
            if (point.count === 1) {
                evaluation -= 50;
            } else {}
            //Points where black has at least two stones
            if (point.count >= 2) {
                evaluation +=  25 * point.count;
            } else {}
        } else {}
    }    
    return evaluation;
}