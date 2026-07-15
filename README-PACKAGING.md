# DataStax Dashboard Application - Build & Packaging Guide

This guide explains how to build and package the DataStax Dashboard application into standalone executables for Windows, macOS, and Linux.

## Architecture Overview

```text
React SPA (Vite)
      |
      | npm run build
      v
datastax-dashboard-spa/dist/    <-- React production files

server.ts (TypeScript)
      |
      | tsc (TypeScript compile)
      v
datastax-dashboard-bff/dist/server.js    <-- Express BFF JavaScript

      |
      | pkg
      v
Standalone Executables
├── DataOnTheHouse-win.exe (Windows)
├── DataOnTheHouse-macos (macOS)
└── DataOnTheHouse-linux (Linux)
```

## Project Structure

```text
datastax-dashboard-application/
│
├── datastax-dashboard-spa/          # React frontend
│   ├── src/
│   ├── dist/                        # Build output (created after build)
│   ├── package.json
│   └── vite.config.ts
│
├── datastax-dashboard-bff/          # Express backend
│   ├── src/
│   │   └── server.ts
│   ├── dist/                        # Build output (created after build)
│   │   └── server.js
│   ├── release/                     # Executables (created after packaging)
│   ├── package.json
│   └── tsconfig.json
│
├── build-and-package.sh             # Build script (Linux/macOS)
├── build-and-package.bat            # Build script (Windows)
└── README-PACKAGING.md              # This file
```

## Prerequisites

- Node.js 20+ installed
- npm installed
- All dependencies installed in both projects

## Quick Start

### Option 1: Using Build Scripts (Recommended)

**Linux/macOS:**
```bash
cd datastax-dashboard-application
chmod +x build-and-package.sh
./build-and-package.sh
```

**Windows:**
```cmd
cd datastax-dashboard-application
build-and-package.bat
```

### Option 2: Manual Build Steps

#### Step 1: Build React SPA
```bash
cd datastax-dashboard-spa
npm install
npm run build
```

This creates `datastax-dashboard-spa/dist/` with:
- `index.html`
- `assets/` (JS, CSS, images)

#### Step 2: Build Express BFF
```bash
cd ../datastax-dashboard-bff
npm install
npm run build
```

This compiles TypeScript and creates `datastax-dashboard-bff/dist/server.js`

#### Step 3: Package with pkg
```bash
npm run package
```

This creates executables in `datastax-dashboard-bff/release/`:
- `DataOnTheHouse-win.exe` (Windows x64)
- `DataOnTheHouse-macos` (macOS x64)
- `DataOnTheHouse-linux` (Linux x64)

## Configuration Details

### BFF package.json Configuration

```json
{
  "main": "dist/server.js",
  "bin": "dist/server.js",
  "pkg": {
    "assets": [
      "../datastax-dashboard-spa/dist/**/*"
    ],
    "targets": [
      "node18-win-x64",
      "node18-macos-x64",
      "node18-linux-x64"
    ],
    "outputPath": "release"
  }
}
```

**Key Points:**
- `main` and `bin` point to compiled JavaScript (not TypeScript)
- `assets` includes the React SPA dist folder
- `targets` specify Node 20 for all platforms
- `outputPath` defines where executables are created

### Important Note: Node Version

**pkg currently supports up to Node 18.** The targets are set to `node18-*` even if you're developing with Node 20+. The packaged executable will use Node 18 runtime, which is fully compatible with your code.

### TypeScript Configuration

The `tsconfig.json` is configured for CommonJS output (required by pkg):

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

### Vite Configuration

The `vite.config.ts` uses root base path for production:

```typescript
export default defineConfig({
  base: '/',  // Root path for production
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
```

## Running the Application

### Development Mode

**React SPA (with hot reload):**
```bash
cd datastax-dashboard-spa
npm run dev
# Runs on http://localhost:5173
```

**Express BFF (with auto-restart):**
```bash
cd datastax-dashboard-bff
npm run dev
# Runs on http://localhost:3000
```

