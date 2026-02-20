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
export function find_single(state: GameState, point: number): boolean {
    const stone_count = state.board.points[point].count;

    const opp = state.current_player === "white"
                ? "black"
                : "white";

    if (stone_count === 1 &&
        (state.current_player !== opp)) {
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
    
    if (state.current_player === "white") {
        for (let i = 0; i < 6; i++) {
            if (point[i].player !== "white" || null) {
                return false;
            }
        }
    } else {
        for (let i = 23; i > 18; i--) {
            if (point[i].player !== "black" || null) {
                return false;
            }
        }
    }
    return true; 
};

export function borne_off(state: GameState): GameState {
    const cur_borne = state.board.borne_off[state.current_player];

}