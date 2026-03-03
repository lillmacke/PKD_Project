import {Board, Player, GameState} from "../game_logic/types";

/**
 * 
 * @param board 
 * @param player 
 * @returns 
 */
export const stones_on_bar = (board: Board, player: Player): boolean =>
    board.bar[player] > 0;

/**
 * Ska hitta punkter som endast har en sten, 
 * och kolla om den tillhör motståndaren
 * @param state 
 * @param index 
 * @returns 
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
 * "äter upp" en ensam sten om man landar på den, och skickar den till baren
 * Invarianten blir väl att "dest"-punkten måste ha en ensam motståndar-sten, 
 * så denna funktion kallas bara om detta är uppfyllt (se apply_move).
 * @example
 * @param state 
 * @param index 
 * @precondition
 * @complexity
 * @returns 
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
 * 
 * @example
 * @param state 
 * @param from
 * @precondition 
 * @complexity 
 * @returns 
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

//BORNE OFF
// ska kolla om en spelare har alla sina stenar hemma
// Om man tex slår en 4 men har stenar på 5 eller 6, måste man flytta dessa först,
// innan man tar hem de på 1-3
export function borne_off(state: GameState, from: number): GameState {
    const board = state.board;

    board.points[from].count--;
    
    if (board.points[from].count === 0) {
        board.points[from].player = null;
    } else {}
    board.borne_off[state.current_player]++;
    return state;
}

export function switch_player(state: GameState): void {
    if (state.current_player === "white") {
        state.current_player = "black";
    } else {
        state.current_player = "white";
    }                      
}

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