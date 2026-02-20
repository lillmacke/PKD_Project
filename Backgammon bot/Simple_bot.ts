


import {
    Player, Point, Dice, Board, GameState, move
 } from "../game_logic/types";

import {
    is_valid_move, apply_move
} from "../game_logic/moves"





function make_move(current: GameState): move {
    const player = current.current_player;
    let moves_left = current.dice;
    while (moves_left !== []){
        
        for (let i = 23; i = 0; i--){
            if (current.board.point[i] !== "black" ){
                for (let y = 0; y < length.moves_left; y++){
                    if (is_valid_move(current, point[i], moves_left[y]) === true){
                        apply_move(current, point[i], moves_left[y])
                        remove[moves_left[y], moves_left]
                    }
                }
            }
        }  
    }
    
    
}