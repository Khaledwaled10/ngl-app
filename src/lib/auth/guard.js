import jwt from 'jsonwebtoken';
import { AppError } from '../../pkj/error/appError.js';

 

export function guard(req,res,next){


    try {
        
    const token=req.cookies.access_token;
    if(!token) throw new AppError('No token provider',401);

    req.user=jwt.verify(token,process.env.JWT_SECRET_KEY)



    next()

    } catch (error) {
       
        next(error)

    }



}