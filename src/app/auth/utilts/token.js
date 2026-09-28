import jwt from "jsonwebtoken";


export function genrateToken(payLoad){
    return jwt.sign(payLoad,process.env.JWT_SECRET_KEY,{expiresIn:'1h'})
}