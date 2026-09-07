import { Router } from 'express';
import { 
  getAllLocations, 
  createNewLocation, 
  updateLocationById, 
  deleteLocationById, 
  getLocationById
} from './location.controller';

const router = Router();

router.get('/', getAllLocations);
router.post('/', createNewLocation);
router.get('/:id', getLocationById);
router.patch('/:id', updateLocationById);
router.delete('/:id', deleteLocationById);

export default router;