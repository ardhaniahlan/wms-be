import express, { Request, Response } from 'express';
import cors from 'cors';
import itemRoutes from './features/items/item.route';
import warehouseRoutes from './features/warehouses/warehouse.route';
import locationRoutes from './features/locations/location.route';
import inventoryRoutes from './features/inventories/inventory.route';
import mutationRoutes from './features/mutations/mutation.route';
import userRoutes from './features/users/user.route';
import authRoutes from './features/auth/auth.route';
import { verifyToken } from './middlewares/auth.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use(verifyToken);

app.use('/api/items', itemRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/mutations', mutationRoutes);
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});