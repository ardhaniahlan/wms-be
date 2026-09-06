import { Router } from 'express';
import { 
  getAllLocations, 
  createNewLocation, 
  updateLocationById, 
  deleteLocationById 
} from './location.controller';

const router = Router();

router.get('/', getAllLocations);
router.post('/', createNewLocation);
router.put('/:id', updateLocationById);
router.delete('/:id', deleteLocationById);

export default router;