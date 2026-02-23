import { GameState, Player, Point, Board  } from "./types";


export function starting_board(): GameState {
    const points : Point[] = []
    for (let i = 0; i < 24; i++) {
        points.push({
            player: null,
            count: 0
        });
    } 
    // Ändrar så vita stenar hamnar rätt vid startläge
    points[0] = { player: "white" , count: 2 };
    points[11] = { player: "white", count: 5 };
    points[16] = { player: "white", count: 3 };
    points[18] = { player: "white", count: 5 };
    
    // Ändrar så svarta stenar hamnar rätt vid startläge
    points[23] = { player: "black", count: 2 };
    points[12] = { player: "black", count: 5 };
    points[7] = { player: "black", count: 3 };
    points[5] = { player: "black", count: 5 };

    const board : Board = {
        points: points,
        bar: {"white" : 0, "black" : 0}, 
        borne_off: {"white" : 0, "black" : 0}
    };

    const gamestate : GameState = {
        board: board,
        current_player: "white",
        dice: null
    };
    return gamestate;
}