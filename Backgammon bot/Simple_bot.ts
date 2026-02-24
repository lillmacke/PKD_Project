


import {
    Player, Point, Dice, Board, GameState, move
 } from "../game_logic/types";

import {
    is_valid_move, apply_move
} from "../game_logic/moves"





function make_move(current: GameState): move | null {
    const player = current.current_player; // tar ut spelarens färg
    let moves_left = [...current.dice.values]; //skapar en array med tärnings kasten
    while (moves_left.length > 0){ // kollar om det finns tärningar kvar att bearbeta
        let move_found = false;
        
        for (let i = 23; i >= 0; i--){ //går igenom spelbrädet från högsta till lägsta index
            const point = current.board.points[i]; // tar ut nummer och färg för point[i]

            if (point.player === player){ // kollar om boten har stenar på aktuell point
                for (let y = 0; y < moves_left.length; y++){ //går igenom tärningskasten
                    

                    if (is_valid_move(current, i, moves_left[y]) === true){ //kollar om valid
                        apply_move(current, i, moves_left[y]) // gör movet om valid
                        moves_left.splice(y, 1); // tar bort tärningskast som har använts
                        //remove[moves_left[y], moves_left] har inte någon fungerande remove funktion, lär finnas. bara för att gestalta. 
                        move_found = true;
                        break; 
                    }
                     
                } 
            if (move_found === true){ //hoppar tillbaka till while loopen
                        break;
            }
            
        }
        if (!move_found) break;
    } 
    return null; 
}