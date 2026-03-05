import { 
    legal_moves_one_die,  sim_seq_order, choose_best_move_by_order
 } from "./Backgammon bot/combo_sequence";
import { 
    clone
} from "./Backgammon bot/clone";

 import{
    GameState
 } from "./game_logic/types";

 import { starting_board } from "./game_logic/Starting_board";

import {dice_roll} from "./game_logic/Dice";

import { stones_on_bar, switch_player,
    game_over} from "./game_logic/logic_&_checks"

import {apply_move, apply_move_bar} from "./game_logic/moves";



const WinState : GameState = {
  current_player: "black",
  dice: { values: [1, 3] },

  board: {
    points: [
      { player: "black", count: 1 }, 
      { player: null, count: 0 },   
      { player: null, count: 0 },   
      { player: null, count: 0 },   
      { player: null, count: 0 },   
      { player: null, count: 0 },   
      { player: null, count: 0 },   
      { player: null, count: 0 },   
      { player: null, count: 0 },   
      { player: null, count: 0 },   
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 },    
      { player: null, count: 0 }     
    ],

    bar: {
      white: 0,
      black: 0
    },

    borne_off: {
      white: 0,
      black: 14
    }
  }
}; 
// test("Checks wether the bot will win the game when given a chance",()=>{
//    const winner = clone(WinState)
//    const moves = choose_best_move_by_order(WinState);
//    for (let i = 0; i < moves.lenght; i++){
//        if (check_move(moves[i]) === true){
//            apply_move(winner,)
//        }
//    }
// });

 test("Checks whether the bot will win the game when given a chance", () => {
  let state = clone(WinState);

  const moves = choose_best_move_by_order(state);
  expect(moves).not.toBeNull();
  expect(moves!.length).toBeGreaterThan(0);

  for (const i of moves!) {
    state = apply_move(state, i.from, i.die);
  }

  expect(game_over(state)).toBe("black");
});
 