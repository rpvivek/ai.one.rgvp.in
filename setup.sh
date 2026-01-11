#!/bin/bash

# Complete setup script for One.RGVP.IN React Application
# This script automates the entire project setup process

set -e  # Exit on error

echo "=================================="
echo "One.RGVP.IN - Project Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}Warning: Node.js version 20 or higher is recommended${NC}"
    echo "Current version: $(node -v)"
    echo "Please upgrade Node.js for optimal performance"
    echo ""
fi

# Create directory structure
echo -e "${BLUE}Creating directory structure...${NC}"
mkdir -p src/{assets,components/common,context,pages,routes,services,styles,theme/{header,footer,sidebar,layout},utils}
mkdir -p public
echo -e "${GREEN}✓ Directory structure created${NC}"
echo ""

# Create .gitkeep files
echo -e "${BLUE}Creating .gitkeep files...${NC}"
touch src/assets/.gitkeep
touch src/components/common/.gitkeep
touch public/.gitkeep
echo -e "${GREEN}✓ .gitkeep files created${NC}"
echo ""

# Initialize package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo -e "${BLUE}Initializing package.json...${NC}"
    npm init -y
    echo -e "${GREEN}✓ package.json initialized${NC}"
    echo ""
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
echo "This may take a few minutes..."
echo ""

npm install --force --legacy-peer-deps \
    react@^19.0.0 \
    react-dom@^19.0.0 \
    react-router@^7.1.0 \
    @react-router/node@^7.1.0 \
    @react-router/serve@^7.1.0 \
    axios@^1.6.5 \
    js-cookie@^3.0.5 \
    lucide-react@^0.263.1 \
    clsx@^2.1.0

echo ""
echo -e "${GREEN}✓ Production dependencies installed${NC}"
echo ""

# Install dev dependencies
echo -e "${BLUE}Installing development dependencies...${NC}"
 npm install --force --legacy-peer-deps --save-dev \
    @types/react@^19.0.0 \
    @types/react-dom@^19.0.0 \
    @react-router/dev@^7.1.0 \
    autoprefixer@^10.4.17 \
    postcss@^8.4.33 \
    tailwindcss@^3.4.1 \
    typescript@^5.3.3 \
    vite@^6.0.0

echo ""
echo -e "${GREEN}✓ Development dependencies installed${NC}"
echo ""

# Initialize Tailwind CSS
echo -e "${BLUE}Initializing Tailwind CSS...${NC}"
npx tailwindcss init -p
echo -e "${GREEN}✓ Tailwind CSS initialized${NC}"
echo ""

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${BLUE}Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production build
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug logs
*.log

# Editor directories
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store

# TypeScript
*.tsbuildinfo

# React Router
.react-router/

# Temporary files
*.tmp
*.temp
.cache/
EOF
    echo -e "${GREEN}✓ .gitignore created${NC}"
    echo ""
fi

# Initialize Git repository
if [ ! -d ".git" ]; then
    echo -e "${BLUE}Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit: Complete React 19 enterprise application setup"
    echo -e "${GREEN}✓ Git repository initialized${NC}"
    echo ""
fi

# Create placeholder logo
echo -e "${BLUE}Creating placeholder assets...${NC}"
cat > public/logo.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#2563eb"/>
  <text x="50" y="65" font-family="Arial" font-size="40" fill="white" text-anchor="middle">RGVP</text>
</svg>
EOF
echo -e "${GREEN}✓ Placeholder logo created${NC}"
echo ""

# Print success message
echo ""
echo "=================================="
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "=================================="
echo ""
echo "Project structure:"
echo "one.rgvp.in/"
echo "├── src/"
echo "│   ├── assets/"
echo "│   ├── components/"
echo "│   ├── context/"
echo "│   ├── pages/"
echo "│   ├── routes/"
echo "│   ├── services/"
echo "│   ├── styles/"
echo "│   ├── theme/"
echo "│   └── utils/"
echo "├── public/"
echo "└── build/ (after running build)"
echo ""
echo "Next steps:"
echo "1. Copy all generated code files into their respective directories"
echo "2. Review and customize environment variables in vite.config.js"
echo "3. Run 'npm run dev' to start development server"
echo "4. Visit http://localhost:3000"
echo ""
echo "Available commands:"
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run start    - Serve production build"
echo "  npm run preview  - Preview production build"
echo ""
echo "Documentation:"
echo "  README.md         - Project documentation"
echo "  DEPLOYMENT.md     - Deployment guide"
echo ""
echo -e "${BLUE}Happy coding! 🚀${NC}"
echo ""