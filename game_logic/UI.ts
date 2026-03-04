import {GameState, Point} from "./types";


/**
 * Centers a given text string within a fixed width by adding spaces
 * to the left and right of the text.
 *
 * This function is used for formatting output in the terminal UI,
 * ensuring that text appears visually centered within a column.
 *
 * @example
 * pad_center("5", 3)
 * // Returns " 5 "
 *
 * pad_center("BAR", 7)
 * // Returns "  BAR  "
 *
 * @param text The string to center.
 * @param width The total width of the resulting string.
 *
 * @precondition
 * - width must be greater than or equal to text.length.
 *
 * @complexity
 * Time: O(n), where n = width.
 * Space: O(n), since a new padded string is created.
 *
 * @returns
 * A new string of length `width` with `text` centered using spaces.
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
 *
 * @example
 * render_number_row([1,2,3,4,5,6,7,8,9,10,11,12])
 * // Returns a formatted string displaying two groups of numbers
 * // aligned as board columns.
 *
 * @param numbers An array of 12 numbers representing board point indices.
 *
 * @precondition
 * - numbers must contain exactly 12 elements.
 * - pad_center() must correctly center text within the given width.
 *
 * @complexity
 * Time: O(n), where n = numbers.length (typically 12).
 * Space: O(n), since a formatted string is constructed.
 *
 * @returns
 * A formatted string representing a row of board point numbers,
 * ready to be printed in the terminal board layout.
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
 *
 * @example
 * const topRows = render_rows(points, top_indices, 5, true);
 * // Produces 5 strings representing the top half of the board.
 *
 * const bottomRows = render_rows(points, bottom_indices, 5, false);
 * // Produces 5 strings representing the bottom half of the board.
 *
 * @param points The board points array (length 24).
 * @param index An array of point indices (typically length 12) specifying
 *              which points to render in this half.
 * @param max_height The number of vertical levels to render.
 * @param top If true, render from top down; if false, render from bottom up.
 *
 * @precondition
 * - points must contain exactly 24 Point objects.
 * - index must contain valid point indices (0–23).
 * - max_height must be >= 1.
 * - render_level() must correctly render a single level as a string.
 *
 * @complexity
 * Time: O(max_height * k), where k = index.length (typically 12),
 * since render_level() is called once per level.
 * Space: O(max_height), to store the produced row strings.
 *
 * @returns
 * An array of strings, where each string is one rendered row of the UI.
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
 *
 * @example
 * render_level(points, [0,1,2,3,4,5,6,7,8,9,10,11], 2)
 * // Returns a formatted string showing stones visible at level 2.
 *
 * @param point The array of board points (length 24).
 * @param index An array of point indices defining the board row to render
 *              (typically 12 indices).
 * @param level The vertical level currently being rendered.
 *
 * @precondition
 * - point must contain 24 Point objects.
 * - index must contain valid indices within [0, 23].
 * - level must be >= 1.
 * - render_cell() must correctly return the visual representation
 *   of a point at the given level.
 *
 * @complexity
 * Time: O(k), where k = index.length (typically 12).
 * Space: O(k), due to string construction.
 *
 * @returns
 * A formatted string representing one horizontal row of the board.
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
 *
 * @example
 * render_cell({player: "white", count: 3}, 2)
 * // Returns " W "
 *
 * render_cell({player: "black", count: 1}, 2)
 * // Returns "   " (no stone visible at that level)
 *
 * @param point The board point containing information about the
 *              owning player and number of stones.
 * @param level The vertical level currently being rendered.
 *
 * @precondition
 * - level must be ≥ 1.
 * - point.count must be ≥ 0.
 * - point.player is either "white", "black", or null.
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 *
 * @returns
 * A fixed-width string representing the cell content:
 * - `" W "` if a white stone is present at this level
 * - `" B "` if a black stone is present at this level
 * - `"   "` if the cell is empty at this level
 */
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


/**
 * Computes the maximum stack height among all points on the board.
 *
 * The function scans all board points and finds the largest number
 * of stones stacked on any single point. This value is used when
 * rendering the board UI to determine how many vertical levels
 * must be displayed.
 *
 * @example
 * max_stack_height([
 *   {player: "white", count: 2},
 *   {player: null, count: 0},
 *   {player: "black", count: 5}
 * ])
 * // Returns 5
 *
 * @param points An array of board points containing player ownership
 *               and stone counts (typically length 24).
 *
 * @precondition
 * - points must contain valid Point objects.
 * - point.count must be ≥ 0 for all points.
 *
 * @complexity
 * Time: O(n), where n = points.length (typically 24).
 * Space: O(n), due to creation of a temporary array by map().
 *
 * @returns
 * The largest stone count found on any board point.
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
 *
 * @example
 * render_header_top()
 * // Returns a formatted string displaying:
 * // 13 14 15 16 17 18   19 20 21 22 23 24
 *
 * @param
 * This function takes no parameters.
 *
 * @precondition
 * - render_number_row() must correctly format an array of 12 numbers.
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 *
 * @returns
 * A formatted string representing the top board header with point
 * numbers 13–24 for the terminal board layout.
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
 *
 * @example
 * render_separator()
 * // Returns a string of '-' characters matching the board width
 *
 * @param
 * This function takes no parameters.
 *
 * @precondition
 * - The board row format must follow the same structure used
 *   by render_level() so that the separator width matches.
 *
 * @complexity
 * Time: O(n), where n is the width of the board row.
 * Space: O(n), since a string of length n is created.
 *
 * @returns
 * A string consisting of '-' characters that spans the full
 * width of the rendered board.
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
 *
 * @example
 * render_header_bottom()
 * // Returns a formatted string displaying:
 * // 12 11 10  9  8  7   6  5  4  3  2  1
 *
 * @param
 * This function takes no parameters.
 *
 * @precondition
 * - render_number_row() must correctly format an array of 12 numbers.
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 *
 * @returns
 * A formatted string representing the bottom board header with
 * point numbers 12–1 for the terminal board layout.
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
 *
 * @example
 * render_status(state)
 * // Returns a string like:
 * // Current player: white
 * // Dice: 3, 5
 * // Bar: white:0
 * //      black:1
 * // Off: white:2
 * //      black:0
 *
 * @param state The current GameState containing board status,
 *              dice values, and the active player.
 *
 * @precondition
 * - state must be a valid GameState object.
 * - state.board must contain valid bar and borne_off values.
 *
 * @complexity
 * Time: O(1)
 * Space: O(1)
 * 
 * @returns
 * A formatted multi-line string describing the current
 * state of the game.
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
 *
 * @example
 * console.log(render_board(state));
 *
 * @param state The current GameState containing board layout,
 *              dice values, and the active player.
 *
 * @precondition
 * - state must be a valid GameState object.
 * - state.board.points must contain exactly 24 points.
 * - Helper functions (render_rows, render_header_top,
 *   render_header_bottom, render_separator, render_status)
 *   must return correctly formatted strings.
 *
 * @complexity
 * Time: O(h * n), where
 * - h = max stack height on the board
 * - n = number of points rendered per row (12)
 *
 * Space: O(h), due to storing generated row strings.
 *
 * @returns
 * A multi-line string representing the full backgammon board
 * and the current game status.
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