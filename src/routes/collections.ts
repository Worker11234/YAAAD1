import { Router } from 'express';
import { validate, schemas } from '../middleware/validation';
import { CollectionsController } from '../controllers/collectionsController';

const router = Router();
const collectionsController = new CollectionsController();

// Get all collections for the authenticated user
router.get('/', collectionsController.getCollections);

// Get a single collection by ID
router.get('/:id', collectionsController.getCollectionById);

// Create a new collection
router.post(
  '/',
  validate(schemas.collectionCreate),
  collectionsController.createCollection
);

// Update a collection
router.put(
  '/:id',
  validate(schemas.collectionUpdate),
  collectionsController.updateCollection
);

// Delete a collection
router.delete('/:id', collectionsController.deleteCollection);

// Add memories to a collection
router.post(
  '/:id/memories',
  validate(schemas.collectionAddMemories),
  collectionsController.addMemoriesToCollection
);

// Remove memories from a collection
router.delete(
  '/:id/memories',
  validate(schemas.collectionRemoveMemories),
  collectionsController.removeMemoriesFromCollection
);

// Auto-generate a collection
router.post(
  '/auto-generate',
  validate(schemas.collectionAutoGenerate),
  collectionsController.autoGenerateCollection
);

export default router;