import express from 'express'
import { getAllLogs, createLog, getLog, fetchDownTime } from '../controlllers/logcontroller.js' 
import { verifyToken } from '../middleware/verifyToken.js' 

const router = express.Router(); 
router.get('/get-logs', verifyToken, getAllLogs);   
router.post('/create-logs', verifyToken, createLog);   
router.get('/get-log/:id', verifyToken, getLog);
router.get('/downtime', verifyToken, fetchDownTime);

export default router;

  