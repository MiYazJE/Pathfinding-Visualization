import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import Cell from './Cell';
import MazeCreator from '../Algorithms/MazeCreator';
import Dijkstra from '../Algorithms/Dijkstra';
import { toast } from 'react-toastify';
import CELL_TYPES from '../cellTypes';
import Astar from '../Algorithms/Astar';

const CELL_HEIGHT = 20;
const CELL_WIDTH = 20;
const SLEEP_TIME = 30;
let rowCells, colCells;

const INITIAL_CELL_CONF = {
    cellType: CELL_TYPES.OPEN,
    parent: null,
    weight: 0,
    animate: true,
    final: false,
    initial: false,
    fCost: 0,
    gCost: 0,
    hCost: 0
};

const sleep = (time) => new Promise((res) => setTimeout(res, time));

const Grid = forwardRef(({ cellTypeSelected }, ref) => {
    const [mazeMemo, setMazeMemo] = useState([]);
    const [indexInitialCell, setIndexInitialCell] = useState([]);
    const [indexFinalCell, setIndexFinalCell] = useState([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isCreatingMaze, setIsCreatingMaze] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);
    const refWrapGrid = useRef();

    useEffect(() => {
        const { height, width } = refWrapGrid.current.getBoundingClientRect();
        rowCells = parseInt((height / CELL_WIDTH) * 0.9);
        if (rowCells % 2 == 0) rowCells--;
        colCells = parseInt(width / CELL_HEIGHT);
        if (colCells % 2 == 0) colCells--;
    }, []);

    useEffect(() => {
        console.log('initial maze');
        const initialMaze = [];
        for (let i = 0; i < rowCells; i++) {
            initialMaze[i] = [];
            for (let j = 0; j < colCells; j++) {
                const index = i * colCells + j;
                initialMaze[i].push({ ...INITIAL_CELL_CONF, cordinates: [i, j], index });
            }
        }
        setMazeMemo([...initialMaze]);
    }, []);

    const clearGrid = () => {
        if (isExecuting || isCreatingMaze) {
            toast.error('Can not do this right now.');
            return;
        }

        for (let i = 0; i < mazeMemo.length; i++) {
            for (let j = 0; j < mazeMemo[i].length; j++) {
                mazeMemo[i][j] = { ...mazeMemo[i][j], ...INITIAL_CELL_CONF };
            }
        }

        setIndexInitialCell([]);
        setIndexFinalCell([]);
        setMazeMemo([...mazeMemo]);
    };

    const handleClickCell = (cordinates) => {
        if (isExecuting || isCreatingMaze) return;
        const [i, j] = cordinates;
        setMouseDown(true);

        if (cellTypeSelected === CELL_TYPES.INITIAL) {
            clearActualInitialCell();
            setIndexInitialCell(cordinates);
            mazeMemo[i][j].initial = true;
        } else if (cellTypeSelected === CELL_TYPES.FINAL) {
            clearActualFinalCell();
            setIndexFinalCell(cordinates);
            mazeMemo[i][j].final = true;
        }

        mazeMemo[i][j] = { ...mazeMemo[i][j], cellType: cellTypeSelected };
        setMazeMemo([...mazeMemo]);
    };

    const clearActualInitialCell = () => {
        if (indexInitialCell.length) {
            const [row, col] = indexInitialCell;
            mazeMemo[row][col] = { ...mazeMemo[row][col], ...INITIAL_CELL_CONF };
        }
    };

    const clearActualFinalCell = () => {
        if (indexFinalCell.length) {
            const [row, col] = indexFinalCell;
            mazeMemo[row][col] = { ...mazeMemo[row][col], ...INITIAL_CELL_CONF };
        }
    };

    const handleMouseMove = (cordinates) => {
        if (mouseDown) {
            handleClickCell(cordinates);
        }
    };

    const handleMouseUp = () => {
        setMouseDown(false);
    };

    const createMazeDfs = async () => {
        if (isCreatingMaze) {
            toast.error('You already start a maze creation!');
            return;
        }
        setIsCreatingMaze(true);
        clearGrid();
        const creator = new MazeCreator(mazeMemo);

        const path = creator.makeMazeDfs();
        await animatePath(path, 10);
        toast.success('🚀 Maze created!');
        setIsCreatingMaze(false);
    };

    const createMazeBacktracking = async () => {
        if (isCreatingMaze) {
            toast.error('You already start a maze creation!');
            return;
        }

        clearGrid();
        setIsCreatingMaze(true);
        const creator = new MazeCreator(mazeMemo);
        const path = creator.makeMazeBacktracking();
        await animatePath(path, SLEEP_TIME);
        toast.success('🚀 Maze created!');
        setIsCreatingMaze(false);
    };

    const startDijkstra = async () => {
        if (!indexInitialCell.length || !indexFinalCell.length) {
            toast.error(
                `Can not start the algorithm without initial and final cells not being established!
                    Please set them and try again.`
            );
            return;
        }

        toast.info('Starting dikjstra algorithm...');
        setIsExecuting(true);

        const { path, found } = new Dijkstra(mazeMemo).start(indexInitialCell, indexFinalCell);
        await animatePath(path, SLEEP_TIME);
        if (found) toast.success('🚀 The maze has been resolved!');
        else toast.error('The maze has not been resolved!');
        setIsExecuting(false);
    };

    const startAstar = async () => {
        if (!indexInitialCell.length || !indexFinalCell.length) {
            toast.error(
                `Can not start the algorithm without initial and final cells not being established!
                    Please set them and try again.`
            );
            return;
        }

        toast.info('Starting Astar...');
        setIsExecuting(true);
        
        const { path, found } = new Astar(mazeMemo).start(indexInitialCell, indexFinalCell);
        await animatePath(path);
        if (found) toast.success('🚀 The maze has been resolved!');
        else toast.error('The maze has not been resolved!');
        setIsExecuting(false);
    }

    const animatePath = async (path, timeSleep = SLEEP_TIME) => {
        while (path.length !== 0) {
            const { i, j, event, fastSleep } = path.dequeue();
            mazeMemo[i][j].cellType = event;
            setMazeMemo([...mazeMemo]);
            if (!fastSleep) await sleep(timeSleep);
        }
    };

    useImperativeHandle(ref, () => ({
        clearGrid,
        createMazeDfs,
        createMazeBacktracking,
        startDijkstra,
        startAstar
    }));

    return (
        <div className="wrap-grid" ref={refWrapGrid}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${parseInt(rowCells)}, ${CELL_WIDTH}px)`,
                    gridTemplateColumns: `repeat(${parseInt(colCells)}, ${CELL_HEIGHT}px)`,
                }}
                className="Grid"
            >
                {mazeMemo.map((row) =>
                    row.map((node) => (
                        <Cell
                            key={node.index}
                            {...node}
                            onClick={handleClickCell}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

export default React.memo(Grid);
