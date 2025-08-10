#!/usr/bin/env python3
"""
Constraint Satisfaction Problems - Python Demo
Additional examples and algorithms for CSP visualization
"""

import time
import random
from typing import List, Dict, Set, Tuple, Optional
import matplotlib.pyplot as plt
import numpy as np

class CSP:
    """Base class for Constraint Satisfaction Problems"""
    
    def __init__(self, variables: List, domains: Dict, constraints: List):
        self.variables = variables
        self.domains = domains
        self.constraints = constraints
        self.assignments = {}
        self.backtrack_count = 0
        
    def is_complete(self) -> bool:
        """Check if all variables are assigned"""
        return len(self.assignments) == len(self.variables)
    
    def is_consistent(self, var: str, value) -> bool:
        """Check if assignment is consistent with constraints"""
        self.assignments[var] = value
        for constraint in self.constraints:
            if not constraint(self.assignments):
                del self.assignments[var]
                return False
        return True
    
    def select_unassigned_variable(self) -> str:
        """Select next variable to assign (Minimum Remaining Values heuristic)"""
        unassigned = [var for var in self.variables if var not in self.assignments]
        return min(unassigned, key=lambda var: len(self.domains[var]))
    
    def order_domain_values(self, var: str) -> List:
        """Order domain values (Least Constraining Value heuristic)"""
        return sorted(self.domains[var], key=lambda value: self.count_conflicts(var, value))
    
    def count_conflicts(self, var: str, value) -> int:
        """Count conflicts for a value assignment"""
        conflicts = 0
        self.assignments[var] = value
        for constraint in self.constraints:
            if not constraint(self.assignments):
                conflicts += 1
        del self.assignments[var]
        return conflicts

class MapColoringCSP(CSP):
    """Map Coloring Problem Implementation"""
    
    def __init__(self, regions: List[str], neighbors: Dict[str, List[str]], colors: List[str]):
        self.regions = regions
        self.neighbors = neighbors
        self.colors = colors
        
        # Define constraints
        def different_colors_constraint(assignments):
            for region in assignments:
                for neighbor in self.neighbors.get(region, []):
                    if neighbor in assignments and assignments[region] == assignments[neighbor]:
                        return False
            return True
        
        super().__init__(
            variables=regions,
            domains={region: colors.copy() for region in regions},
            constraints=[different_colors_constraint]
        )
    
    def solve_backtracking(self) -> Optional[Dict]:
        """Solve using backtracking search"""
        start_time = time.time()
        self.backtrack_count = 0
        
        def backtrack():
            if self.is_complete():
                return self.assignments.copy()
            
            var = self.select_unassigned_variable()
            for value in self.order_domain_values(var):
                if self.is_consistent(var, value):
                    result = backtrack()
                    if result:
                        return result
                    self.backtrack_count += 1
            
            if var in self.assignments:
                del self.assignments[var]
            return None
        
        solution = backtrack()
        end_time = time.time()
        
        print(f"Map Coloring Solution:")
        print(f"Time: {end_time - start_time:.4f} seconds")
        print(f"Backtracks: {self.backtrack_count}")
        print(f"Solution: {solution}")
        return solution

