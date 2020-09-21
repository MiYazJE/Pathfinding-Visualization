import PriorityQueue from 'js-priority-queue';
import { CELL_TYPES } from '../config';

const directions = [
    { i: -1, j: 0 },
    { i: 1, j: 0 },
    { i: 0, j: 1 },
    { i: 0, j: -1 },
];

export default class Astar {
    constructor(maze) {
        this.maze = maze;
    }

    start([startI, startJ], final) {
        const [finalI, finalJ] = final;
        let found = false;
        const path = new PriorityQueue({
            strategy: PriorityQueue.ArrayStrategy,
        });
        const q = new PriorityQueue({
            comparator: (a, b) => a.fCost - b.fCost,
            strategy: PriorityQueue.ArrayStrategy,
        });
        q.queue({ i: startI, j: startJ, fCost: 0, gCost: 0, hCost: 0 });

        while (q.length !== 0 && !found) {
            const current = q.dequeue();
            this.maze[current.i][current.j].visited = true;

            for (const direction of directions) {
                const [exploreI, exploreJ] = [current.i + direction.i, current.j + direction.j];
                if (
                    exploreI < 0 ||
                    exploreJ < 0 ||
                    exploreI === this.maze.length ||
                    exploreJ === this.maze[0].length ||
                    this.maze[exploreI][exploreJ].cellType === CELL_TYPES.WALL ||
                    this.maze[exploreI][exploreJ].visited
                ) {
                    continue;
                }

                if (exploreI === finalI && exploreJ === finalJ) {
                    this.maze[finalI][finalJ].parent = this.maze[current.i][current.j];
                    found = true;
                    break;
                }

                const gCost = current.gCost + 10;
                const hCost = (Math.abs(exploreI - finalI) + Math.abs(exploreJ - finalJ)) * 10;
                const fCost = gCost + hCost;

                if (
                    this.maze[exploreI][exploreJ].parent === null ||
                    (fCost < this.maze[exploreI][exploreJ].fCost && 
                    hCost <= this.maze[exploreI][exploreJ].fCost)
                ) {
                    this.maze[exploreI][exploreJ] = {
                        ...this.maze[exploreI][exploreJ],
                        gCost,
                        hCost,
                        fCost,
                        parent: { ...this.maze[current.i][current.j] },
                    };
                    if (!this.maze[exploreI][exploreJ].visited) {
                        q.queue({ i: exploreI, j: exploreJ, gCost, hCost, fCost });
                        path.queue({ i: exploreI, j: exploreJ, event: CELL_TYPES.VISITED });
                    }
                }
            }
        }

        if (found) {
            let currentCordinates = final;
            while (true) {
                const [i, j] = currentCordinates;
                if (this.maze[i][j].parent === null) break;
                currentCordinates = this.maze[i][j].parent.cordinates;
                path.queue({ i, j, event: CELL_TYPES.BACKTRACK });
            }
        }

        return { path, found };
    }
}
