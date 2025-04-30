class GameOfLife {
    constructor(canvasId, color = "white", interval, prob = 5, debug = false) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.gridWidth = this.canvas.offsetWidth; // Assuming a 10x10 grid
        this.gridHeight = this.canvas.offsetHeight;
        this.grid = Array.from({ length: this.gridHeight }, () => new Array(this.gridWidth).fill(0));
        this.nextGrid = Array.from({ length: this.gridHeight }, () => new Array(this.gridWidth).fill(0));
        this.lastGrid = [];
        this.color = color;
        this.intervalId = null;
        this.prob = prob;
        this.debug = debug;
        // Set custom interval function
        this._intervalTime = interval;
    }

    init() {
        let seed = 1-(this.prob/10);
        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                this.grid[i][j] = Math.random() > seed ? 1 : 0;
            }
        }
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.updateAndDrawGrid();
    }

    updateAndDrawGrid() {
        this.debug && console.log('Updating grid...');
        
        let nextGrid = Array.from(this.grid.map(row => row.slice()));
        
        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                let neighbors = 0;
                
                if (i > 0 && j > 0) neighbors += this.grid[i - 1][j - 1];
                if (i > 0 && this.grid[i - 1][j] !== undefined) neighbors += this.grid[i - 1][j];
                if (i > 0 && j < this.gridWidth - 1) neighbors += this.grid[i - 1][j + 1];
                
                if (i < this.gridHeight - 1 && j > 0) neighbors += this.grid[i + 1][j - 1];
                if (i < this.gridHeight - 1 && this.grid[i + 1][j] !== undefined) neighbors += this.grid[i + 1][j];
                if (i < this.gridHeight - 1 && j < this.gridWidth - 1) neighbors += this.grid[i + 1][j + 1];
                
                if (j > 0) neighbors += this.grid[i][j - 1];
                if (j < this.gridWidth - 1) neighbors += this.grid[i][j + 1];
                
                let nextCell = this.grid[i][j] === 1 && (neighbors < 2 || neighbors > 3) ? 0 : 
                              this.grid[i][j] === 0 && neighbors === 3 ? 1 : this.grid[i][j];
                
                nextGrid[i][j] = nextCell;
            }
        }
        
        this.lastGrid.push(this.grid);
        while (this.lastGrid.length > 10) {
            this.lastGrid.shift();
        }
        
        this.grid = nextGrid;
        
        this.debug && console.log('Drawing grid...');
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                let x = j * this.width / this.gridWidth;
                let y = i * this.height / this.gridHeight;
                
                if (this.grid[i][j] === 1) {
                    this.ctx.fillStyle = this.color;
                    this.ctx.fillRect(x, y, this.width / this.gridWidth, this.height / this.gridHeight);
                }
            }
        }
        
        this.debug && console.log('Grid updated and drawn!');
    }

    stop() {
        clearInterval(this.intervalId);
    }
}