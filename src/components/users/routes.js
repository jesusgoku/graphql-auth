import { Router } from 'express';

import { list, get, create, update, remove } from './handlers';
import { createUserRequestSchema, updateUserRequestSchema } from './schemas';
import unhandledExceptionMiddleware from '../../shared/middlewares/unhandledException';
import validateSchemaMiddleware from '../../shared/middlewares/validateSchema';

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      return await handler(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
}

const router = Router();

router.get('/', asyncHandler(list));
router.get('/:id', asyncHandler(get));
router.post('/', validateSchemaMiddleware(createUserRequestSchema), asyncHandler(create));
router.put('/:id', validateSchemaMiddleware(updateUserRequestSchema), asyncHandler(update));
router.delete('/:id', asyncHandler(remove));
router.use(unhandledExceptionMiddleware);

export default router;
