import { GameState } from "../game_logic/types";

export function clone(state : GameState){
    //måste skrivas, ska klona state. verkar vara något som krävs för minmax
    
    return JSON.parse(JSON.stringify(state));

}