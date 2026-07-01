import {configStore}  from '@reduxjs/toolkit'  
import {authSlice} from './slices/authSlice.js'
export const store=  configStore({
     reducer:{ 
auth: authReducer
     } , 
})