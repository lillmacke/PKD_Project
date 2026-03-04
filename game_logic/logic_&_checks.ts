import {Board, Player, GameState} from "../game_logic/types";
import {is_valid_move, is_valid_move_bar} from "./valid_move";
import {apply_move, apply_move_bar} from "./moves";


/**
 * Attempts to perform a move for the current player using a given die.
 *
 * The function:
 * - Determines whether the player must enter from the bar first.
 * - Validates the move.
 * - Applies the move to the game state if valid.
 * - Removes the used die from the remaining dice.
 * - Switches player and resets dice when no dice remain for the turn.
 *
 * @example
 * check_move(state, 12, 3)
 * // Tries to move a stone from point 12 using die 3.
 * // Returns true if the move is applied, false otherwise.
 *
 * @param state The current game state.
 * @param from The board index to move from. Ignored if the player has stones on the bar.
 * @param die The die value to use for the move.
 *
 * @precondition
 * - state must be a valid GameState.
 * - state.dice must not be null and must contain `die` in state.dice.values.
 * - If the player has stones on the bar, the move must be an entry move.
 *
 * @complexity
 * Time: O(n), where n ≤ 4 (removing a die from the dice list).
 * Space: O(1)
 *
 * @returns
 * - true if a legal move was applied and the die was consumed.
 * - false if the move was invalid or the die could not be removed.
 */
export function check_move(state: GameState, 
                           from: number, die: number): boolean {
    const player = state.current_player;
    const onBar = stones_on_bar(state.board, player);

    if (onBar) {
        const dest = player === "white" ? die - 1 : 24 - die;

        if (!is_valid_move_bar(state, dest)) {
            console.log("Invalid bar move.");
            return false;
        } else {}
        apply_move_bar(state, die);
    } else {
        if (!is_valid_move(state, from, die)) {
            console.log("Invalid move.");
            return false;
        } else {}
        apply_move(state, from, die);
    }
 
    if (!remove_die(state, die)) {
        console.log("Error: die was not available to remove.");
        return false;
    } else {}
 
    if (state.dice && state.dice.values.length === 0) {
        console.log("\nNext player\n");
        switch_player(state);
        state.dice = null;
    } else {}
    return true;
}

/**
 * Checks if the player has stones on the bar
 * 
 * @example
 * stones_on_bar(board, "white")
 * // Returns true if white has at least one stone on the bar.
 * 
 * @param board Current game board
 * @param player The player to check
 * 
 * @precondition
 * - board must be a valid Board object.
 * - player must be a valid Player value.
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns 
 * true if the player has one or more stones on the bar.
 * false otherwise.
 */
export const stones_on_bar = (board: Board, player: Player): boolean =>
    board.bar[player] > 0;

/**
 * Checks whether a point contains a single opponent stone.
 * Such a stone can be hit and sent to the bar.
 * 
 * @example
 * find_single(state, 8)
 * // Returns true if point 8 contains a single opponent stone. 
 * 
 * @param state Current game state
 * @param index The board index to check
 * 
 * @precondition
 * - state must be a valid GameState object.
 * - index must be within board bounds.
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 *
 * @returns
 * true if the point contains exactly one opponent stone.
 * false otherwise.
 */
export function find_single(state: GameState, index: number): boolean {
    const point = state.board.points[index];

    if (point.count === 1 && point.player !== null &&
        point.player !== state.current_player) {
        return true;
    } else {}
    return false;
}

/**
 * Hits a single opponent stone on the specified point
 * and sends it to the bar.
 *
 * If a player lands on a point containing exactly one opponent stone,
 * that stone is removed from the point and placed on the bar.
 * 
 * @example
 * to_hit(state, 8)
 * // If point 8 contains a single opponent stone,
 * // it will be removed and sent to the bar.
 * 
 * @param state Current game state
 * @param index The board index where to hit
 * 
 * @precondition
 * - index must be a valid board position.
 * - The point must contain exactly one opponent stone.
 * - The current player must be the one performing the hit.
 * 
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns 
 * The updated GameState after the opponent stone has been moved to the bar.
 */
