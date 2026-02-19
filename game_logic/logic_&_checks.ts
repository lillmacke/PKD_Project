import {Board, Player, GameState, Point, Dice} from "../game_logic/types";


/**
 * Checks if a player has stones on the bar. 
 * @param board 
 * @param player 
 * @returns 
 */
export function stones_on_bar(board : Board, player: Player): boolean {
    return board.bar[player] > 0
};

export function to_hit(state: GameState, from: number, die: number): GameState {

}