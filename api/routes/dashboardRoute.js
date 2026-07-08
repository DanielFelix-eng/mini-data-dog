import express from 'éxpress'
 import  {getDashBoardStats} from '../controllers/dashboard.js' 
  const route=  express.Router()
   
   router.get('/stats' , getDashBoardStats)
    export default router