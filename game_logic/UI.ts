import {GameState, Point} from "./types";

function pad_center(text: string, width: number): string {
    const total = width - text.length;
    const left = Math.floor(total / 2);
    const right = total - left;
    return " ".repeat(left) + text + " ".repeat(right); 
}
function render_number_row(numbers: Array<number>): string {
    const left = numbers.slice(0, 6);
    const right = numbers.slice(6);
    const left_part = left 
                    .map(n => pad_center(n.toString(), 4))
                    .join("");
    const right_part = right 
                    .map(n => pad_center(n.toString(), 4))
                    .join("");
    return ` ${left_part}  ${right_part} `;
}
// Render multiple vertical levels
function render_rows(points: Array<Point>, index: Array<number>,
                     max_height: number, top: boolean): Array<string> {
    const rows: Array<string> = [];

    if (top) {
        for (let level = max_height; level >= 1; level--) {
            rows.push(render_level(points, index, level));
        }
    } else {
        for (let level = 1; level <= max_height; level++) {
            rows.push(render_level(points, index, level));
        }
    }
    return rows;
}

// Render one horizontal row 
function render_level(point: Array<Point>, index: Array<number>,
                      level: number): string { 
    const left = index.slice(0, 6);
    const right = index.slice(6);
    const left_part = left
                    .map(i => render_cell(point[i], level))
                    .join("|");
    const right_part = right
                    .map(i => render_cell(point[i], level))
                    .join("|");
    
    return `|${left_part}||${right_part}|`;
}

// Render one cell at a certain stack level
function render_cell(point: Point, level: number): string {
    const player = point.player;
    const count = point.count;

    if (count >= level && player === "white") {
        return " W ";
    } else {}

    if (count >= level && player === "black") {
        return " B ";
    }
    return "   ";
}

// Compute the tallest stack on the board 
function max_stack_height(points: Array<Point>): number {
    return Math.max(...points.map(p => p.count));
}

function render_header_top(): string {
    const numbers = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    return render_number_row(numbers);
}

function render_separator(): string {
    const sample_row =
        "|" + 
        "   |".repeat(5) + 
        "   ||" + 
        "   |".repeat(5) + 
        "   |";

    return "-".repeat(sample_row.length);
}

function render_header_bottom(): string {
    const numbers = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    return render_number_row(numbers);
}

// Text section bar underneath the board
function render_status(state: GameState): string {
    const dice_text = state.dice === null 
                      ? "Not Rolled"
                      : state.dice.values.join(", ");
    
    return [`Current player: ${state.current_player}`,
            `Dice: ${dice_text}`,
            `Bar: white:${state.board.bar.white}`, 
            `    black:${state.board.bar.black}`,
            `Off: white:${state.board.borne_off.white}`,
            `    black:${state.board.borne_off.black}`
    ].join("\n");
}

// render GameState to a gameboard 
export function render_board(state: GameState): string {
    const points = state.board.points;
    const max_height = max_stack_height(points);

    const top_index = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const bottom_index = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

    const top_rows = render_rows(points, top_index, max_height, true);
    const bottom_rows = render_rows(points, bottom_index, max_height, false);

    return [render_header_top(), ...top_rows, render_separator(),
            ...bottom_rows, render_header_bottom(),
            "", render_status(state)
    ].join("\n");
}