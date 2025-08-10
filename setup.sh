#!/bin/bash

# CSP Visualization Setup Script
echo "🎯 Setting up Constraint Satisfaction Problems Visualization"
echo "=========================================================="

# Check if Python is installed
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 is installed"
else
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

# Make Python script executable
chmod +x csp_demo.py

echo ""
echo "🚀 Setup complete!"
echo ""
echo "To run the web visualization:"
echo "  open index.html"
echo ""
echo "To run the Python demo:"
echo "  python3 csp_demo.py"
echo ""
echo "To install additional dependencies (optional):"
echo "  pip3 install jupyter notebook"
echo ""
echo "Happy learning! 🎓" 