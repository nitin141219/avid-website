#!/bin/bash

echo ""
echo "========================================"
echo "  AVID Organics - Hostinger Deploy"
echo "  File Manager Only"
echo "========================================"
echo ""

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Build failed!"
    echo ""
    exit 1
fi

echo ""
echo "========================================"
echo "  Build Complete!"
echo "========================================"
echo ""
echo "FILES TO UPLOAD VIA HOSTINGER FILE MANAGER:"
echo ""
echo "1. Open Hostinger File Manager"
echo "2. Navigate to: public_html/ (or your app folder)"
echo "3. Upload these folders/files:"
echo ""
echo "   REQUIRED:"
echo "   - .next (entire folder)"
echo "   - package.json"
echo "   - package-lock.json"
echo "   - public (if it has assets)"
echo ""
echo "4. After upload, go to Terminal in File Manager"
echo "5. Run: npm install --production"
echo "6. Run: npm start"
echo ""
echo "The app will run on your domain on port 3000"
echo "(Hostinger auto-maps it to port 80/443)"
echo ""


