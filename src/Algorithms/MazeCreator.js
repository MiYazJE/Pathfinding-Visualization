
const sleep = (time) => new Promise(res => setTimeout(res, time));

export default class MazeCreator {

    constructor(maze, updateMaze, getIndex) {
        this.maze = maze;
        this.dim = maze.length;
        this.updateMaze = updateMaze;
        this.getIndex = getIndex;
        this.ABIERTO = 0;
        this.PARED = 1;
    }

    crearLaberinto = async () => {

        let i, j;
        let emptyCt = 0;
        let wallCt = 0;

        const wallrow = new Array(Math.floor((this.dim * this.dim) / 2));
        const wallcol = new Array(Math.floor((this.dim * this.dim) / 2));

        for (i = 0; i < this.dim; i++)
            for (j = 0; j < this.dim; j++) {
                this.maze[i][j].value = this.PARED;
                this.maze[i][j].isWall = true;
                this.updateMaze(this.maze);
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
                    this.maze[i][j].isWall = false;
                    this.updateMaze(this.maze);
                }
    }

    tearDown(fila, col) {
        if (fila % 2 != 0 && this.maze[fila][col - 1].value !== this.maze[fila][col + 1].value) {
            this.fill(fila, col - 1, this.maze[fila][col - 1].value, this.maze[fila][col + 1].value);
            this.maze[fila][col].value = this.maze[fila][col + 1].value;
            this.maze[fila][col].isWall = this.maze[fila][col].isWall;
            this.updateMaze(this.maze);
        }
        else if (fila % 2 == 0 && this.maze[fila - 1][col].value !== this.maze[fila + 1][col].value) {
            this.fill(fila - 1, col, this.maze[fila - 1][col].value, this.maze[fila + 1][col].value);
            this.maze[fila][col].value = this.maze[fila + 1][col].value;
            this.maze[fila][col].isWall = this.maze[fila][col].isWall;
            this.updateMaze(this.maze);
        }
    }

    fill(row, col, replace, replaceWith) {
        if (this.maze[row][col].value == replace) {
            this.maze[row][col].value = replaceWith;
            this.maze[row][col].isWall = (replaceWith === this.PARED);
            this.updateMaze(this.maze);
            this.fill(row + 1, col, replace, replaceWith);
            this.fill(row - 1, col, replace, replaceWith);
            this.fill(row, col + 1, replace, replaceWith);
            this.fill(row, col - 1, replace, replaceWith);
        }
    }

}