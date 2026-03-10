import { GameState } from "../game_logic/types";

/**
 * Creates a copy of a GameState object so that it can be changed without 
 * interfering with the original gamestate. 
 * @example const new_state = clone(state) // new_state is now a clone. 
 * @param state : The object to clone.
 * @precondition - state must be a valid GameState.
 * @complexity - Time: O(n).
 * @returns - copy of state.
 */
export function clone(state : GameState){
    return JSON.parse(JSON.stringify(state));
}