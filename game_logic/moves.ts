import {Dice, GameState, Board, Player} from "./types";

function is_legal_move(state: GameState, from: number, die: number): boolean {
    if (state.board.points[from]) {
        return false 
        console.log("Invalid move");
    }
};