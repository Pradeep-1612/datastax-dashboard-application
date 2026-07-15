import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import documentRouter from './documents/DocumentRoutes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// BFF API routes
app.use(documentRouter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Determine the correct path for React static files
// When packaged with pkg, __dirname points to the snapshot filesystem
// The assets are included relative to the project root in the snapshot
const reactPath = path.join(__dirname, '..', '..', 'datastax-dashboard-spa', 'dist');

// console.log(`React static files path: ${reactPath}`);
// console.log(`Current __dirname: ${__dirname}`);

// Serve static files under the /DataOnTheHouse/ base path
app.use('/DataOnTheHouse', express.static(reactPath));

// Root redirect to the app
app.get('/', (_req: Request, res: Response) => {
  res.redirect('/DataOnTheHouse/');
});

// Catch-all middleware to serve React app for client-side routing
// This handles all routes under /DataOnTheHouse that weren't matched by static files
// Must be last to allow other routes and static files to be served first
app.use('/DataOnTheHouse', (_req: Request, res: Response) => {
  res.sendFile(path.join(reactPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Application Backend server running on http://localhost:${port}`);
  // console.log(`Serving React app from: ${reactPath}`);
  console.log(`\n\n🌐 Open application at: http://localhost:${port}/DataOnTheHouse`);
});
