import { Router } from 'express';
import { validate, schemas } from '../middleware/validation';
import { PeopleController } from '../controllers/peopleController';

const router = Router();
const peopleController = new PeopleController();

// Get all people for the authenticated user
router.get('/', peopleController.getPeople);

// Get a single person by ID
router.get('/:id', peopleController.getPersonById);

// Create a new person
router.post(
  '/',
  validate(schemas.personCreate),
  peopleController.createPerson
);

// Update a person
router.put(
  '/:id',
  validate(schemas.personUpdate),
  peopleController.updatePerson
);

// Delete a person
router.delete('/:id', peopleController.deletePerson);

// Get memories for a person
router.get('/:id/memories', peopleController.getPersonMemories);

// Verify face detection
router.post(
  '/faces/verify',
  validate(schemas.faceVerify),
  peopleController.verifyFace
);

export default router;