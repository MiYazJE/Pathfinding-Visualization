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
        this.map = new Map();
    }

    makeMaze = () => {

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
    }

    addToPath = (i, j, event) => {
        const index = (i * this.maze.length) + j;
        if (!this.map.has(index) || this.map.get(index).event !== event) {
            this.path.queue({ i, j, event });
            this.map.set(index, { event });
        }
    }

    tearDown(row, col, path) {
        if (row % 2 !== 0 && this.maze[row][col - 1].value !== this.maze[row][col + 1].value) {
            this.fill(row, col - 1, this.maze[row][col - 1].value, this.maze[row][col + 1].value);
            this.maze[row][col].value = this.maze[row][col + 1].value;
            this.maze[row][col].isWall = this.maze[row][col].isWall;
        }
        else if (row % 2 == 0 && this.maze[row - 1][col].value !== this.maze[row + 1][col].value) {
            this.fill(row - 1, col, this.maze[row - 1][col].value, this.maze[row + 1][col].value);
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