export function to_hit(state: GameState, index: number): GameState {
    const point = state.board.points[index];
    const bar = state.board.bar;

    point.count--;

    if (point.count === 0) {
        point.player = null
    } else {}

    if (state.current_player === "white") {
        bar.black++; 
    } else {
        bar.white++;
    }
    return state; 
}

/**
 * Updates the ownership status of a point after a move.
 *
 * If a point becomes empty (count = 0), the player is set to null.
 * If the point contains one or more stones, the player is set to
 * the current player.
 *
 * This function ensures that the board state remains consistent
 * after stones are moved between points.
 *
 * @example
 * update_player_status(state, 12)
 * // Updates point 12 so the player field correctly reflects
 * // whether the point is empty or owned by the current player.
 *
 * @param state The current game state.
 * @param index The board index whose status should be updated.
 *
 * @precondition
 * - index must be a valid board position.
 * - The point count must already have been updated before calling
 *   this function.
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 *
 * @returns 
 * The updated GameState with corrected point ownership.
 */
export function update_player_status(state: GameState, 
                                     index: number): GameState {
    const point = state.board.points;

    if (point[index].count === 0) {
        point[index].player = null;
    } else {}

    if (point[index].count > 0) {
        point[index].player = state.current_player;
    } else {}
    return state;
}

/**
 * Checks if a all of a players stone is home
 * @example
 * @param state
 * @precondition
 * @complexity
 * @returns 
 */
export function all_stones_home(state:GameState): boolean {
    const point = state.board.points;
    const player = state.current_player;
    if (state.board.bar[player] > 0) {
        return false;
    } else {}

    if (player === "white") {
        for (let i = 0; i < 18 ; i++) {
            if (point[i].player === "white" && point[i].count > 0) {
                return false;
            }
        }
    } else {
        for (let i = 6; i < 24; i++) {
            if (point[i].player === "black" && point[i].count > 0) {
                return false;
            } else {}
        }
    }
    return true; 
}

/**
 * Checks whether all stones of the current player are in the home board.
 *
 * This function is used to determine if the player is allowed to
 * start bearing off stones. A player may only bear off when all of
 * their stones are in the home board and none are on the bar.
 *
 * Home board ranges:
 * - White: points 18–23
 * - Black: points 0–5
 *
 * @example
 * all_stones_home(state)
 * // Returns true if the current player has all stones in their home board.
 *
 * @param state The current game state.
 *
 * @precondition
 * - state must be a valid GameState.
 * - The board must contain exactly 24 points.
 *
 * @complexity
 * Time: O(n), where n ≤ 24 (board scan)
 * Space: O(1)
 *
 * @returns
 * - true if all stones of the current player are in their home board
 * and none are on the bar.
 * - false otherwise.
 */
export function higher_stone_in_home(state: GameState, from: number): boolean {   
    const points = state.board.points;

    if (state.current_player === "white") {
        for (let i = 18; i < from; i++) {
            if (points[i].player === "white" && points[i].count > 0) {
                return true;
            } else {}           
        }
    } else {
        for (let i = from + 1; i <= 5; i++) {
            if(points[i].player === "black" 
                && points[i].count > 0) {
                return true;
            } else {}   
        }
    }
    return false;
}


/**
 * Checks whether a stone may be borne off from a given point using a die value.
 *
 * Bearing off rules:
 * - A stone may be borne off if the die exactly matches the distance to off-board.
 * - If the die is larger than the exact distance, bearing off is only allowed
 *   if there are no stones on higher points in the home board.
 *
 * Distance convention in this implementation:
 * - White bears off past index 23 (moves toward higher indices).
 * - Black bears off past index 0 (moves toward lower indices).
 *
 * @example
 * can_bear_off(state, 22, 2)
 * // Returns true for white if a stone on point 22 can bear off with die 2.
 *
 * @param state The current game state.
 * @param from The board index of the stone to bear off.
 * @param die The die value used for bearing off.
 *
 * @precondition
 * - state must be a valid GameState.
 * - from must be within 0–23.
 * - The current player must have all stones in the home board
 *   (typically checked using all_stones_home before calling).
 *
 * @complexity
 * Time: O(n)
 * Space: O(1)
 *
 * @returns
 * - true if the current player is allowed to bear off the stone from `from`
 *   using `die`.
 * - false otherwise.
 */
