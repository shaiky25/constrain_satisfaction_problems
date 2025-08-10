# 🎯 Constraint Satisfaction Problems - AI Visualization

An interactive, AI-powered visualization tool that demonstrates how Constraint Satisfaction Problems (CSPs) work using various algorithms and techniques.

## 🌟 Features

### 📊 Interactive Visualizations
- **Map Coloring Problem**: Generate random maps and solve them using AI algorithms
- **Sudoku Solver**: Interactive 9x9 Sudoku puzzle with AI-powered solving
- **N-Queens Problem**: Visualize placing N queens on an N×N chessboard
- **Algorithm Comparison**: Compare different CSP solving techniques

### 🤖 AI Algorithms Implemented
- **Backtracking**: Systematic search with constraint checking
- **Forward Checking**: Enhanced backtracking with domain pruning
- **Arc Consistency (AC-3)**: Constraint propagation algorithm
- **Genetic Algorithm**: Evolutionary approach to CSP solving

### 📈 Performance Analytics
- Real-time performance metrics
- Algorithm comparison charts
- Solution time tracking
- Backtrack count analysis

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Running the Application
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start exploring the different CSP problems and algorithms!

## 📖 How to Use

### Overview Tab
- Learn about CSP fundamentals
- Understand variables, domains, and constraints
- Explore real-world applications
- See AI technique effectiveness ratings

### Map Coloring Tab
1. Click "Generate New Map" to create a random map with regions
2. Click "Solve with AI" to automatically color the map
3. View statistics including regions, colors used, backtracks, and solve time
4. Use "Reset" to clear the solution

### Sudoku Tab
1. Click "Generate Puzzle" to create a new Sudoku puzzle
2. Click cells to manually input numbers (1-9)
3. Click "Solve with AI" to automatically solve the puzzle
4. Watch the solving process with animated highlights
5. Use "Clear" to reset the grid

### N-Queens Tab
1. Adjust the slider to select the number of queens (4-12)
2. Click "Solve" to find a valid solution
3. Click "Animate" to see the queens being placed step by step
4. View performance metrics in the chart

### Algorithms Tab
1. Select different algorithms to compare
2. View detailed explanations and time complexity
3. See visual representations of how each algorithm works
4. Compare performance across different approaches

## 🧠 CSP Concepts Explained

### What are Constraint Satisfaction Problems?
CSPs are mathematical problems defined as a set of objects whose state must satisfy a number of constraints or limitations. They consist of:

- **Variables**: Objects that need values assigned
- **Domains**: Possible values for each variable
- **Constraints**: Rules that limit value combinations

### Common CSP Problems
1. **Map Coloring**: Color regions so adjacent areas have different colors
2. **Sudoku**: Fill a 9×9 grid with numbers following specific rules
3. **N-Queens**: Place N queens on an N×N chessboard without conflicts
4. **Scheduling**: Assign tasks to time slots with resource constraints

### AI Techniques Used

#### Backtracking
- **How it works**: Systematically tries different value assignments
- **When to backtrack**: When a constraint is violated
- **Complexity**: O(d^n) where d is domain size, n is number of variables

#### Forward Checking
- **Improvement**: Removes inconsistent values from unassigned variables
- **Benefit**: Reduces search space early
- **Use case**: When you want to fail fast

#### Arc Consistency (AC-3)
- **Process**: Ensures every value has compatible values in other variables
- **Complexity**: O(d³n²)
- **Advantage**: Stronger pruning than forward checking

#### Genetic Algorithm
- **Inspiration**: Natural selection and evolution
- **Process**: Population of solutions evolves over generations
- **Best for**: Large, complex problems where exact solutions are hard to find

## 🎨 Technical Implementation

### Frontend Technologies
- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Interactive functionality and algorithms
- **Chart.js**: Data visualization and analytics
- **Canvas API**: Custom graphics and animations

### Algorithm Implementation
- **Modular Design**: Each algorithm is implemented as a separate class/method
- **Performance Tracking**: Real-time measurement of execution time
- **Visual Feedback**: Step-by-step visualization of algorithm execution
- **Error Handling**: Graceful handling of unsolvable problems

### Responsive Design
- **Mobile-friendly**: Works on tablets and smartphones
- **Adaptive Layout**: Grid system adjusts to screen size
- **Touch Support**: Interactive elements work with touch input

## 🔧 Customization

### Adding New Problems
1. Create a new tab in the HTML
2. Implement the problem logic in JavaScript
3. Add visualization methods
4. Update the tab switching logic

### Modifying Algorithms
1. Locate the algorithm implementation in `script.js`
2. Modify the solving logic
3. Update the visualization methods
4. Test with different problem instances

### Styling Changes
1. Edit `styles.css` for visual modifications
2. Update color schemes in the CSS variables
3. Modify animations and transitions
4. Adjust responsive breakpoints

## 📊 Performance Considerations

### Optimization Techniques
- **Memoization**: Cache computed results
- **Early Termination**: Stop when solution is found
- **Heuristic Ordering**: Choose variables and values intelligently
- **Constraint Propagation**: Reduce search space early

### Browser Compatibility
- **Modern Browsers**: Full functionality
- **Older Browsers**: Basic functionality with graceful degradation
- **Mobile Browsers**: Touch-optimized interface

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a pull request

### Areas for Improvement
- Add more CSP problems (graph coloring, scheduling)
- Implement additional algorithms (local search, simulated annealing)
- Enhance visualizations with 3D graphics
- Add machine learning-based heuristics
- Improve mobile experience

## 📚 Educational Value

This visualization tool is perfect for:
- **Students**: Learning CSP concepts and algorithms
- **Educators**: Teaching AI and constraint satisfaction
- **Researchers**: Prototyping and testing algorithms
- **Enthusiasts**: Understanding how AI solves complex problems

## 🎓 Learning Outcomes

After using this tool, you'll understand:
- How constraint satisfaction problems are structured
- Why different algorithms perform differently
- When to use specific solving techniques
- How AI approaches complex optimization problems
- The trade-offs between solution quality and computation time

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Chart.js for data visualization
- P5.js for creative coding capabilities
- The AI and CSP research community
- Open source contributors and educators

---

**Happy Learning! 🚀**

Explore the fascinating world of Constraint Satisfaction Problems and see how AI algorithms tackle complex optimization challenges. 