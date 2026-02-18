import {Dice, GameState, Board, Player} from "./types";



function is_legal_move(state: GameState, from: number, die: number): boolean {    
    if (state.current_player === "black" && 
        state.board.points[from+die] === state.board.points.
        
    ) {
        return false 
        console.log("Invalid move");
    }
    return true;
};