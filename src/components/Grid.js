import React, {
    useEffect,
    useState,
    useRef
} from 'react';
import MazeCreator from '../Algorithms/MazeCreator';
import Dijkstra from '../Algorithms/Dijkstra';
import { toast } from 'react-toastify';
import Astar from '../Algorithms/Astar';
import Maze from './Maze';
import MazeControls from './MazeControls';
import { CELL_HEIGHT, CELL_WIDTH, SLEEP_TIME, INITIAL_CELL_CONF, CELL_TYPES } from '../config';

let rowCells, colCells;

const sleep = (time) => new Promise((res) => setTimeout(res, time));

const Grid = () => {
    const [mazeMemo, setMazeMemo] = useState([]);
    const [cellTypeSelected, setCellTypeSelected] = useState(CELL_TYPES.INITIAL);
    const [indexInitialCell, setIndexInitialCell] = useState([]);
    const [indexFinalCell, setIndexFinalCell] = useState([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isCreatingMaze, setIsCreatingMaze] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);
    const refWrapGrid = useRef();

    useEffect(() => {
        const { height, width } = refWrapGrid.current.getBoundingClientRect();
        rowCells = parseInt((height / CELL_WIDTH) * 0.9);
        if (rowCells % 2 === 0) rowCells--;
        colCells = parseInt(width / CELL_HEIGHT);
        if (colCells % 2 === 0) colCells--;
    }, []);

    useEffect(() => {
        const initialMaze = [];
        for (let i = 0; i < rowCells; i++) {
            initialMaze[i] = [];
            for (let j = 0; j < colCells; j++) {
                const index = i * colCells + j;
                initialMaze[i].push({
                    ...INITIAL_CELL_CONF,
                    cordinates: [i, j],
                    index,
                });
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
                if (
                    mazeMemo[i][j].cellType !== CELL_TYPES.WALL &&
                    !mazeMemo[i][j].initial &&
                    !mazeMemo[i][j].final
                ) {
                    mazeMemo[i][j] = {
                        ...mazeMemo[i][j],
                        ...INITIAL_CELL_CONF,
                    };
                }
            }
        }
        setMazeMemo([...mazeMemo]);
    };
    
    const clearAll = () => {
        if (isExecuting || isCreatingMaze) {
            toast.error('Can not do this right now.');
            return;
        }
    
        for (let i = 0; i < mazeMemo.length; i++) {
            for (let j = 0; j < mazeMemo[i].length; j++) {
                mazeMemo[i][j] = {
                    ...mazeMemo[i][j],
                    ...INITIAL_CELL_CONF,
                };
            }
        }
        
        setIndexInitialCell([]);
        setIndexFinalCell([]);
    };

    const handleClickCell = (cordinates) => {
        console.log(cordinates, indexInitialCell)
        if (isExecuting || isCreatingMaze) return;
        const [i, j] = cordinates;
        setMouseDown(true);

        if (cellTypeSelected === CELL_TYPES.INITIAL) {
            if (indexInitialCell.length) {
                const [row, col] = indexInitialCell;
                mazeMemo[row][col] = { ...mazeMemo[row][col], ...INITIAL_CELL_CONF };
            }
            setIndexInitialCell(cordinates);
            mazeMemo[i][j].initial = true;
        } 
        else if (cellTypeSelected === CELL_TYPES.FINAL) {
            if (indexFinalCell.length) {
                const [row, col] = indexFinalCell;
                mazeMemo[row][col] = {  ...mazeMemo[row][col], ...INITIAL_CELL_CONF };
            }
            setIndexFinalCell(cordinates);
            mazeMemo[i][j].final = true;
        }

        mazeMemo[i][j].cellType = cellTypeSelected;
        setMazeMemo([...mazeMemo]);
    }

    const handleMouseMove = (cordinates) => {
        if (mouseDown) {
            handleClickCell(cordinates);
        }
    }

    const handleMouseUp = () => {
        setMouseDown(false);
    }

    const animatePath = async (path, timeSleep = SLEEP_TIME) => {
        while (path.length !== 0) {
            const { i, j, event, fastSleep } = path.dequeue();
            mazeMemo[i][j].cellType = event;
            setMazeMemo([...mazeMemo])
            if (!fastSleep) await sleep(timeSleep);
        }
    };

    const createMazeDfs = async () => {
        if (isCreatingMaze) {
            toast.error('You already start a maze creation!');
            return;
        }
        setIsCreatingMaze(true);
        clearAll();
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

        clearAll();
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
                    Please set them and try again.`,
            );
            return;
        }

        toast.info('Starting dikjstra algorithm...');
        setIsExecuting(true);

        const { path, found } = new Dijkstra(mazeMemo).start(
            indexInitialCell,
            indexFinalCell,
        );
        await animatePath(path, SLEEP_TIME);
        if (found) toast.success('🚀 The maze has been resolved!');
        else toast.error('The maze has not been resolved!');
        setIsExecuting(false);
    };

    const startAstar = async () => {
        if (!indexInitialCell.length || !indexFinalCell.length) {
            toast.error(
                `Can not start the algorithm without initial and final cells not being established!
                    Please set them and try again.`,
            );
            return;
        }

        toast.info('Starting Astar...');
        setIsExecuting(true);

        const { path, found } = new Astar(mazeMemo).start(
            indexInitialCell,
            indexFinalCell,
        );
        await animatePath(path);
        if (found) toast.success('🚀 The maze has been resolved!');
        else toast.error('The maze has not been resolved!');
        setIsExecuting(false);
    };

    console.log('grid render')
    return (
        <>
            <MazeControls
                createMazeDfs={createMazeDfs}
                createMazeBacktracking={createMazeBacktracking}
                clearGrid={clearGrid}
                startDijkstra={startDijkstra}
                startAstart={startAstar}
                clearAll={clearAll}
                setCellTypeSelected={setCellTypeSelected}
            />
            <div className="wrap-grid" ref={refWrapGrid}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateRows: `repeat(${parseInt(
                            rowCells,
                        )}, ${CELL_WIDTH}px)`,
                        gridTemplateColumns: `repeat(${parseInt(
                            colCells,
                        )}, ${CELL_HEIGHT}px)`,
                    }}
                    className="Grid"
                >
                    <Maze 
                        maze={[...mazeMemo]} 
                        handleClickCell={handleClickCell} 
                        handleMouseMove={handleMouseMove} 
                        handleMouseUp={handleMouseUp}
                    />
                </div>
            </div>
        </>
    );
};

export default Grid;
