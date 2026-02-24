export type Player = "white" | "black";

/**
 * Triangles on the board
 * Invariant: count >= 0
 * if count === 0 -> owner === null
 */
export type Point = {
    player: Player | null;
    count: number;
};

/**
 * length is 2, 4 if doubles
 * Value between 1-6
 */
export type Dice = {
    values: number[];
};

export type Board = {
    points: Point[]; //length 24
    bar: Record<Player, number>;
    borne_off: Record<Player, number>;
};

export type GameState = {
    board: Board;
    current_player: Player;
    dice: Dice | null; //if dice === null, dice not rolled yet 
};
 
export type move = {
    state: GameState
    from: number
    die: number
}

export type BotAction = {
    from: number; //-1 represents moving from the bar
    die: number;
}