class SudokuCSP(CSP):
    """Sudoku Problem Implementation"""
    
    def __init__(self, grid: List[List[int]]):
        self.grid = grid
        self.size = len(grid)
        self.box_size = int(np.sqrt(self.size))
        
        # Create variables for empty cells
        variables = []
        domains = {}
        for i in range(self.size):
            for j in range(self.size):
                if grid[i][j] == 0:
                    var = f"cell_{i}_{j}"
                    variables.append(var)
                    domains[var] = list(range(1, self.size + 1))
        
        # Define constraints
        def sudoku_constraints(assignments):
            # Check rows
            for i in range(self.size):
                row_values = []
                for j in range(self.size):
                    if grid[i][j] != 0:
                        row_values.append(grid[i][j])
                    else:
                        var = f"cell_{i}_{j}"
                        if var in assignments:
                            row_values.append(assignments[var])
                if len(row_values) != len(set(row_values)):
                    return False
            
            # Check columns
            for j in range(self.size):
                col_values = []
                for i in range(self.size):
                    if grid[i][j] != 0:
                        col_values.append(grid[i][j])
                    else:
                        var = f"cell_{i}_{j}"
                        if var in assignments:
                            col_values.append(assignments[var])
                if len(col_values) != len(set(col_values)):
                    return False
            
            # Check boxes
            for box_i in range(0, self.size, self.box_size):
                for box_j in range(0, self.size, self.box_size):
                    box_values = []
                    for i in range(box_i, box_i + self.box_size):
                        for j in range(box_j, box_j + self.box_size):
                            if grid[i][j] != 0:
                                box_values.append(grid[i][j])
                            else:
                                var = f"cell_{i}_{j}"
                                if var in assignments:
                                    box_values.append(assignments[var])
                    if len(box_values) != len(set(box_values)):
                        return False
            
            return True
        
        super().__init__(variables, domains, [sudoku_constraints])
    
    def solve_backtracking(self) -> Optional[List[List[int]]]:
        """Solve Sudoku using backtracking"""
        start_time = time.time()
        self.backtrack_count = 0
        
        def backtrack():
            if self.is_complete():
                return self.assignments.copy()
            
            var = self.select_unassigned_variable()
            for value in self.order_domain_values(var):
                if self.is_consistent(var, value):
                    result = backtrack()
                    if result:
                        return result
                    self.backtrack_count += 1
            
            if var in self.assignments:
                del self.assignments[var]
            return None
        
        solution = backtrack()
        end_time = time.time()
        
        if solution:
            # Reconstruct grid
            result_grid = [row[:] for row in self.grid]
            for var, value in solution.items():
                i, j = map(int, var.split('_')[1:])
                result_grid[i][j] = value
            
            print(f"Sudoku Solution:")
            print(f"Time: {end_time - start_time:.4f} seconds")
            print(f"Backtracks: {self.backtrack_count}")
            self.print_grid(result_grid)
            return result_grid
        
        return None
    
    def print_grid(self, grid: List[List[int]]):
        """Print Sudoku grid"""
        for i, row in enumerate(grid):
            if i % 3 == 0 and i != 0:
                print("-" * 21)
            for j, cell in enumerate(row):
                if j % 3 == 0 and j != 0:
                    print("|", end=" ")
                print(cell if cell != 0 else ".", end=" ")
            print()

class NQueensCSP(CSP):
    """N-Queens Problem Implementation"""
    
    def __init__(self, n: int):
        self.n = n
        variables = [f"queen_{i}" for i in range(n)]
        domains = {var: list(range(n)) for var in variables}
        
        def queens_constraints(assignments):
            positions = list(assignments.values())
            for i in range(len(positions)):
                for j in range(i + 1, len(positions)):
                    if positions[i] == positions[j]:  # Same row
                        return False
                    if abs(positions[i] - positions[j]) == abs(i - j):  # Same diagonal
                        return False
            return True
        
        super().__init__(variables, domains, [queens_constraints])
    
    def solve_backtracking(self) -> Optional[List[int]]:
        """Solve N-Queens using backtracking"""
        start_time = time.time()
        self.backtrack_count = 0
        
        def backtrack():
            if self.is_complete():
                return [self.assignments[f"queen_{i}"] for i in range(self.n)]
            
            var = self.select_unassigned_variable()
            for value in self.order_domain_values(var):
                if self.is_consistent(var, value):
                    result = backtrack()
                    if result:
                        return result
                    self.backtrack_count += 1
            
            if var in self.assignments:
                del self.assignments[var]
            return None
        
        solution = backtrack()
        end_time = time.time()
        
        print(f"N-Queens Solution ({self.n}x{self.n}):")
        print(f"Time: {end_time - start_time:.4f} seconds")
        print(f"Backtracks: {self.backtrack_count}")
        if solution:
            self.print_board(solution)
        return solution
    
    def print_board(self, solution: List[int]):
        """Print N-Queens board"""
        for i in range(self.n):
            row = ""
            for j in range(self.n):
                if solution[i] == j:
                    row += "Q "
                else:
                    row += ". "
            print(row)

