import {GameState, Point, Board} from "./types";

/**
 * Creates the starting board for the backgammon game
 * 
 * The function:
 * - Initializes 24 empty board points.
 * - Places black and white stones in their starting postitions
 * - Sets both bar and borne_off counters to 0
 * - Sets the starting player to "white"
 * - Initializes dice as null
 * 
 * @example 
 * const state = starting_board();
 * console.log(state.board.points);
 * 
 * @param None
 * 
 * @precondition 
 * - Point, Board, and GameState types must be correctly defined.
 * - The board must consist of exactly 24 points (indices 0–23).
 *
 * @complexity 
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns 
 * A fully initialized GameState object representing the standard
 * starting position of a Backgammon game.
 */
export function starting_board(): GameState {
    const points : Array<Point> = []
    for (let i = 0; i < 24; i++) {
        points.push({player: null, count: 0});
    }
    // Ändrar så vita stenar hamnar rätt vid startläge
    points[0]  = {player: "white", count: 2};
    points[11] = {player: "white", count: 5};
    points[16] = {player: "white", count: 3};
    points[18] = {player: "white", count: 5};
    
    // Ändrar så svarta stenar hamnar rätt vid startläge
    points[23] = {player: "black", count: 2};
    points[12] = {player: "black", count: 5};
    points[7]  = {player: "black", count: 3};
    points[5]  = {player: "black", count: 5};

    const board : Board = {
        points: points,
        bar: {"white" : 0, "black" : 0}, 
        borne_off: {"white" : 0, "black" : 0}
    };

    const gamestate : GameState = {
        board: board,
        current_player: "white",
        dice: null
    };
    return gamestate;
}