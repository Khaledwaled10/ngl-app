import { model, Schema } from "mongoose";


const shemaOtp=new Schema(
    {
     code:{type:String,required:true,length:6},
     email:{type:String,required:true,lowercase:true,trim:true},
        expiredAt:{type:Date,required:true,index:{expires:0}}
    },
    {
        timestamps:{
            createdAt:true,
            updatedAt:false
        }   

    }
)


export const Otp=model('Otp',shemaOtp)