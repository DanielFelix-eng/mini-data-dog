export const  suceesResponse  = (res  ,data  ,  message  = 'Success' , statusCode =  200 ) =>
     res.status(statusCode).json({success :true , message ,data})
 export const errorResponse =   (res ,  message  = 'Server  error' , status(statusCode).json({success :false , message})) 