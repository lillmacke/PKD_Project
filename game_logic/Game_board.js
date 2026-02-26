"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Starting_board_1 = require("./Starting_board");
const Dice_1 = require("./Dice");
const logic___checks_1 = require("./logic_&_checks");
const moves_1 = require("./moves");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)({ sigint: true });
console.log("Welcome to Backgammon!");
const new_state = (0, Starting_board_1.starting_board)();
const answer = prompt("Do you want to start a new game?: ");
if (answer === "yes") {
    console.log("Starting new game...");
    play_game(new_state);
}
else {
    console.log("Goodbye!");
}
function play_game(state) {
    function remove_die(state, die) {
        if (!state.dice)
            return false;
        const index = state.dice.values.indexOf(die);
        if (index === -1)
            return false;
        state.dice.values.splice(index, 1);
        return true;
    }
    function has_any_legal_move(state) {
        if (!state.dice)
            return false;
        const player = state.current_player;
        const onBar = (0, logic___checks_1.stones_on_bar)(state.board, player);
        for (const die of state.dice.values) {
            if (onBar) {
                const dest = player === "white" ? die - 1 : 24 - die;
                if ((0, moves_1.is_valid_move_bar)(state, dest))
                    return true;
            }
            else {
                for (let from = 0; from < 24; from++) {
                    if ((0, moves_1.is_valid_move)(state, from, die))
                        return true;
                }
            }
        }
        return false;
    }
    function check_move(state, from, die) {
        const player = state.current_player;
        const onBar = (0, logic___checks_1.stones_on_bar)(state.board, player);
        if (onBar) {
            const dest = player === "white" ? die - 1 : 24 - die;
            if (!(0, moves_1.is_valid_move_bar)(state, dest)) {
                console.log("Invalid bar move.");
                return false;
            }
            (0, moves_1.apply_move_bar)(state, die);
        }
        else {
            if (!(0, moves_1.is_valid_move)(state, from, die)) {
                console.log("Invalid move.");
                return false;
            }
            (0, moves_1.apply_move)(state, from, die);
        }
        if (!remove_die(state, die)) {
            console.log("Error: die was not available to remove.");
            return false;
        }
        if (state.dice && state.dice.values.length === 0) {
            console.log("\nNext player\n");
            (0, logic___checks_1.switch_player)(state);
            state.dice = null;
        }
        return true;
    }
    function make_move(state) {
        while (state.dice && state.dice.values.length > 0) {
            console.log(state.board);
            console.log("\nCurrent player:", state.current_player);
            console.log("Remaining dice:", state.dice.values.join(", "));
            if (!has_any_legal_move(state)) {
                console.log("No legal moves. Passing turn.\n");
                (0, logic___checks_1.switch_player)(state);
                state.dice = null;
                return;
            }
            const onBar = (0, logic___checks_1.stones_on_bar)(state.board, state.current_player);
            const dieInput = prompt("Choose die to use: ");
            const die = Number(dieInput);
            if (!state.dice.values.includes(die)) {
                console.log("You don't have that die.");
                continue;
            }
            let from = -1;
            if (!onBar) {
                const input_point = prompt("From what point do you make a move?: ");
                from = Number(input_point);
            }
            else {
                console.log("You have stones on the bar.");
            }
            if (!check_move(state, from, die)) {
                console.log("Try again.");
            }
        }
    }
    while ((0, logic___checks_1.game_over)(state) === null) {
        if (state.dice === null) {
            console.log("\nRolling dice...");
            state.dice = (0, Dice_1.dice_roll)();
        }
        make_move(state);
    }
    const winner = (0, logic___checks_1.game_over)(state);
    console.log(`${winner} wins!`);
}
