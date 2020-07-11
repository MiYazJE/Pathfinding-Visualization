import React, { useState, useRef, useCallback } from 'react';
import Grid from './components/Grid';
import MazeControls from './components/MazeControls';
import { FaGithubAlt } from 'react-icons/fa';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CELL_TYPES from './cellTypes';

const App = () => {
    const [cellTypeSelected, setCellTypeSelected] = useState(CELL_TYPES.INITIAL);
    const [message, setMessage] = useState('Initial cells selected');
    const gridRef = useRef();
    // const refWrapGrid = useRef();

    // useEffect(() => {
    //     const observer = new ResizeObserver((entries, observer) => {
    //         const { width, height } = entries[0].contentRect;
    //         // gridRef.current.resize(Math.min(Math.min(width * 0.9, height * 0.9) / rowCells	));
    //     });
    //     observer.observe(refWrapGrid.current);

    //     return () => observer.unobserve(refWrapGrid.current);
    // }, []);

    const handleControls = (cellType) => {
        console.log(cellType)
        setCellTypeSelected(cellType);
        switch (cellType) {
            case CELL_TYPES.INITIAL: {
                setMessage('Initial cells selected');
                break;
            }
            case CELL_TYPES.FINAL: {
                setMessage('Final cells selected');
                break;
            }
            case CELL_TYPES.WALL: {
                setMessage('Wall cells selected');
                break;
            }
            case CELL_TYPES.OPEN: {
                setMessage('Clear cells selected');
                break;
            }
        }
    };

    console.log('render App');
    return (
        <div className="app">
            <div className="wrap-githubIcon">
                <a
                    href="https://github.com/MiYazJE/PathfindingViewer/"
                    target="_blank"
                    alt="github repository of this proyect"
                    title="See the code!"
                >
                    <FaGithubAlt />
                </a>
            </div>
            <MazeControls
                createMazeDfs={() => gridRef.current.createMazeDfs()}
                createMazeBacktracking={() => gridRef.current.createMazeBacktracking()}
                clearGrid={() => gridRef.current.clearGrid()}
                startDijkstra={() => gridRef.current.startDijkstra()}
                startAstart={() => gridRef.current.startAstar()}
                changeControls={handleControls}
                clearAll={() => gridRef.current.clearAll()}
                message={message}
            />
            <Grid
                ref={gridRef}
                cellTypeSelected={cellTypeSelected}
            />
            <ToastContainer
                style={{ fontSize: '15px' }}
                position="bottom-right"
            />
        </div>
    );
};

export default App;