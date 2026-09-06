import express, { Request, Response } from 'express';
import cors from 'cors';
import itemRoutes from './features/items/item.route';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('WMS Backend API is Running!');
});

app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});