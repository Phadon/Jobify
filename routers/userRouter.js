import { Router } from 'express'

import {
  authorizePermissions,
  checkForTestUser,
} from '../middleware/authMiddleware.js'
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js'
import upload from '../middleware/multerMiddleware.js'

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from '../controllers/userController.js'

const router = Router()

router.get('/current-user', getCurrentUser)
router.get('/admin/app-stats', [
  authorizePermissions('admin'),
  getApplicationStats,
])

/*
  upload is an instance of the Multer middleware that was created earlier.
  The .single() method is called on this instance to indicate that only one
  file will be uploaded. The argument 'avatar' specifies the name of the field
  in the HTTP request that corresponds to the uploaded file.
*/
router.patch(
  '/update-user',
  checkForTestUser,
  upload.single('avatar'),
  validateUpdateUserInput,
  updateUser
)

export default router
