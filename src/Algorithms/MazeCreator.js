import PriorityQueue from 'js-priority-queue';

const WALL = 1;
const WALL_EVENT = 'wall';
const OPEN_EVENT = 'open';

export default class MazeCreator {
    constructor(maze, getIndex) {
        this.maze = maze;
        this.dim = maze.length;
        this.getIndex = getIndex;
        this.path = new PriorityQueue({
            strategy: PriorityQueue.ArrayStrategy,
        });
        this.visitedPath = new Map();
    }

    makeMazeBacktracking = () => {
        const stack = [];
        const directionsI = [-2, 2, 0, 0]; 
        const directionsJ = [0, 0, 2, -2]; 
        const sumI = [-1, 1, 0, 0];
        const sumJ = [0, 0, 1, -1];


        for (let i = 0; i < this.maze.length; i++) {
            for (let j = 0; j < this.maze[i].length; j++) {
                this.maze[i][j].isWall = true;
                this.path.queue({ i, j, event: WALL_EVENT, fastSleep: true });
            }
        }

        let startI = 2;
        let startJ = 2;
        while (startI % 2 === 0 && startI > 0)
            startI = parseInt(Math.random() * (this.dim - 1));
        while (startJ % 2 === 0 && startJ > 0) 
            startJ = parseInt(Math.random() * (this.dim - 1));
        stack.push({ i: startI, j: startJ });
        this.path.queue({ i: startI, j: startJ, event: OPEN_EVENT });
        this.setVisited(startI, startJ);

        while (stack.length !== 0) {
            const neighbors = [];
            const { i, j } = stack.pop();
            
            for (let index = 0; index < 4; index++) {
                const newI = i + directionsI[index];
                const newJ = j + directionsJ[index];
                const midI = i + sumI[index];
                const midJ = j + sumJ[index];
                if (this.validNeighbor(newI, newJ, midI, midJ)) {
                    neighbors.push({ i: newI, j: newJ });
                    this.maze[newI][newJ].isWall = false;
                    this.maze[midI][midJ].isWall = false;
                    this.path.queue({ i: midI, j: midJ, event: OPEN_EVENT, current: true });
                    this.path.queue({ i: newI, j: newJ, event: OPEN_EVENT, current: true });
                    this.setVisited(newI, newJ);
                    this.setVisited(midI, midJ);
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
            j < this.maze.length - 1 &&
            !this.visitedPath.has(i * this.maze.length + j) &&
            !this.visitedPath.has(midI * this.maze.length + midJ)
        );
    };

    makeMazeDfs = () => {
        let i, j;
        let emptyCt = 0;
        let wallCt = 0;

        const wallrow = new Array(Math.floor((this.dim * this.dim) / 2));
        const wallcol = new Array(Math.floor((this.dim * this.dim) / 2));

        for (i = 0; i < this.dim; i++)
            for (j = 0; j < this.dim; j++) {
                this.maze[i][j].value = WALL;
                this.maze[i][j].isWall = true;
                this.addToPath(i, j, WALL_EVENT);
            }

        for (i = 1; i < this.dim - 1; i += 2) {
            for (j = 1; j < this.dim - 1; j += 2) {
                emptyCt++;
                this.maze[i][j].value = -emptyCt;
                if (i < this.dim - 2) {
                    wallrow[wallCt] = i + 1;
                    wallcol[wallCt++] = j;
                }
                if (j < this.dim - 2) {
                    wallrow[wallCt] = i;
                    wallcol[wallCt++] = j + 1;
                }
            }
        }

        let r;
        for (i = wallCt - 1; i > 0; i--) {
            r = Math.floor(Math.random() * i);
            this.tearDown(wallrow[r], wallcol[r]);
            wallrow[r] = wallrow[i];
            wallcol[r] = wallcol[i];
        }

        // Reemplazar valores negativos por casillas abiertas
        for (i = 1; i < this.dim - 1; i++)
            for (j = 1; j < this.dim - 1; j++)
                if (this.maze[i][j].value < 0) {
                    if (this.maze[i][j].isWall) {
                        this.addToPath(i, j, OPEN_EVENT);
                    }
                    this.maze[i][j].isWall = false;
                }

        return this.path;
    };

    addToPath = (i, j, event) => {
        const index = i * this.maze.length + j;
        if (
            !this.visitedPath.has(index) ||
            this.visitedPath.get(index).event !== event
        ) {
            this.path.queue({ i, j, event });
            this.visitedPath.set(index, { event });
        }
    };

    tearDown(row, col, path) {
        if (
            row % 2 !== 0 &&
            this.maze[row][col - 1].value !== this.maze[row][col + 1].value
        ) {
            this.fill(
                row,
                col - 1,
                this.maze[row][col - 1].value,
                this.maze[row][col + 1].value,
            );
            this.maze[row][col].value = this.maze[row][col + 1].value;
            this.maze[row][col].isWall = this.maze[row][col].isWall;
        } else if (
            row % 2 == 0 &&
            this.maze[row - 1][col].value !== this.maze[row + 1][col].value
        ) {
            this.fill(
                row - 1,
                col,
                this.maze[row - 1][col].value,
                this.maze[row + 1][col].value,
            );
            this.maze[row][col].value = this.maze[row + 1][col].value;
            this.maze[row][col].isWall = this.maze[row][col].isWall;
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
