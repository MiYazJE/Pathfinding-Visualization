const PriorityQueue = require('js-priority-queue');
import State from '../DataStructures/State';

const sleep = (time) => new Promise(res => setTimeout(res, time));

export default class Dijkstra {

    constructor(maze, updateMaze) {
        this.maze = maze;
        this.updateMaze = updateMaze;
    }

    async start(start, final, sleepTime) {

        const q = new PriorityQueue({
            comparator: (a, b) => a.weight - b.weight,
            strategy: PriorityQueue.ArrayStrategy
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
            if (this.maze[i][j].visited || this.maze[i][j].isWall || current.weight > this.maze[i][j].weight)
                continue;

            this.maze[i][j].visited = true;
            this.maze[i][j].animate = true;
            this.updateMaze(this.maze)
            await sleep(sleepTime)
            this.maze[i][j].animate = false;

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

        if (found) 
            this.printPath(final, sleepTime);

    }

    getRowAndColIndex = (index) => {
		return [parseInt(index / this.maze.length), parseInt(index % this.maze.length)];
	}

    printPath = async (final, sleepTime) => {

		let currentIndex = final;

		while (true) {
			const [i, j] = this.getRowAndColIndex(currentIndex);
            this.maze[i][j].animate = true;
            this.maze[i][j].isCamino = true;
            this.updateMaze(this.maze);
            await sleep(sleepTime);
			if (this.maze[i][j].parent === null) break;
			currentIndex = this.maze[i][j].parent.index;
		}

	}

}