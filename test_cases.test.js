"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const combo_sequence_1 = require("../PKD_Project/Backgammon bot/combo_sequence");
const clone_1 = require("../PKD_Project/Backgammon bot/clone");
const logic___checks_1 = require("../game_logic/logic_&_checks");
const moves_1 = require("../game_logic/moves");
const WinState = {
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
    let state = (0, clone_1.clone)(WinState);
    const moves = (0, combo_sequence_1.choose_best_move_by_order)(state);
    expect(moves).not.toBeNull();
    expect(moves.length).toBeGreaterThan(0);
    for (const i of moves) {
        state = (0, moves_1.apply_move)(state, i.from, i.die);
    }
    expect((0, logic___checks_1.game_over)(state)).toBe("black");
});
