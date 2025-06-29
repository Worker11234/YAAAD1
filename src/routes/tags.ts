import { Router } from 'express';
import { validate, schemas } from '../middleware/validation';
import { TagsController } from '../controllers/tagsController';

const router = Router();
const tagsController = new TagsController();

// Get all tags for the authenticated user
router.get('/', tagsController.getTags);

// Get tags for a specific memory
router.get('/memory/:memoryId', tagsController.getTagsByMemory);

// Create a new tag
router.post(
  '/',
  validate(schemas.tagCreate),
  tagsController.createTag
);

// Update a tag
router.put(
  '/:id',
  validate(schemas.tagUpdate),
  tagsController.updateTag
);

// Delete a tag
router.delete('/:id', tagsController.deleteTag);

// Get tag statistics
router.get('/stats', tagsController.getTagStats);

export default router;