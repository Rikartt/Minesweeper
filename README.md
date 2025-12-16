# Minesweeper

# Roadmap (not kept up with from start)

Starting point: Grid mechanics and controls are pretty much finalized.
-   [ ] Make GameState updater
    -   [X] Started, but not finished, now reads the uncovered safe tiles at least
    -   [X] Implement for the other winning/losing factors
        -   [X] Implemented a won/lost variable that makes it so that uncovering is locked. They get activated by uncovering every non-mine and uncovering a mine respectively.
-   [ ] 