def demo_map_coloring():
    """Demonstrate Map Coloring Problem"""
    print("=" * 50)
    print("MAP COLORING PROBLEM DEMO")
    print("=" * 50)
    
    # Create a simple map with 4 regions
    regions = ["WA", "NT", "SA", "Q"]
    neighbors = {
        "WA": ["NT", "SA"],
        "NT": ["WA", "SA", "Q"],
        "SA": ["WA", "NT", "Q"],
        "Q": ["NT", "SA"]
    }
    colors = ["red", "green", "blue"]
    
    csp = MapColoringCSP(regions, neighbors, colors)
    solution = csp.solve_backtracking()
    
    if solution:
        print("\nColoring Assignment:")
        for region, color in solution.items():
            print(f"{region}: {color}")

def demo_sudoku():
    """Demonstrate Sudoku Problem"""
    print("\n" + "=" * 50)
    print("SUDOKU PROBLEM DEMO")
    print("=" * 50)
    
    # Create a Sudoku puzzle
    grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
    
    print("Original Sudoku Grid:")
    csp = SudokuCSP(grid)
    csp.print_grid(grid)
    
    solution = csp.solve_backtracking()

def demo_n_queens():
    """Demonstrate N-Queens Problem"""
    print("\n" + "=" * 50)
    print("N-QUEENS PROBLEM DEMO")
    print("=" * 50)
    
    # Solve for different board sizes
    for n in [4, 6, 8]:
        print(f"\nSolving {n}-Queens problem:")
        csp = NQueensCSP(n)
        solution = csp.solve_backtracking()

def performance_analysis():
    """Analyze performance of different problem sizes"""
    print("\n" + "=" * 50)
    print("PERFORMANCE ANALYSIS")
    print("=" * 50)
    
    # N-Queens performance analysis
    sizes = [4, 5, 6, 7, 8]
    times = []
    backtracks = []
    
    for n in sizes:
        csp = NQueensCSP(n)
        start_time = time.time()
        solution = csp.solve_backtracking()
        end_time = time.time()
        
        times.append(end_time - start_time)
        backtracks.append(csp.backtrack_count)
    
    print(f"N-Queens Performance:")
    print(f"Board sizes: {sizes}")
    print(f"Times (seconds): {[f'{t:.4f}' for t in times]}")
    print(f"Backtracks: {backtracks}")
    
    # Plot results
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    plt.plot(sizes, times, 'bo-', linewidth=2, markersize=8)
    plt.xlabel('Board Size (N)')
    plt.ylabel('Time (seconds)')
    plt.title('N-Queens: Time vs Board Size')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(1, 2, 2)
    plt.plot(sizes, backtracks, 'ro-', linewidth=2, markersize=8)
    plt.xlabel('Board Size (N)')
    plt.ylabel('Number of Backtracks')
    plt.title('N-Queens: Backtracks vs Board Size')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('csp_performance.png', dpi=300, bbox_inches='tight')
    print("\nPerformance chart saved as 'csp_performance.png'")

def main():
    """Run all CSP demonstrations"""
    print("🎯 Constraint Satisfaction Problems - Python Demo")
    print("Demonstrating AI algorithms for solving CSPs\n")
    
    try:
        demo_map_coloring()
        demo_sudoku()
        demo_n_queens()
        performance_analysis()
        
        print("\n" + "=" * 50)
        print("DEMO COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        print("\nKey Insights:")
        print("• Backtracking is effective for small to medium problems")
        print("• Performance degrades exponentially with problem size")
        print("• Heuristics (MRV, LCV) significantly improve performance")
        print("• CSPs are fundamental to many AI applications")
        
    except Exception as e:
        print(f"Error during demo: {e}")

if __name__ == "__main__":
    main() 