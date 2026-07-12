import axios from 'axios';
import express, { Request, Response } from 'express';
import documentRouter from './documents/DocumentRoutes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use(documentRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`BFF server running on http://localhost:${port}`);
});
