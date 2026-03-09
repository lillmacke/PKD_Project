/**
 * Represents a player in the game.
 * A player can either be "white" or "black"
 */
export type Player = "white" | "black";

/**
 * Represents a single point on the board.
 * Each point can contain stones belning to one player.
 * 
 * player - Which player the stones belong to on this point,
 *          or null if the point is empty
 * count - Number of stones on the point
 */
export type Point = {
    player: Player | null;
    count: number;
}

/**
 * Represents the dice values available for the current turn.
 * The array contains the remaining dice that can still be used.
 * 
 * values - Values of the dice
 */
export type Dice = {
    values: number[];
}

/**
 * Represents the beckgammon board state.
 * 
 * The board consist of 24 points wheres stones can be placed. 
 * It also keeps track of stones that are on the bar on stones
 * that have been borne off the board.
 * 
 * points - Array cointaining the 24 board points
 * bar - Number of stones each player has on the bar
 * borne_off - Number of stones each player has borne off the board
 */
export type Board = {
    points: Point[];
    bar: Record<Player, number>;
    borne_off: Record<Player, number>;
}

/**
 * Represents the complete state of the game.
 * 
 * The game state contains the current board, 
 * the player whose turn it is, and the dice values
 * for the current turn.
 * 
 * board - The current board configuration
 * current_player - The player whose turn it is
 * dice - The dice values available for the currrent turn,
 * or null if the dice have not yet been rolled. 
 */
export type GameState = {
    board: Board;
    current_player: Player;
    dice: Dice | null; //if dice === null, dice not rolled yet 
}

/**
 * Represents a move that can be performed by the bot
 * 
 * BotAction specifices the starting poistion of the stone
 * and the die value used for the move. The value -1 for 
 * the starting postion represents a move from the bar.
 * 
 * number - The starting point of the move
 * die - The die value used to perform the move
 */
export type BotAction = {
    from: number;
    die: number;
}