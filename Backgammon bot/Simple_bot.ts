


import {
    Player, Point, Dice, Board, GameState, move
 } from "../game_logic/types";

import {
    is_valid_move, apply_move
} from "../game_logic/moves"





function make_move(current: GameState): move | null {
    const player = current.current_player;
    let moves_left = [...current.dice.values];
    while (moves_left.length > 0){
        let move_found = false;
        
        for (let i = 23; i >= 0; i--){
            const point = current.board.points[i];

            if (point.player === player){
                for (let y = 0; y < moves_left.length; y++){
                    

                    if (is_valid_move(current, i, moves_left[y]) === true){
                        apply_move(current, i, moves_left[y])
                        moves_left.splice(y, 1);
                        //remove[moves_left[y], moves_left] har inte någon fungerande remove funktion, lär finnas. bara för att gestalta. 
                        move_found = true; 
                        break; 
                    }
                     
                } 
            if (move_found === true){
                        break;
            }
            
        }
    } 
    return null; 
}
    
    
