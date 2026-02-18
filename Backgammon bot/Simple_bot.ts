type Player = "white" | "black";

/**
 * Triangles on the board
 * Invariant: count >= 0
 * if count === 0 -> owner === null
 */
type Point = {
    player: Player | null;
    count: number;
};

/**
 * length is 2, 4 if doubles
 * Value between 1-6
 */
type Dice = {
    values: number[];
};

type Board = {
    points: Point[]; //length 24
    bar: Record<Player, number>;
    borne_off: Record<Player, number>;
}

type GameState = {
    board: Board;
    current_player: Player;
    dice: Dice | null; //if dice === null, dice not rolled yet 
}


function make_move(game: GameState) null {
    const player = game.current_player
    for (let i = 23; i = 0; i--){
        if current_player
    }
}