import { GameState, Point } from "./types";

// THIS MODULE IS 100% CREATED BY AI (CHATGPT). WE WANTED A VISUAL
// REPRESENTATION OF OUR GAME, AND DID NOT WANT TO TAKE TIME 
// OUT OF DEVELOPING THE BOT TO IMPLEMENT AN AI, SINCE THIS WILL NOT 
// BE GRADED. THIS HAS BEEN APPROVED OF ALL GROUP MEMBERS. 

/**
 * Centers a given text string within a fixed width by adding spaces
 * to the left and right of the text.
 *
 * This function is used for formatting output in the terminal UI,
 * ensuring that text appears visually centered within a column.
 */
function pad_center(text: string, width: number): string {
    const total = width - text.length;
    const left = Math.floor(total / 2);
    const right = total - left;
    return " ".repeat(left) + text + " ".repeat(right); 
}

/**
 * Renders a formatted row of board numbers for the terminal UI.
 *
 * The function splits the given list of numbers into two groups of six,
 * representing the left and right halves of the backgammon board.
 * Each number is centered within a fixed-width column using pad_center().
 */
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

/**
 * Renders multiple visual rows for one half of the backgammon board
 * in the terminal UI.
 *
 * The board half is defined by an index list (12 point indices).
 * For each vertical level (1..max_height) the function calls render_level()
 * to build a string that represents stones visible at that height.
 *
 * If top === true, rows are rendered from max_height down to 1
 * (top half of the board, drawn from top to bottom).
 * If top === false, rows are rendered from 1 up to max_height
 * (bottom half of the board, drawn from bottom to top).
 */
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

/**
 * Renders one horizontal level of the backgammon board for the terminal UI.
 *
 * The function builds a single row representing stones at a specific
 * vertical level across a set of board points.
 *
 * The given index array is split into two halves (6 + 6) representing the
 * left and right sides of the board separated by the bar. Each point cell
 * is rendered using render_cell().
 */
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

/**
 * Renders a single board cell at a specific vertical stack level
 * for the terminal UI representation of the backgammon board.
 *
 * The function determines whether a stone should be visible at the
 * given stack level. If the point contains at least `level` stones,
 * it renders the stone belonging to the corresponding player.
 * Otherwise an empty cell is rendered.
 */
function render_cell(point: Point, level: number): string {
    const player = point.player;
    const count = point.count;

    if (count >= level && player === "white") {
        return " W ";
    } else {}

    if (count >= level && player === "black") {
        return " B ";
    } else {}
    return "   ";
}

/**
 * Computes the maximum stack height among all points on the board.
 *
 * The function scans all board points and finds the largest number
 * of stones stacked on any single point. This value is used when
 * rendering the board UI to determine how many vertical levels
 * must be displayed.
 */
function max_stack_height(points: Array<Point>): number {
    return Math.max(...points.map(p => p.count));
}

/**
 * Renders the top header row of the backgammon board in the terminal UI.
 *
 * The header displays the point numbers for the upper half of the board
 * (points 13–24). The numbers are formatted and aligned using
 * render_number_row().
 */
function render_header_top(): string {
    const numbers = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    return render_number_row(numbers);
}

/**
 * Renders a horizontal separator line used in the terminal UI
 * representation of the backgammon board.
 *
 * The separator visually divides sections of the board, such as
 * the top and bottom halves. Its length is dynamically computed
 * based on the width of a sample board row to ensure correct alignment.
 */
function render_separator(): string {
    const sample_row =
        "|" + 
        "   |".repeat(5) + 
        "   ||" + 
        "   |".repeat(5) + 
        "   |";

    return "-".repeat(sample_row.length);
}

/**
 * Renders the bottom header row of the backgammon board
 * for the terminal UI.
 *
 * The header displays the point numbers for the lower half
 * of the board (points 12–1). The numbers are formatted and
 * centered using render_number_row() so they align with the
 * board columns.
 */
function render_header_bottom(): string {
    const numbers = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    return render_number_row(numbers);
}

/**
 * Renders the current game status information for display
 * in the terminal UI.
 *
 * The function creates a formatted multi-line string showing
 * the current player, dice values, number of stones on the bar,
 * and number of stones borne off for each player.
 *
 * If the dice have not been rolled yet (state.dice === null),
 * the dice status will display "Not Rolled".
 */
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

/**
 * Renders the complete backgammon board and game status
 * as a formatted string for the terminal UI.
 *
 * The function constructs the full board representation by:
 * 1. Determining the maximum stack height on the board.
 * 2. Rendering the top half of the board (points 13–24).
 * 3. Rendering a separator line between the board halves.
 * 4. Rendering the bottom half of the board (points 12–1).
 * 5. Rendering the current game status (player, dice, bar, borne off).
 *
 * All rows are combined into a multi-line string which can be
 * printed directly to the terminal.
 */
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