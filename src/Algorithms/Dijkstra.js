import PriorityQueue from 'js-priority-queue';
import State from '../DataStructures/State';
import { CELL_TYPES } from '../config';

export default class Dijkstra {
    constructor(maze) {
        this.maze = maze;
    }

    start(start, [finalI, finalJ]) {
        const path = new PriorityQueue({
            strategy: PriorityQueue.ArrayStrategy,
        });

        const q = new PriorityQueue({
            comparator: (a, b) => a.weight - b.weight,
            strategy: PriorityQueue.ArrayStrategy,
        });
        const distances = new Array(
            this.maze.length * this.maze[0].length,
        ).fill(Number.MAX_VALUE);
        q.queue(new State(start, 0));
        distances[start.i * this.maze.length + start.x] = 0;

        let found = false;

        while (q.length !== 0) {
            let current = q.dequeue();
            const { i, j } = current;

            if (i === finalI && j === finalJ) {
                found = true;
                break;
            }

            if (
                this.maze[i][j].visited ||
                this.maze[i][j].cellType === CELL_TYPES.WALL ||
                current.weight > this.maze[i][j].weight
            )
                continue;

            this.maze[i][j].visited = true;
            path.queue({ i, j, event: CELL_TYPES.VISITED });

            for (let row = -1; row <= 1; row++) {
                for (let col = -1; col <= 1; col++) {
                    // Prevent diagonal cells to explore
                    if (Math.abs(row + col) !== 1) continue;

                    let y = i + row;
                    let x = j + col;

                    if (
                        y < 0 ||
                        x < 0 ||
                        y >= this.maze.length ||
                        x >= this.maze[0].length ||
                        this.maze[y][x].visited
                    )
                        continue;

                    let indexAdyacentCell = y * this.maze[0].length + x;
                    let potentialWeight =
                        current.weight + this.maze[y][x].weight + 1;
                    if (potentialWeight < distances[indexAdyacentCell]) {
                        q.queue(new State([y, x], potentialWeight));
                        this.maze[y][x].weight = potentialWeight;
                        this.maze[y][x].parent = this.maze[i][j];
                        distances[indexAdyacentCell] = potentialWeight;
                    }
                }
            }
        }

        if (found) this.printPath([finalI, finalJ], path);
        return { path, found };
    }

    printPath = (currentCordinates, pathHistory) => {
        while (true) {
            const [i, j] = currentCordinates;
            if (this.maze[i][j].parent === null) break;
            currentCordinates = this.maze[i][j].parent.cordinates;
            pathHistory.queue({ i, j, event: CELL_TYPES.BACKTRACK });
        }
    };
}
