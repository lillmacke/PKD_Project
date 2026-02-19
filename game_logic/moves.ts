import {Dice, GameState, Board, Player} from "./types";



function is_valid_move(state: GameState, from: number, die: number): boolean {
    const destination = state.current_player === "white"
                      ? from + die
                      : from - die;

    if(!(from >= 0 && from < 24)) {
        return false;
    }

    if((destination < 0 || destination > 23)) {
        return false;
    }

    if(state.board.points[from].player !== state.current_player) {
        return false;
    }

    if (state.current_player === "black" && 
        state.board.points[destination].player === "white" &&
        state.board.points[destination].count > 1) {
        console.log("Invalid move");
            return false; 
                      
    } else if (state.current_player === "white" && 
        state.board.points[destination].player === "black" &&
        state.board.points[destination].count > 1) {
            console.log("Invalid move");
                    return false;             
    }

    return true;
};

function stones_on_bar(board: Board, player: Player): boolean {
    if (board.bar.black > 0) 
};

function apply_move(state: GameState, from: number, die: number): GameState {
    if (is_valid_move(state, from, die)) {
            
    }
};


