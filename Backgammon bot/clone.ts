import { GameState } from "../game_logic/types";


/**
 * Creates a deep copy of a GameState object.
 *
 * This function is used when simulating moves for the bot so that the
 * original game state is not modified. Instead, operations are performed
 * on a cloned state.
 *
 * The cloning is performed using JSON serialization, which creates a
 * completely new object with the same data structure.
 *
 * @example
 * const new_state = clone(state)
 * // new_state can now be modified without affecting the original state.
 *
 * @param state The GameState object to clone.
 *
 * @precondition
 * - state must be a valid GameState.
 * - The GameState must only contain JSON-serializable data.
 *
 * @complexity
 * Time: O(n), where n is the size of the GameState object.
 * Space: O(n), since a full copy of the state is created.
 *
 * @returns
 * A deep copy of the provided GameState.
 */
export function clone(state : GameState){
    return JSON.parse(JSON.stringify(state));
}