# Minesweeper

# Roadmap (not kept up with from start)

Starting point: Grid mechanics and controls are pretty much finalized.
-   [ ] Make GameState updater
    -   [X] Started, but not finished, now reads the uncovered safe tiles at least
    -   [X] Implement for the other winning/losing factors
        -   [X] Implemented a won/lost variable that makes it so that uncovering is locked. They get activated by uncovering every non-mine and uncovering a mine respectively.
        -   [X] Player should be able to place flags where he or she thinks there's a mine to be uncovered. This on rght click
        -   [ ] When uncovering a "zero tile", so a tile without any surrounding minetiles, uncover all surrounding tiles, and if they're zeros, uncover their surrounding tiles as well.
        -   [ ] Uncovered tiles shouldn't be able to be covered again
-   [ ] Rewrite game generation logic so that mines are placed after the first click so that a player can't uncover a mine as a first tile.