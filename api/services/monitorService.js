import  Monitor from '../models/monitor.js';
 export const  monitorService = async () =>{
     try{  
         const monitors =  await Monitor.find({
             enabled:true
         }).populate('project')
console.log('Found monitors , monitors.length:', monitors.length)
 return monitors
     }catch(error) {
            console.error('Error fetching monitors:', error);
     }
 }