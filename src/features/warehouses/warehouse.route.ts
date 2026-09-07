import { Router } from 'express';
import { 
  getAllWarehouses, 
  createNewWarehouse, 
  updateWarehouseById, 
  deleteWarehouseById,
  getWarehousesById
} from './warehouse.controller';

const router = Router();

router.get('/', getAllWarehouses);
router.post('/', createNewWarehouse);
router.get('/:id', getWarehousesById);
router.patch('/:id', updateWarehouseById);
router.delete('/:id', deleteWarehouseById);

export default router;