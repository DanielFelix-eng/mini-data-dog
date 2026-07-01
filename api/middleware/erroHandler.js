import  ErrorLog  from   '../models/ErrorLog.js'
 const errorHandler = async (err,req,res , next) => {
    console.error(`[Error] ${error.message}`)
      
     try {
        await  ErrorLog.create({
             message: err.message,
              stack:err.stack, 
               route:req.originalUrl,
               method: req.method,  
              
        })
     } catch (error) {
        
     }
      
 }