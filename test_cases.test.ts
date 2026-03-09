import { 
    choose_best_move_by_order
} from "./Backgammon bot/combo_sequence";
import { clone } from "./Backgammon bot/clone";
import { GameState } from "./game_logic/types";
import { game_over } from "./game_logic/logic_&_checks"
import { apply_move } from "./game_logic/moves";

//Test 1. 
test("Checks whether the bot will win the game when given a chance", () => {
	const win_state: GameState = {
		current_player: "black", 
		dice: {values: [1, 3]},
		board: {
			points: [
				{player: "black", count: 1}, 
				{player: null, count: 0},   
				{player: "black", count: 1},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0}],
    		bar: {white: 0, black: 0},
    		borne_off: {white: 0, black: 13}
  			}
	};
	let state = clone(win_state);
	const moves = choose_best_move_by_order(state);
	expect(moves).not.toBeNull();
	expect(moves!.length).toBeGreaterThan(0);

	for (const i of moves!) {
		state = apply_move(state, i.from, i.die);
  	}
	expect(game_over(state)).toBe("black");
});
 
//Test 2. Hit a single stone
test("Hit a single white stone", () => {
	const game_state_2: GameState = {
  		current_player: "black",
  		dice: {values: [2, 3]},
		board: {
			points: [
      			{player: null, count: 0}, 
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: "white", count: 1},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: "black", count: 1},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: "black", count: 14},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: "white", count: 14},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0}],
			bar: {white: 0, black: 0},
    		borne_off: {white: 0, black: 0}
  			}
	};
  	let state = clone(game_state_2);
  	const moves = choose_best_move_by_order(state);
  	expect(moves).not.toBeNull();
  	expect(moves!.length).toBeGreaterThan(0);

  	for (const i of moves!) {
    	state = apply_move(state, i.from, i.die);
  	}
	expect(state.board.bar.white).toBe(1);
});

//Test 3. Bot avoids leaving a stone alone
test("Avoid leaving stone alone", () => {
	const game_state_3: GameState = {
		current_player: "black",
		dice: {values: [1, 3]},
		board: {
			points: [
				{player: null, count: 0}, 
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: "black", count: 2},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: null, count: 0},   
				{player: "black", count: 1},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: "black", count: 12},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: "white", count: 15},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0},    
				{player: null, count: 0}],
			bar: {white: 0, black: 0},
			borne_off: {white: 0, black: 0}
			}
	}; 
	let state = clone(game_state_3);
	const moves = choose_best_move_by_order(state);
	expect(moves).not.toBeNull();
	expect(moves!.length).toBeGreaterThan(0);
		
	for (const i of moves!) {
	state = apply_move(state, i.from, i.die);
	}
	expect(state.board.points[6].count).toBeGreaterThanOrEqual(2);
});

//Test 4 Bot moves stone closer to home
test("Bot moves stone closer to home", () => {
	const game_state4: GameState = {
		current_player: "black",
		dice: {values: [5, 4]},
		board: {
    		points: [
      			{player: null, count: 0}, 
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: "black", count: 3},   
      			{player: "black", count: 12},   
      			{player: null, count: 0},   
      			{player: null, count: 0},   
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: "white", count: 14},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0},    
      			{player: null, count: 0}],
			bar: {white: 0, black: 0},
    		borne_off: {white: 0, black: 0}
  			}
	}; 
  	let state = clone(game_state4);
  	const moves = choose_best_move_by_order(state);
  	expect(moves).not.toBeNull();
 	 expect(moves!.length).toBeGreaterThan(0);

  	for (const m of moves!) {
    	state = apply_move(state, m.from, m.die);
  	}
  	// The stone from point 7 should move closer to home (towards index 0)
 	expect(state.board.points[2].player).toBe("black");
  	expect(state.board.points[2].count).toBeGreaterThan(0);
});

//Test 5 Bot enters from bar
test("Bot enters from bar when it has a checker on the bar", () => {
	const game_state_5: GameState = {
  		current_player: "black",
 	 	dice: {values: [3, 5]},
  		board: {
    		points: [
      			{player: null, count: 0}, 
      			{player: null, count: 0},
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0},
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0},
      			{player: null, count: 0},
      			{player: null, count: 0}, 
      			{player: "black", count: 14}, 
      			{player: null, count: 0}, 
      			{player: "white", count: 13}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: "white", count: 2}, 
      			{player: null, count: 0},
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}],
    		bar: {white: 0, black: 1},
    		borne_off: {white: 0, black: 0}
  			}
	};
  	let state = clone(game_state_5);
  	const moves = choose_best_move_by_order(state);
  	expect(moves).not.toBeNull();
  	expect(moves!.length).toBeGreaterThan(0);
  	expect(moves![0].from).toBe(-1);

  	for (const m of moves!) {
    	state = apply_move(state, m.from, m.die);
  	}
  	expect(state.board.bar.black).toBe(0);
  	expect(state.board.points[16].player).toBe("black");
  	expect(state.board.points[16].count).toBeGreaterThan(0);
});


//Test 6 Bot handles doubles

test("Bot uses double correctly", () => {
	const game_state_6: GameState = {
  		current_player: "black",
  		dice: {values: [2, 2, 2, 2]},
  		board: {
    		points: [
      			{player: null, count: 0}, 
      			{player: null, count: 0},
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0},
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0},
      			{player: null, count: 0},
      			{player: null, count: 0}, 
      			{player: "black", count: 1}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0},
      			{player: null, count: 0}, 
      			{player: null, count: 0}, 
      			{player: null, count: 0}],
    		bar: {white: 0, black: 0},
    		borne_off: {white: 0, black: 0}
  			}
	};
  	let state = clone(game_state_6);
  	const moves = choose_best_move_by_order(state);
  	expect(moves).not.toBeNull();
  	expect(moves!.length).toBeGreaterThan(0);

  	for (const m of moves!) {
    	state = apply_move(state, m.from, m.die);
  	}
  	expect(state.board.points[3].player).toBe("black");
  	expect(state.board.points[3].count).toBeGreaterThan(0);
});