### Production Mode (from source)

```bash
# Build both projects first
cd datastax-dashboard-spa && npm run build
cd ../datastax-dashboard-bff && npm run build

# Run the compiled BFF
npm start
# Runs on http://localhost:3000
# Serves React SPA at root
```

### Production Mode (from executable)

**Windows:**
```cmd
.\datastax-dashboard-bff\release\DataOnTheHouse-win.exe
```

**macOS:**
```bash
./datastax-dashboard-bff/release/DataOnTheHouse-macos
```

**Linux:**
```bash
./datastax-dashboard-bff/release/DataOnTheHouse-linux
```

The application will start on `http://localhost:3000` (or the port specified in `PORT` environment variable).

## Available NPM Scripts

### SPA (datastax-dashboard-spa)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### BFF (datastax-dashboard-bff)
- `npm run dev` - Start development server with auto-restart
- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:spa` - Build the React SPA
- `npm run build:all` - Build both SPA and BFF
- `npm start` - Run compiled server
- `npm run package` - Create executables (requires build first)
- `npm run package:all` - Build and package in one command

## How It Works

### 1. React SPA Build
Vite bundles the React application into optimized static files:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Generated `index.html`

### 2. TypeScript Compilation
The TypeScript compiler (`tsc`) converts `server.ts` to `server.js`:
- Resolves imports
- Compiles to CommonJS
- Generates JavaScript compatible with Node.js

### 3. Static File Serving
The Express server serves React files:
```typescript
const reactPath = path.join(__dirname, '../datastax-dashboard-spa/dist');
app.use(express.static(reactPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(reactPath, 'index.html'));
});
```

### 4. Packaging with pkg
`pkg` bundles everything into a single executable:
- Embeds Node.js runtime
- Includes compiled JavaScript
- Packages React static files as assets
- Creates platform-specific binaries

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Ensure all dependencies are in `dependencies`, not `devDependencies` in BFF package.json.

### Issue: React routes return 404
**Solution:** The catch-all route `app.get('*', ...)` must be after API routes.

### Issue: Assets not loading
**Solution:** Verify the `assets` path in pkg configuration matches your SPA dist folder.

### Issue: Executable too large
**Solution:** Add `"compress": "GZip"` to pkg configuration in package.json.

### Issue: "No available node version satisfies 'node20'"
**Solution:** pkg currently supports up to Node 18. Use `node18-win-x64`, `node18-macos-x64`, `node18-linux-x64` as targets. Your code will work fine with Node 18 runtime.

### Issue: Different Node versions needed
**Solution:** Check [pkg releases](https://github.com/vercel/pkg-fetch/releases) for available Node versions. Common options: `node16`, `node18`.

## Environment Variables

The application supports the following environment variables:

- `PORT` - Server port (default: 3000)
- Add your DataStax API credentials and other environment-specific variables as needed

## Distribution

To distribute the application:

1. Build and package using the scripts
2. Distribute the appropriate executable for each platform
3. Include any required configuration files or `.env` files
4. Provide instructions for setting environment variables

## Security Notes

- Never commit `.env` files with sensitive credentials
- Executables include your code but not environment variables
- Users must provide their own DataStax API credentials
- Consider code obfuscation for sensitive logic

## Performance

Executable characteristics:
- **Size:** ~50-80 MB (includes Node.js runtime)
- **Startup:** ~1-2 seconds
- **Memory:** Similar to running `node dist/server.js`
- **Performance:** No overhead compared to running from source

## Additional Resources

- [pkg documentation](https://github.com/vercel/pkg)
- [Vite build documentation](https://vitejs.dev/guide/build.html)
- [TypeScript compiler options](https://www.typescriptlang.org/tsconfig)
- [Express.js static files](https://expressjs.com/en/starter/static-files.html)

## Support

For issues or questions:
1. Check this documentation
2. Review the build scripts
3. Verify all configuration files
4. Check the console output for specific errors