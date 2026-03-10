import { Board, Player, GameState } from "../game_logic/types";
import { is_valid_move, is_valid_move_bar } from "./valid_move";
import { apply_move, apply_move_bar } from "./moves";

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

export const stones_on_bar = (board: Board, player: Player): boolean =>
    board.bar[player] > 0;

export function find_single(state: GameState, index: number): boolean {
    const point = state.board.points[index];

    if (point.count === 1 && point.player !== null &&
        point.player !== state.current_player) {
        return true;
    } else {}
    return false;
}

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

export function borne_off(state: GameState, from: number): GameState {
    const board = state.board;

    board.points[from].count--;
    
    if (board.points[from].count === 0) {
        board.points[from].player = null;
    } else {}
    board.borne_off[state.current_player]++;
    return state;
}

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