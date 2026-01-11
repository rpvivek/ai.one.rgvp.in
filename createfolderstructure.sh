#!/bin/bash

# Create folder structure for One.RGVP.IN React App
# Run this script in your project root directory

echo "Creating folder structure for One.RGVP.IN..."

# Create root directories
mkdir -p src/{assets,components/common,context,pages,routes,services,styles,theme/{header,footer,sidebar,layout},utils}

# Create specific subdirectories
mkdir -p public

# Create placeholder files to maintain git structure
touch src/assets/.gitkeep
touch src/components/common/.gitkeep
touch src/context/.gitkeep
touch src/pages/.gitkeep
touch src/routes/.gitkeep
touch src/services/.gitkeep
touch src/styles/.gitkeep
touch src/theme/header/.gitkeep
touch src/theme/footer/.gitkeep
touch src/theme/sidebar/.gitkeep
touch src/theme/layout/.gitkeep
touch src/utils/.gitkeep
touch public/.gitkeep

echo "✅ Folder structure created successfully!"
echo ""
echo "Project Structure:"
echo "one.rgvp.in/"
echo "├── public/"
echo "├── src/"
echo "│   ├── assets/"
echo "│   ├── components/"
echo "│   │   └── common/"
echo "│   ├── context/"
echo "│   ├── pages/"
echo "│   ├── routes/"
echo "│   ├── services/"
echo "│   ├── styles/"
echo "│   ├── theme/"
echo "│   │   ├── header/"
echo "│   │   ├── footer/"
echo "│   │   ├── sidebar/"
echo "│   │   └── layout/"
echo "│   └── utils/"
echo ""
echo "Next steps:"
echo "1. chmod +x createfolder.sh"
echo "2. ./createfolder.sh"
echo "3. Copy the generated files into their respective directories"
