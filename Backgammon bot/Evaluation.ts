import {
    GameState
 } from "../game_logic/types";

/**
 * Tar in ett state och ger ett nummer för huruvida bra statet är för boten. 
 * Gåner 10 för stenar i mål
 * Gånger tre för stenar på baren
 * Poäng för 
 * 
 */
export function evaluation(state: GameState): number{
    let evaluation = 0; 

    
    evaluation += state.board.borne_off.black * 15; 
    evaluation -= state.board.borne_off.white * 15;

    evaluation -= state.board.bar.black * 25; 
    evaluation += state.board.bar.white * 25; 
    
    let black_made_points = 0;
    let white_made_points = 0;

    for (let i = 0; i < 24; i++){
        const point = state.board.points[i];


        if (point.player === "black") {
            // Antal steg kvar för en sten att kunna bli borne off
            evaluation -= (i + 1) * point.count

            // Sten som står själv
            if (point.count === 1) {
                evaluation -= 2;
            }

            //Points där svarta har minst 2 stenar
            if (point.count >= 2) {
                black_made_points++;
            }

        } else if (point.player === "white") {
            evaluation += (24 - i) * point.count;

            if (point.count === 1) {
                evaluation += 2;
            }

            if (point.count >= 2) {
                white_made_points++;
            }
        }
    }
    //Skillnaden i antal points där svart och vit har stenar fler än 1
    evaluation += 2 * (black_made_points - white_made_points);

    return evaluation;

}