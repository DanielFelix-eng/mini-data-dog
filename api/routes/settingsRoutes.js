import express from 'express';
import * as settingsController from '../controlllers/settingsController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/settings', verifyToken, settingsController.getSettings);
router.post('/settings', verifyToken, settingsController.updateSettings);
router.put('/settings', verifyToken, settingsController.updateSettings);
router.delete('/settings', verifyToken, settingsController.resetSettings);

export default router;