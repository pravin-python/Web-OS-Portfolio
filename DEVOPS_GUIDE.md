# DevOps Configuration Guide

This document contains the complete DevOps setup for the frontend application, including Dockerization, CI/CD pipelines, and automation scripts.

## File: Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

## File: .dockerignore

```text
node_modules
.git
.github
.husky
.vscode
.idea
dist
coverage
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
.DS_Store
Thumbs.db
Dockerfile
docker-compose.yml
*.md
LICENSE
```

## File: nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

## File: docker-compose.yml

```yaml
services:
  frontend:
    build: .
    container_name: frontend
    ports:
      - "80:80"
    restart: always
```

## File: .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run Lint
        run: npm run lint

      - name: Run Tests
        run: npm test

      - name: Build
        run: npm run build
```

## File: .github/dependabot.yml

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

## File: .lintstagedrc

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md,html}": ["prettier --write"]
}
```

## File: run.sh

```bash
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
```

## File: run.bat

```batch
@echo off
setlocal

echo ========================================
echo   Project Helper Script (Windows)
echo ========================================

if "%1"=="install" goto install
if "%1"=="build" goto build
if "%1"=="dev" goto dev
if "%1"=="docker" goto docker
if "%1"=="test" goto test
if "%1"=="lint" goto lint
goto help

:install
echo Installing dependencies...
call npm install
goto end

:build
echo Building project...
call npm run build
goto end

:dev
echo Starting development server...
call npm run dev
goto end

:docker
echo Running in Docker...
docker-compose up --build
goto end

:test
echo Running tests...
call npm run test
goto end

:lint
echo Running linter...
call npm run lint
goto end

:help
echo Usage: run.bat {install|build|dev|docker|test|lint}
echo.
echo   install  - Install Node.js dependencies
echo   build    - Build the project for production
echo   dev      - Run local development server
echo   docker   - Build and run in Docker container
echo   test     - Run tests
echo   lint     - Run linter

:end
endlocal
```
