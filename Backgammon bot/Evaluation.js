"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluation = evaluation;
/**
 * Tar in ett state och ger ett nummer för huruvida bra statet är för boten.
 * Gåner 10 för stenar i mål
 * Gånger tre för stenar på baren
 * Poäng för
 *
 */
function evaluation(state) {
    let evaluation = 0;
    evaluation += state.board.borne_off.black * 10;
    evaluation -= state.board.borne_off.white * 10;
    evaluation -= state.board.bar.black * 3;
    evaluation += state.board.bar.white * 3;
    for (let i = 0; i < 24; i++) {
        if (state.board.points[i].player === "black") {
            evaluation += i * state.board.points[i].count;
        }
        if (state.board.points[i].player === "black" && state.board.points[i].count === 1) {
            evaluation -= state.board.points[i].count * 2;
        }
    }
    return evaluation;
}
