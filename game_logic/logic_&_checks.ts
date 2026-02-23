import {Board, Player, GameState, Point, Dice} from "../game_logic/types";
import { apply_move } from "./moves";


/**
 * Checks if a player has stones on the bar. 
 * @param board 
 * @param player 
 * @returns 
 */
export function stones_on_bar(board : Board, player: Player): boolean {
    return board.bar[player] > 0
};

// Ska hitta punkter som endast har en sten, och kolla om den tillhör motståndaren
export function find_single(state: GameState, index: number): boolean {
    const point = state.board.points[index];

    if (point.count === 1 && point.player !== null &&
        point.player !== state.current_player) {
        return true;
    }
    return false;
};

// "äter upp" en ensam sten om man landar på den, och skickar den till baren
// Invarianten blir väl att "dest"-punkten måste ha en ensam motståndar-sten, så denna
// funktion kallas bara om detta är uppfyllt (se apply_move).
export function to_hit(state: GameState, index: number): GameState {
    const point = state.board.points[index];

    point.count--;

    if (point.count === 0) {
        point.player = null
    }

    if (state.current_player === "white") {
        state.board.bar.black++; 
    } else {
        state.board.bar.white++;
    }
   return state; 
};

export function update_player_status(state: GameState, index : number): GameState {
    const point = state.board.points;

    if (point[index].count === 0) {
        point[index].player = null;
    }
    if (point[index].count > 0) {
        point[index].player = state.current_player;
    }

    return state;

}

//BORNE OFF
// ska kolla om en spelare har alla sina stenar hemma
// Om man tex slår en 4 men har stenar på 5 eller 6, måste man flytta dessa först,
// innan man tar hem de på 1-3


/**
 * Checks if a all of a players stone is home
 * @param state 
 * @returns 
 */
export function all_stones_home(state:GameState): boolean {
    const point = state.board.points;
    
    if (state.board.bar[state.current_player] > 0) {
        return false;
    }

    if (state.current_player === "white") {
        for (let i = 0; i < 18 ; i++) {
            if (point[i].player === "white" && point[i].count > 0) {
                return false;
            }
        }
    } else {
        for (let i = 6; i < 24; i++) {
            if (point[i].player === "black" && point[i].count > 0) {
                return false;
            }
        }
    }
    return true; 
};

export function borne_off(state: GameState, from: number): GameState {
    const board = state.board;

    board.points[from].count--;
    if(board.points[from].count === 0) {
        board.points[from].player = null;
    }

    board.borne_off[state.current_player]++;

    return state;

}

export function higher_stone_in_home(state: GameState, from : number): boolean {   
    if (state.current_player === "white") {
        for (let i = 18; i < from; i++) {
            if(state.board.points[i].player === "white" 
                && state.board.points[i].count > 0)
                return true;
        }
    } else {
        for (let i = from + 1; i <= 5; i++) {
            if(state.board.points[i].player === "black" 
                && state.board.points[i].count > 0)
                return true;
            }
    }
    return false;
}


export function can_bear_off(state: GameState, from: number, die: number): boolean {
    const dist = state.current_player === "white"
                 ? 24 - from
                 : from + 1;
    if (die === dist) {
        return true;
    }
    if (die < dist) {
        return false;
    }

    return !higher_stone_in_home(state, from);
    
}


export function switch_player(state : GameState) : void {
    state.current_player === "white" 
                             ? "black" 
                             : "white"
}


export function game_over(state : GameState) : string | null {
    if (state.board.borne_off.white === 15) {
        return "white";
    } 
    if (state.board.borne_off.black === 15) {
        return "black";
    }

    return null;
}
