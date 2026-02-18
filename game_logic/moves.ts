import {Dice, GameState, Board, Player} from "./types";



function is_valid_move(state: GameState, from: number, die: number): boolean {    
    if (state.current_player === "black" && 
        state.board.points[from-die].player === "white" &&
        state.board.points[from-die].count > 1) {
            console.log("Invalid move");
            return false;           
    } else if 
        (state.current_player === "white" && 
        state.board.points[from+die].player === "black" &&
        state.board.points[from+die].count > 1) {
            console.log("Invalid move");
            return false;
   }
   return true;
};

function apply_move(state: GameState, from: number, die: number): GameState {

}

function stones_on_bar(board: Board, player: Player): boolean {
    
}
