import authservice from '../services/authservice.js'
 import { successResponse } from '../utils/response.js'
  export const signUp =  async(req,res,next)=>{
     try {
        const data = await authservice.signUp(req.body)
         successResponse(res,data, 'Account created')
     } catch (error) {
        
         next(err)
     } 
      
  } 
  export const login =  async(req,res,next) =>{
     try {
        const data =   await authservice.login(req.body)
successResponse(res,data, 'logged in')
     } catch (error) {
         next(err)
        
     } 

  } 
  export  const getMe =  (req,res ) =>  successResponse(res,req.user)
    export const updateProfile =   async(req,res,next) =>{
         try {
            const user =  await authservice.updateProfile(req.user._id , 
                 req.body
            )
             successResponse(res,user  , 'Profile updated ')
         } catch (error) {
            
             next(err)
         } 

    } 
     export const  changePassword =  async (req,  res,next)  =>{
         try {
            await  authservice.changePassword(
                req.user._id, 
                 req.body.currentPassword, 
                 req.body.newPasssword
            )
             successResponse(res,null , 'updated')
         } catch (error) {
            next(err)
         }

     }
      export const deleteAccount =  async (req,res,next) =>{
         try {
            await  authservice.deleteAccount(req.user._id)
             successResponse(res,null ,'Acccount deleted ')
         } catch (error) {
            next(err)
             
         }
      }