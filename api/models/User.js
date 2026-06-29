import mongoose from "mongoose";
 
 import bcrypt from 'bcryptjs'
  const userSchema  =   new mongoose({
     name:{
         type:String, 
         required:[true,'Name is required'],
   trim:true, 
    minlength:[2, 'Name must be atleast 2 characters'] , 

     maxlength:[50, 'Name must  not   exceed 2 characters']
   
 }  ,
  
  email:{
     type:String, 
      required:[true , 'Email is required'] , 

       unique:true , 
       lowercase:true, 
        trim:true, 
        
  } , 
   password : { 
     type:String , 
     required:[true, 'Password is required'], 

   }, 

  
  }, {timestamps:true} )
   
  export default mongooose.model('User' , userSchema)