// CSP Visualization - Main JavaScript File

class CSPVisualizer {
    constructor() {
        this.currentTab = 'overview';
        this.charts = {};
        this.isSafari = this.detectSafari();
        
        if (this.isSafari) {
            console.log('Safari detected - applying compatibility fixes');
        }
        
        // Safari compatibility: wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeEventListeners();
                this.initializeCharts();
            });
        } else {
            this.initializeEventListeners();
            this.initializeCharts();
        }
    }
    
    detectSafari() {
        const userAgent = navigator.userAgent;
        return /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    }

    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Map coloring controls
        const generateMapBtn = document.getElementById('generate-map');
        const solveMapBtn = document.getElementById('solve-map');
        const resetMapBtn = document.getElementById('reset-map');
        
        if (generateMapBtn) generateMapBtn.addEventListener('click', () => this.generateMap());
        if (solveMapBtn) solveMapBtn.addEventListener('click', () => this.solveMap());
        if (resetMapBtn) resetMapBtn.addEventListener('click', () => this.resetMap());

        // Sudoku controls
        const generateSudokuBtn = document.getElementById('generate-sudoku');
        const solveSudokuBtn = document.getElementById('solve-sudoku');
        const clearSudokuBtn = document.getElementById('clear-sudoku');
        
        if (generateSudokuBtn) generateSudokuBtn.addEventListener('click', () => this.generateSudoku());
        if (solveSudokuBtn) solveSudokuBtn.addEventListener('click', () => this.solveSudoku());
        if (clearSudokuBtn) clearSudokuBtn.addEventListener('click', () => this.clearSudoku());

        // N-Queens controls
        const queensSlider = document.getElementById('queens-slider');
        const solveQueensBtn = document.getElementById('solve-queens');
        const animateQueensBtn = document.getElementById('animate-queens');
        
        if (queensSlider) {
            queensSlider.addEventListener('input', (e) => {
                const queensValue = document.getElementById('queens-value');
                if (queensValue) queensValue.textContent = `${e.target.value} Queens`;
            });
        }
        if (solveQueensBtn) solveQueensBtn.addEventListener('click', () => this.solveNQueens());
        if (animateQueensBtn) animateQueensBtn.addEventListener('click', () => this.animateNQueens());

        // Algorithm selector
        document.querySelectorAll('.algo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAlgorithm(e.target.dataset.algo);
            });
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTabBtn) activeTabBtn.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeTabContent = document.getElementById(tabName);
        if (activeTabContent) activeTabContent.classList.add('active');

        this.currentTab = tabName;
        this.initializeTabContent(tabName);
    }

    handleResize() {
        // Reinitialize current tab content when window is resized
        setTimeout(() => {
            this.initializeTabContent(this.currentTab);
        }, 100);
    }

    initializeTabContent(tabName) {
        switch(tabName) {
            case 'map-coloring':
                this.initializeMapColoring();
                break;
            case 'sudoku':
                this.initializeSudoku();
                break;
            case 'n-queens':
                this.initializeNQueens();
                break;
            case 'algorithms':
                this.initializeAlgorithms();
                break;
        }
        
        // Add a small delay to ensure DOM elements are ready
        setTimeout(() => {
            if (tabName === 'sudoku') {
                const grid = document.getElementById('sudoku-grid');
                if (grid && grid.children.length === 0) {
                    console.log('Re-initializing Sudoku grid...');
                    this.renderSudokuGrid();
                }
            }
        }, 200);
    }

    // Map Coloring Implementation
    initializeMapColoring() {
        this.mapRegions = [];
        this.mapColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        
        // Safari compatibility: longer delay and ensure canvas is ready
        setTimeout(() => {
            const canvas = document.getElementById('map-canvas');
            if (canvas) {
                // Force canvas dimensions for Safari
                if (canvas.width === 0 || canvas.height === 0) {
                    canvas.width = 400;
                    canvas.height = 400;
                }
                this.generateMap();
            } else {
                console.error('Map canvas not found during initialization');
            }
        }, 200);
    }

    generateMap() {
        const canvas = document.getElementById('map-canvas');
        if (!canvas) {
            console.error('Map canvas not found');
            return;
        }
        
        // Safari compatibility: ensure canvas has proper dimensions
        if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = 400;
            canvas.height = 400;
        }
        
        const ctx = canvas.getContext('2d');
        console.log('Generating new map with canvas size:', canvas.width, 'x', canvas.height);
        
        // Generate random regions
        this.mapRegions = [];
        const numRegions = Math.floor(Math.random() * 8) + 5;
        
        for (let i = 0; i < numRegions; i++) {
            this.mapRegions.push({
                id: i,
                x: Math.random() * (canvas.width - 100) + 50,
                y: Math.random() * (canvas.height - 100) + 50,
                radius: Math.random() * 30 + 20,
                color: null,
                neighbors: []
            });
        }

        // Generate adjacency graph
        this.generateAdjacencyGraph();
        this.drawMap();
        this.updateMapStats();
        console.log('Map generated with', this.mapRegions.length, 'regions');
    }

    generateAdjacencyGraph() {
        for (let i = 0; i < this.mapRegions.length; i++) {
            for (let j = i + 1; j < this.mapRegions.length; j++) {
                const dist = Math.sqrt(
                    Math.pow(this.mapRegions[i].x - this.mapRegions[j].x, 2) +
                    Math.pow(this.mapRegions[i].y - this.mapRegions[j].y, 2)
                );
                if (dist < this.mapRegions[i].radius + this.mapRegions[j].radius + 20) {
                    this.mapRegions[i].neighbors.push(j);
                    this.mapRegions[j].neighbors.push(i);
                }
            }
        }
    }

    drawMap() {
        const canvas = document.getElementById('map-canvas');
        if (!canvas) {
            console.error('Map canvas not found');
            return;
        }
        
        // Safari compatibility: ensure canvas has proper dimensions
        if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = 400;
            canvas.height = 400;
        }
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw regions
        this.mapRegions.forEach(region => {
            ctx.beginPath();
            ctx.arc(region.x, region.y, region.radius, 0, 2 * Math.PI);
            ctx.fillStyle = region.color || '#f0f0f0';
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw region ID
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(region.id, region.x, region.y + 5);
        });
        
        console.log('Map drawn with', this.mapRegions.length, 'regions');
    }

    solveMap() {
        const startTime = performance.now();
        let backtracks = 0;
        
        // Reset colors
        this.mapRegions.forEach(region => region.color = null);
        
        // Solve using backtracking with AI heuristics
        const solution = this.backtrackingMapColoring(0, backtracks);
        
        const endTime = performance.now();
        
        if (solution) {
            this.drawMap();
            this.updateMapStats(backtracks, endTime - startTime);
        } else {
            alert('No solution found!');
        }
    }

    backtrackingMapColoring(regionIndex, backtracks) {
        if (regionIndex >= this.mapRegions.length) {
            return true;
        }

        const region = this.mapRegions[regionIndex];
        
        // Try each color
        for (let colorIndex = 0; colorIndex < this.mapColors.length; colorIndex++) {
            const color = this.mapColors[colorIndex];
            
            // Check if color is valid for this region
            if (this.isValidColor(regionIndex, color)) {
                region.color = color;
                
                // Recursively color remaining regions
                if (this.backtrackingMapColoring(regionIndex + 1, backtracks)) {
                    return true;
                }
                
                // Backtrack
                region.color = null;
                backtracks++;
            }
        }
        
        return false;
    }

    isValidColor(regionIndex, color) {
        const region = this.mapRegions[regionIndex];
        return !region.neighbors.some(neighborIndex => 
            this.mapRegions[neighborIndex].color === color
        );
    }

    updateMapStats(backtracks = 0, time = 0) {
        document.getElementById('region-count').textContent = this.mapRegions.length;
        document.getElementById('colors-used').textContent = new Set(
            this.mapRegions.map(r => r.color).filter(c => c)
        ).size;
        document.getElementById('backtrack-count').textContent = backtracks;
        document.getElementById('solve-time').textContent = `${Math.round(time)}ms`;
    }

    resetMap() {
        this.mapRegions.forEach(region => region.color = null);
        this.drawMap();
        this.updateMapStats();
    }

    // Sudoku Implementation
    initializeSudoku() {
        console.log('Initializing Sudoku...');
        this.sudokuGrid = Array(9).fill().map(() => Array(9).fill(0));
        this.sudokuFixed = Array(9).fill().map(() => Array(9).fill(false));
        
        // Safari compatibility: longer delay and ensure grid is ready
        setTimeout(() => {
            const grid = document.getElementById('sudoku-grid');
            if (grid) {
                console.log('Sudoku grid element found, rendering...');
                this.renderSudokuGrid();
            } else {
                console.error('Sudoku grid not found during initialization');
            }
        }, 200);
    }

    renderSudokuGrid() {
        const grid = document.getElementById('sudoku-grid');
        if (!grid) {
            console.error('Sudoku grid element not found');
            return;
        }
        
        console.log('Rendering Sudoku grid with data:', this.sudokuGrid);
        
        grid.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                const value = this.sudokuGrid[i] && this.sudokuGrid[i][j];
                cell.textContent = value || '';
                
                if (this.sudokuFixed[i] && this.sudokuFixed[i][j]) {
                    cell.classList.add('fixed');
                }
                
                cell.addEventListener('click', (e) => this.handleSudokuCellClick(e));
                grid.appendChild(cell);
            }
        }
        
        console.log('Sudoku grid rendered with', grid.children.length, 'cells');
        
        // Verify the grid was created properly
        if (grid.children.length !== 81) {
            console.error('Grid not properly created. Expected 81 cells, got', grid.children.length);
        }
    }

    handleSudokuCellClick(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        if (this.sudokuFixed[row][col]) {
            return;
        }
        
        const currentValue = parseInt(e.target.textContent) || 0;
        const newValue = (currentValue % 9) + 1;
        e.target.textContent = newValue;
        this.sudokuGrid[row][col] = newValue;
        
        console.log(`Updated cell [${row},${col}] to ${newValue}`);
    }

    generateSudoku() {
        console.log('Generating new Sudoku puzzle...');
        
        try {
            // Generate a valid Sudoku puzzle
            this.sudokuGrid = this.generateValidSudoku();
            console.log('Valid Sudoku generated:', this.sudokuGrid);
            
            // Remove some numbers to create puzzle
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (Math.random() < 0.7) {
                        this.sudokuGrid[i][j] = 0;
                    }
                }
            }
            
            // Mark fixed cells
            this.sudokuFixed = this.sudokuGrid.map(row => 
                row.map(cell => cell !== 0)
            );
            
            console.log('Puzzle created, fixed cells:', this.sudokuFixed);
            this.renderSudokuGrid();
            console.log('Sudoku puzzle generated and rendered');
        } catch (error) {
            console.error('Error generating Sudoku:', error);
            // Fallback to a simple puzzle
            this.createFallbackSudoku();
        }
    }

    generateValidSudoku() {
        console.log('Starting valid Sudoku generation...');
        const grid = Array(9).fill().map(() => Array(9).fill(0));
        
        // Fill diagonal boxes first (these are independent)
        for (let i = 0; i < 9; i += 4) {
            this.fillBox(grid, i, i);
        }
        
        console.log('Diagonal boxes filled:', grid);
        
        // Solve the rest using backtracking
        const solved = this.solveSudokuGrid(grid);
        if (solved) {
            console.log('Sudoku solved successfully');
            return grid;
        } else {
            console.log('Failed to solve Sudoku, using fallback');
            return this.createFallbackSudoku();
        }
    }

    fillBox(grid, row, col) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                grid[row + i][col + j] = numbers.splice(randomIndex, 1)[0];
            }
        }
    }

    solveSudoku() {
        console.log('Solving Sudoku puzzle...');
        const startTime = performance.now();
        const solution = this.solveSudokuGrid([...this.sudokuGrid.map(row => [...row])]);
        const endTime = performance.now();
        
        if (solution) {
            this.sudokuGrid = solution;
            this.renderSudokuGrid();
            this.animateSudokuSolution();
            console.log(`Sudoku solved in ${endTime - startTime}ms`);
        } else {
            console.error('No solution found for Sudoku puzzle');
            alert('No solution found!');
        }
    }

    solveSudokuGrid(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValidSudokuMove(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.solveSudokuGrid(grid)) {
                                return grid;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return grid;
    }

    isValidSudokuMove(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }
        
        // Check box
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }

    animateSudokuSolution() {
        const cells = document.querySelectorAll('.sudoku-cell:not(.fixed)');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('solved');
            }, index * 50);
        });
    }

    clearSudoku() {
        console.log('Clearing Sudoku grid...');
        this.sudokuGrid = Array(9).fill().map(() => Array(9).fill(0));
        this.sudokuFixed = Array(9).fill().map(() => Array(9).fill(false));
        this.renderSudokuGrid();
        console.log('Sudoku grid cleared');
    }
    
    createFallbackSudoku() {
        console.log('Creating fallback Sudoku puzzle...');
        // A simple valid Sudoku puzzle
        const fallbackGrid = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        
        this.sudokuGrid = fallbackGrid;
        this.sudokuFixed = fallbackGrid.map(row => 
            row.map(cell => cell !== 0)
        );
        
        this.renderSudokuGrid();
        console.log('Fallback Sudoku created');
        return fallbackGrid;
    }

    // N-Queens Implementation
    initializeNQueens() {
        this.nQueens = 8;
        this.queensSolution = [];
        this.initializeQueensChart();
    }

    solveNQueens() {
        const n = parseInt(document.getElementById('queens-slider').value);
        this.nQueens = n;
        
        const startTime = performance.now();
        this.queensSolution = this.findNQueensSolution(n);
        const endTime = performance.now();
        
        if (this.queensSolution.length > 0) {
            this.drawQueensBoard();
            this.updateQueensChart(n, endTime - startTime);
        } else {
            alert('No solution found!');
        }
    }

    findNQueensSolution(n) {
        const board = Array(n).fill().map(() => Array(n).fill(0));
        const solution = [];
        
        if (this.solveNQueensBacktrack(board, 0, solution)) {
            return solution;
        }
        return [];
    }

    solveNQueensBacktrack(board, col, solution) {
        if (col >= this.nQueens) {
            return true;
        }
        
        for (let row = 0; row < this.nQueens; row++) {
            if (this.isSafeQueen(board, row, col)) {
                board[row][col] = 1;
                solution.push({row, col});
                
                if (this.solveNQueensBacktrack(board, col + 1, solution)) {
                    return true;
                }
                
                board[row][col] = 0;
                solution.pop();
            }
        }
        
        return false;
    }

    isSafeQueen(board, row, col) {
        // Check row
        for (let x = 0; x < col; x++) {
            if (board[row][x] === 1) return false;
        }
        
        // Check upper diagonal
        for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 1) return false;
        }
        
        // Check lower diagonal
        for (let i = row, j = col; i < this.nQueens && j >= 0; i++, j--) {
            if (board[i][j] === 1) return false;
        }
        
        return true;
    }

    drawQueensBoard() {
        const canvas = document.getElementById('queens-canvas');
        if (!canvas) {
            console.error('Queens canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const cellSize = Math.min(canvas.width, canvas.height) / this.nQueens;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw board
        for (let i = 0; i < this.nQueens; i++) {
            for (let j = 0; j < this.nQueens; j++) {
                const x = j * cellSize;
                const y = i * cellSize;
                
                ctx.fillStyle = (i + j) % 2 === 0 ? '#f0f0f0' : '#333';
                ctx.fillRect(x, y, cellSize, cellSize);
                
                // Draw queen if present
                if (this.queensSolution.some(queen => queen.row === i && queen.col === j)) {
                    ctx.fillStyle = '#FF6B6B';
                    ctx.beginPath();
                    ctx.arc(x + cellSize/2, y + cellSize/2, cellSize/3, 0, 2 * Math.PI);
                    ctx.fill();
                    
                    // Draw crown
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(x + cellSize/3, y + cellSize/4, cellSize/3, cellSize/6);
                }
            }
        }
    }

    animateNQueens() {
        if (this.queensSolution.length === 0) return;
        
        const canvas = document.getElementById('queens-canvas');
        const ctx = canvas.getContext('2d');
        const cellSize = Math.min(canvas.width, canvas.height) / this.nQueens;
        
        this.queensSolution.forEach((queen, index) => {
            setTimeout(() => {
                const x = queen.col * cellSize;
                const y = queen.row * cellSize;
                
                ctx.fillStyle = '#4ECDC4';
                ctx.beginPath();
                ctx.arc(x + cellSize/2, y + cellSize/2, cellSize/3, 0, 2 * Math.PI);
                ctx.fill();
            }, index * 500);
        });
    }

    // Charts and Analytics
    initializeCharts() {
        this.initializeQueensChart();
        this.initializePerformanceChart();
    }

    initializeQueensChart() {
        const ctx = document.getElementById('queens-chart');
        if (!ctx) return;
        
        this.charts.queens = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['4', '5', '6', '7', '8', '9', '10'],
                datasets: [{
                    label: 'Solution Time (ms)',
                    data: [2, 5, 12, 35, 120, 450, 1800],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'N-Queens Performance'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initializePerformanceChart() {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;
        
        this.charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Backtracking', 'Forward Checking', 'Arc Consistency', 'Genetic Algorithm'],
                datasets: [{
                    label: 'Time (ms)',
                    data: [120, 85, 45, 200],
                    backgroundColor: [
                        '#FF6B6B',
                        '#4ECDC4',
                        '#45B7D1',
                        '#96CEB4'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Algorithm Performance Comparison'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateQueensChart(n, time) {
        if (this.charts.queens) {
            const dataIndex = n - 4;
            if (dataIndex >= 0 && dataIndex < this.charts.queens.data.datasets[0].data.length) {
                this.charts.queens.data.datasets[0].data[dataIndex] = time;
                this.charts.queens.update();
            }
        }
    }

    // Algorithm Selection
    selectAlgorithm(algo) {
        document.querySelectorAll('.algo-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeAlgoBtn = document.querySelector(`[data-algo="${algo}"]`);
        if (activeAlgoBtn) activeAlgoBtn.classList.add('active');
        
        this.updateAlgorithmDetails(algo);
        this.visualizeAlgorithm(algo);
    }

    updateAlgorithmDetails(algo) {
        const details = document.getElementById('algo-details');
        const algoInfo = {
            'backtracking': {
                title: 'Backtracking',
                description: 'A systematic search algorithm that builds candidates for the solution incrementally and abandons a candidate as soon as it determines that the candidate cannot possibly be completed to a valid solution.',
                complexity: 'O(d^n) where d is domain size, n is number of variables'
            },
            'forward-checking': {
                title: 'Forward Checking',
                description: 'An improvement to backtracking that maintains arc consistency by removing values from the domains of unassigned variables that are inconsistent with the current assignment.',
                complexity: 'O(d^n) but with better pruning'
            },
            'arc-consistency': {
                title: 'Arc Consistency (AC-3)',
                description: 'A constraint propagation algorithm that ensures that every value in the domain of a variable has a compatible value in the domain of every other variable.',
                complexity: 'O(d³n²) where d is domain size, n is number of variables'
            },
            'genetic': {
                title: 'Genetic Algorithm',
                description: 'A metaheuristic inspired by natural selection that uses techniques such as mutation, crossover, and selection to evolve solutions to optimization problems.',
                complexity: 'O(g × p × f) where g is generations, p is population size, f is fitness evaluation cost'
            }
        };
        
        const info = algoInfo[algo];
        details.innerHTML = `
            <h4>${info.title}</h4>
            <p>${info.description}</p>
            <div class="complexity">
                <strong>Time Complexity:</strong> ${info.complexity}
            </div>
        `;
    }

    visualizeAlgorithm(algo) {
        const canvas = document.getElementById('algorithm-visualization');
        if (!canvas) {
            console.error('Algorithm visualization canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        switch(algo) {
            case 'backtracking':
                this.drawBacktrackingVisualization(ctx);
                break;
            case 'forward-checking':
                this.drawForwardCheckingVisualization(ctx);
                break;
            case 'arc-consistency':
                this.drawArcConsistencyVisualization(ctx);
                break;
            case 'genetic':
                this.drawGeneticAlgorithmVisualization(ctx);
                break;
        }
    }

    drawBacktrackingVisualization(ctx) {
        // Draw a tree structure showing backtracking
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        
        // Draw nodes and edges
        const nodes = [
            {x: 200, y: 50, label: 'Start'},
            {x: 100, y: 150, label: 'A=1'},
            {x: 200, y: 150, label: 'A=2'},
            {x: 300, y: 150, label: 'A=3'},
            {x: 50, y: 250, label: 'B=1'},
            {x: 150, y: 250, label: 'B=2'},
            {x: 250, y: 250, label: 'B=1'},
            {x: 350, y: 250, label: 'B=2'}
        ];
        
        // Draw edges
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[3].x, nodes[3].y);
        ctx.stroke();
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + 4);
        });
    }

    drawForwardCheckingVisualization(ctx) {
        // Draw domains being pruned
        ctx.fillStyle = '#4ECDC4';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        ctx.fillText('Variable A: [1,2,3]', 50, 100);
        ctx.fillText('Variable B: [1,2,3]', 50, 130);
        ctx.fillText('Variable C: [1,2,3]', 50, 160);
        
        // Show pruning
        ctx.fillStyle = '#FF6B6B';
        ctx.fillText('After A=1:', 50, 200);
        ctx.fillText('Variable B: [2,3] (1 removed)', 50, 230);
        ctx.fillText('Variable C: [2,3] (1 removed)', 50, 260);
    }

    drawArcConsistencyVisualization(ctx) {
        // Draw constraint graph
        ctx.strokeStyle = '#45B7D1';
        ctx.lineWidth = 3;
        
        const nodes = [
            {x: 100, y: 100, label: 'A'},
            {x: 200, y: 100, label: 'B'},
            {x: 150, y: 200, label: 'C'}
        ];
        
        // Draw edges
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.moveTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.moveTo(nodes[2].x, nodes[2].y);
        ctx.lineTo(nodes[0].x, nodes[0].y);
        ctx.stroke();
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.fillStyle = '#45B7D1';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + 5);
        });
    }

    drawGeneticAlgorithmVisualization(ctx) {
        // Draw population evolution
        ctx.fillStyle = '#96CEB4';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        ctx.fillText('Generation 1: [1010, 1100, 0110, 1001]', 50, 100);
        ctx.fillText('Generation 2: [1011, 1101, 0111, 1001]', 50, 130);
        ctx.fillText('Generation 3: [1111, 1101, 0111, 1011]', 50, 160);
        ctx.fillText('Generation 4: [1111, 1111, 0111, 1111]', 50, 190);
        
        // Draw fitness curve
        ctx.strokeStyle = '#96CEB4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(100, 220);
        ctx.lineTo(150, 200);
        ctx.lineTo(200, 180);
        ctx.lineTo(250, 160);
        ctx.stroke();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CSPVisualizer();
});

// Safari fallback initialization
if (document.readyState === 'complete') {
    new CSPVisualizer();
} 