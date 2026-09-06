import { Router } from 'express';
import { 
  getAllWarehouses, 
  createNewWarehouse, 
  updateWarehouseById, 
  deleteWarehouseById 
} from './warehouse.controller';

const router = Router();

router.get('/', getAllWarehouses);
router.post('/', createNewWarehouse);
router.put('/:id', updateWarehouseById);
router.delete('/:id', deleteWarehouseById);

export default router;