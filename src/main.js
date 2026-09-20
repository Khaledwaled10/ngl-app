import { config } from 'dotenv';
config()
import  './common/db/mongoose.js'
import express from 'express'
import authRouter from './app/auth/auth.route.js';
import userRouter from './app/user/user.route.js';
import messageRouter from './app/message/message.route.js';
import { Otp } from './app/auth/model/otp.model.js';



const app=express();
app.use(express.json())

app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/message',messageRouter)

app.get('/test',(req,res)=>{

 res.json({message:"test success",success:true})
})

app.listen(3030,()=>{
    console.log("Server start in port 3030");
    
})

