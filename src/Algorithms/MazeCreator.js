import PriorityQueue from 'js-priority-queue';

const WALL = 1;
const WALL_EVENT = 'wall';
const OPEN_EVENT = 'open';

export default class MazeCreator {
    constructor(maze) {
        this.maze = maze;
        this.dim = maze.length;
        this.path = new PriorityQueue({
            strategy: PriorityQueue.ArrayStrategy,
        });
        this.visitedPath = new Map();
    }

    makeMazeBacktracking = () => {
        const stack = [];
        const directionsI = [-2, 2, 0, 0];
        const directionsJ = [0, 0, 2, -2];
        const midSumI = [-1, 1, 0, 0];
        const midSumJ = [0, 0, 1, -1];

        for (let i = 0; i < this.maze.length; i++) {
            for (let j = 0; j < this.maze[i].length; j++) {
                this.maze[i][j].isWall = true;
                this.path.queue({ i, j, event: WALL_EVENT, fastSleep: true });
            }
        }

        let startI = 2;
        let startJ = 2;
        while (startI % 2 === 0) startI = parseInt(Math.random() * (this.dim - 1));
        while (startJ % 2 === 0) startJ = parseInt(Math.random() * (this.maze[0].length - 1));
        stack.push({ i: startI, j: startJ });
        this.path.queue({ i: startI, j: startJ, event: OPEN_EVENT });
        this.setVisited(startI, startJ);

        while (stack.length !== 0) {
            const neighbors = [];
            const { i, j } = stack.pop();

            for (let index = 0; index < 4; index++) {
                const newI = i + directionsI[index];
                const newJ = j + directionsJ[index];
                const midI = i + midSumI[index];
                const midJ = j + midSumJ[index];
                if (this.validNeighbor(newI, newJ, midI, midJ)) {
                    neighbors.push({ i: newI, j: newJ });
                    this.maze[newI][newJ].isWall = false;
                    this.maze[midI][midJ].isWall = false;
                    const midObject = {
                        i: midI,
                        j: midJ,
                        event: OPEN_EVENT,
                        current: true,
                    }; 
                    const newObject = {
                        i: newI,
                        j: newJ,
                        event: OPEN_EVENT,
                        current: true,
                    };
                    this.path.queue({ ...midObject });
                    this.path.queue({ ...midObject, current: false});
                    this.path.queue({ ...newObject });
                    this.path.queue({ ...newObject, current: false });
                    this.setVisited(newI, newJ);
                }
            }

            if (neighbors.length !== 0) {
                neighbors.sort(() => Math.random() - 0.5);
                let randomIndex = parseInt(Math.random() * neighbors.length);
                neighbors.forEach((neighbor, index) => {
                    if (index !== randomIndex) {
                        stack.push({ ...neighbor });
                    }
                });

                stack.push({ ...neighbors[randomIndex] });
            }
        }

        return this.path;
    };

    setVisited = (i, j) => {
        this.visitedPath.set(i * this.dim + j, true);
    };

    validNeighbor = (i, j, midI, midJ) => {
        return (
            i > 0 &&
            j > 0 &&
            i < this.maze.length - 1 &&
            j < this.maze[i].length - 1 &&
            !this.visitedPath.has(i * this.maze.length + j) &&
            !this.visitedPath.has(midI * this.maze.length + midJ)
        );
    };

    makeMazeDfs = () => {
        let emptyCt = 0;
        const nodesToExplore = [];

        for (let i = 0; i < this.maze.length; i++)
            for (let j = 0; j < this.maze[i].length; j++) {
                this.maze[i][j].value = WALL;
                this.maze[i][j].isWall = true;
                this.addToPath(i, j, WALL_EVENT, true);
            }

        for (let i = 1; i < this.maze.length - 1; i += 2) {
            for (let j = 1; j < this.maze[i].length - 1; j += 2) {
                emptyCt++;
                this.maze[i][j].value = -emptyCt;
                if (i < this.maze.length - 2) {
                    nodesToExplore.push({ i: i + 1, j });
                }
                if (j < this.maze[0].length - 2) {
                    nodesToExplore.push({ i, j: j + 1 });
                }
            }
        }
            
        nodesToExplore.sort(() => Math.random() - 0.5);
        nodesToExplore.forEach(({ i, j }) => this.tearDown(i, j));

        for (let i = 1; i < this.maze.length - 1; i++)
            for (let j = 1; j < this.maze[i].length - 1; j++)
                if (this.maze[i][j].value < 0) {
                    this.addToPath(i, j, OPEN_EVENT);
                    this.maze[i][j].isWall = false;
                }

        return this.path;
    };

    addToPath = (i, j, event, fastSleep) => {
        const index = i * this.maze[0].length + j;
        if (!this.visitedPath.has(index) || this.visitedPath.get(index).event !== event) {
            this.path.queue({ i, j, event, fastSleep });
            this.visitedPath.set(index, { event });
        }
    };

    tearDown(row, col) {
        if (row % 2 !== 0 && this.maze[row][col - 1].value !== this.maze[row][col + 1].value) {
            this.fill(row, col - 1, this.maze[row][col - 1].value, this.maze[row][col + 1].value);
            this.maze[row][col].value = this.maze[row][col + 1].value;
        } else if (row % 2 == 0 && this.maze[row - 1][col].value !== this.maze[row + 1][col].value) {
            this.fill(row - 1, col, this.maze[row - 1][col].value, this.maze[row + 1][col].value);
            this.maze[row][col].value = this.maze[row + 1][col].value;
        }
    }

    fill(row, col, replace, replaceWith) {
        if (this.maze[row][col].value === replace) {
            this.maze[row][col].value = replaceWith;
            this.maze[row][col].isWall = false;
            this.addToPath(row, col, OPEN_EVENT);
            this.fill(row + 1, col, replace, replaceWith);
            this.fill(row - 1, col, replace, replaceWith);
            this.fill(row, col + 1, replace, replaceWith);
            this.fill(row, col - 1, replace, replaceWith);
        }
    }
}
