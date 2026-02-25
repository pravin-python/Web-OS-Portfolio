#!/bin/bash

# run.sh - Helper script for Linux/macOS

echo "========================================"
echo "  Project Helper Script (Linux/macOS)   "
echo "========================================"

case "$1" in
  install)
    echo "Installing dependencies..."
    npm install
    ;;
  build)
    echo "Building project..."
    npm run build
    ;;
  dev)
    echo "Starting development server..."
    npm run dev
    ;;
  docker)
    echo "Running in Docker..."
    docker-compose up --build
    ;;
  test)
    echo "Running tests..."
    npm run test
    ;;
  lint)
    echo "Running linter..."
    npm run lint
    ;;
  *)
    echo "Usage: ./run.sh {install|build|dev|docker|test|lint}"
    echo ""
    echo "  install  - Install Node.js dependencies"
    echo "  build    - Build the project for production"
    echo "  dev      - Run local development server"
    echo "  docker   - Build and run in Docker container"
    echo "  test     - Run tests"
    echo "  lint     - Run linter"
    exit 1
    ;;
esac