export function can_bear_off(state: GameState, 
                             from: number, die: number): boolean {
    const dist = state.current_player === "white"
                 ? 24 - from
                 : from + 1;

    if (die === dist) {
        return true;
    } else {}

    if (die < dist) {
        return false;
    } else {}
    return !higher_stone_in_home(state, from);   
}

/**
 * Bears off (removes) one stone of the current player from the board.
 *
 * This function decreases the stone count on the specified point and
 * increments the borne_off counter for the current player.
 *
 * @example
 * borne_off(state, 22)
 * // Removes one of the current player's stones from point 22
 * // and increases borne_off for that player.
 *
 * @param state The current game state.
 * @param from The board index (0–23) from which the stone is borne off.
 *
 * @precondition
 * - state must be a valid GameState.
 * - from must be within 0–23.
 * - board.points[from] must contain at least one stone of the current player.
 * - The current player must be allowed to bear off from `from`
 *   (checked externally before calling).
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 *
 * @returns 
 * The updated GameState after bearing off one stone.
 */
export function borne_off(state: GameState, from: number): GameState {
    const board = state.board;

    board.points[from].count--;
    
    if (board.points[from].count === 0) {
        board.points[from].player = null;
    } else {}
    board.borne_off[state.current_player]++;
    return state;
}

/**
 * Removes a die value from the current dice list after it has been used.
 *
 * The function searches for the specified die value in the state's
 * dice array and removes the first occurrence of that value.
 *
 * @example
 * remove_die(state, 4)
 * // If the dice values are [4, 2], the result becomes [2].
 *
 * @param state The current game state.
 * @param die The die value to remove (1–6).
 *
 * @precondition
 * - state must be a valid GameState.
 * - state.dice must not be null.
 * - die must exist in state.dice.values.
 *
 * @complexity
 * Time: O(n)
 * Space: O(1)
 *
 * @returns
 * - true if the die was successfully removed.
 * - false if the die was not found or if no dice are available.
 */
export function remove_die(state: GameState, die: number): boolean {
    if (!state.dice) {
        return false;
    } else {}

    const index = state.dice.values.indexOf(die);
    if (index === -1) {
        return false;
    } else {}

    state.dice.values.splice(index, 1);
    return true;
}
/**
 * Switches the current player in the game state.
 *
 * This function is typically called when a player's turn ends
 * and control should pass to the opponent.
 *
 * @example
 * switch_player(state)
 * // If current_player was "white", it becomes "black".
 *
 * @param state The current game state.
 *
 * @precondition
 * - state must be a valid GameState.
 * - state.current_player must be either "white" or "black".
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 *
 * @returns
 * This function does not return a value.
 * It updates state.current_player directly.
 */
export function switch_player(state: GameState): void {
    if (state.current_player === "white") {
        state.current_player = "black";
    } else {
        state.current_player = "white";
    }                      
}

/**
 * Checks whether the game has ended.
 *
 * The game ends when one player has borne off all 15 of their stones.
 * This function checks the borne_off counters and determines
 * if there is a winner.
 *
 * @example
 * game_over(state)
 * // Returns "white" if white has borne off all stones,
 * // "black" if black has borne off all stones,
 * // otherwise null if the game is still ongoing.
 *
 * @param state The current game state.
 *
 * @precondition
 * - state must be a valid GameState.
 * - borne_off counters must correctly track removed stones.
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 *
 * @returns
 * - "white" if white has borne off all 15 stones.
 * - "black" if black has borne off all 15 stones.
 * - null if the game is still in progress.
 */
export function game_over(state: GameState): string | null {
    const borne_tot = state.board.borne_off;

    if (borne_tot.white === 15) {
        return "white";
    }  else {}
    
    if (borne_tot.black === 15) {
        return "black";
    } else {}
    return null;
}