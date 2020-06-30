import PriorityQueue from 'js-priority-queue';
import State from '../DataStructures/State';

export default class Dijkstra {
    constructor(maze) {
        this.maze = maze;
        console.log(maze[0]);
    }

    start(start, final) {
        const path = new PriorityQueue({
            strategy: PriorityQueue.ArrayStrategy,
        });;
        const finalState = { path };
        
        const q = new PriorityQueue({
            comparator: (a, b) => a.weight - b.weight,
            strategy: PriorityQueue.ArrayStrategy,
        });
        const distances = new Array(this.maze.length * this.maze[0].length).fill(Number.MAX_VALUE);
        q.queue(new State(start, 0));
        distances[start] = 0;

        let found = false;

        while (q.length !== 0) {
            let current = q.dequeue();

            if (current.indexNode === final) {
                found = true;
                break;
            }

            const [i, j] = this.getRowAndColIndex(current.indexNode);
            if (this.maze[i][j].visited || this.maze[i][j].isWall || current.weight > this.maze[i][j].weight) continue;

            this.maze[i][j].visited = true;
            path.queue({ i, j , event: 'visited' });

            for (let row = -1; row <= 1; row++) {
                for (let col = -1; col <= 1; col++) {
                    // Prevent diagonal cells to explore
                    if (Math.abs(row + col) !== 1) continue;

                    let y = i + row;
                    let x = j + col;

                    if (y < 0 || x < 0 || y >= this.maze.length || x >= this.maze[0].length || this.maze[y][x].visited)
                        continue;

                    let potentialWeight = current.weight + this.maze[y][x].weight + 1;
                    if (potentialWeight < distances[this.maze[y][x].index]) {
                        let indexAdyacentCell = y * this.maze.length + x;
                        q.queue(new State(indexAdyacentCell, potentialWeight));
                        this.maze[y][x].weight = potentialWeight;
                        this.maze[y][x].parent = this.maze[i][j];
                        distances[this.maze[y][x].index] = potentialWeight;
                    }
                }
            }
        }

        finalState.found = found;
        if (found) this.printPath(final, path);
        return finalState;
    }

    getRowAndColIndex = (index) => {
        return [parseInt(index / this.maze.length), parseInt(index % this.maze.length)];
    };

    printPath =  (final, pathHistory) => {
        let currentIndex = final;

        while (true) {
            const [i, j] = this.getRowAndColIndex(currentIndex);
            this.maze[i][j].animate = true;
            this.maze[i][j].isCamino = true;
            if (this.maze[i][j].parent === null) break;
            currentIndex = this.maze[i][j].parent.index;
            pathHistory.queue({ i, j, event: 'backtrack' });
        }
    };
}
