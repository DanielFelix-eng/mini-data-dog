import mongoose from  'mongoose'
 const  projectSchema =  new mongoose.Schema({
     name:{
         type:String, 
          required:true , 
          trim:true, 

     } ,
     description:{
         type:String, 
          required:true , 
          trim:true, 

     } ,
     owner:{
         type:mongoose.Schema.Types.ObjectId, 
          ref: 'User' , 
          trim:true,
           required:true 

     } ,
     enviroment:{
         type:String, 
          enum:['Devolpment', 'Staging' , 'Production'] ,
           default: 'Devolpment' 
          trim:true, 

     } ,
      
     status:{
         type:String, 
          enum: ['Active' ,'Archived'] , 
          default:'Active', 


     } , 
      {timestamps:true , }
 })
  export  default mongoose.model('Project' , projectSchema)