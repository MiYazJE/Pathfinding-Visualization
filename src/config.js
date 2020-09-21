const CELL_HEIGHT = 20;
const CELL_WIDTH  = 20;
const SLEEP_TIME  = 30;

const OPEN      = 0;
const WALL      = 1;
const VISITED   = 2;
const INITIAL   = 3;
const FINAL     = 4;
const BACKTRACK = 5;

const CELL_TYPES = {
    OPEN,
    WALL,
    VISITED,
    INITIAL,
    FINAL,
    BACKTRACK
};

const CONTROLS_MESSAGES = {
    [INITIAL]: 'Initial cells selected',
    [FINAL]: 'Final cells selected',
    [WALL]: 'Wall cells selected',
    [OPEN]: 'Clear cells selected'
}; 

const INITIAL_CELL_CONF = {
    cellType: CELL_TYPES.OPEN,
    parent: null,
    weight: 0,
    animate: true,
    final: false,
    initial: false,
    visited: false,
    fCost: 0,
    gCost: 0,
    hCost: 0
};

export {
    CELL_HEIGHT,
    CELL_WIDTH,
    SLEEP_TIME,
    INITIAL_CELL_CONF,
    CELL_TYPES,
    CONTROLS_MESSAGES
};