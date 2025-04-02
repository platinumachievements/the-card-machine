# Git Command Cheatsheet

## ⚡ Quick Update Commands

```bash
# Quick GitHub update sequence
git add .                                # Stage all changes
git commit -m "feat: your message here"  # Commit with a message
git push origin main                     # Push to GitHub
```

## 🔍 Check Repository Status

```bash
# See what files have changed
git status

# View detailed changes in files
git diff

# View commit history
git log
```

## 📥 Getting Updates

```bash
# Download latest changes from remote (doesn't merge)
git fetch

# Download and merge latest changes from remote
git pull origin main
```

## 💾 Saving Changes

```bash
# Stage all changes
git add .

# Stage specific files
git add file1.ts file2.ts

# Unstage a file
git restore --staged <file>

# Discard all uncommitted changes
git restore .
```

## 📝 Commit Conventions

### Feature Development
```bash
# New feature
git commit -m "feat: add user authentication flow"

# Breaking change
git commit -m "feat!: change API response format for user endpoints"

# Work in progress
git commit -m "wip: implement shopping cart functionality"
```

### Fixes & Improvements
```bash
# Bug fix
git commit -m "fix: resolve null pointer in payment processor"

# Multiple scopes 
git commit -m "fix(auth,api): resolve login issue affecting external API"

# Performance improvement
git commit -m "perf: optimize database queries"
```

### Maintenance
```bash
# Code refactoring
git commit -m "refactor: simplify order calculation logic"

# Style changes
git commit -m "style: format code according to project guidelines"

# Dependency updates
git commit -m "chore: update dependencies to latest versions"
```

### Documentation & Testing
```bash
# Documentation
git commit -m "docs: update API documentation"

# Adding tests
git commit -m "test: add unit tests for auth service"
```

## 📤 Publishing Changes

```bash
# Send commits to remote repository
git push origin main
```

## 🌿 Branch Management

```bash
# Create and switch to a new branch
git checkout -b feature-branch

# Switch to existing branch
git checkout main

# List all branches
git branch

# Merge another branch into current branch
git merge feature-branch

# Delete a branch
git branch -d feature-branch
```

## ⚙️ Configuration

```bash
# Set your username
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"
```

