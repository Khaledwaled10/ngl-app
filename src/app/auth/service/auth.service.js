import * as authRepository from '../repository/auth.repository.js'
import bcrypt from 'bcrypt'
import * as otpRepository from '../repository/otp.repository.js';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from '../../../common/email/mailer.js';

import * as userRepository from '../../user/repository/user.repository.js';
import { toMs } from '../../../common/time/time.js';

export async function register(userData){


    const userExist=await authRepository.userExist(userData.email)
    if(userExist) throw new Error('User Already Exist');

  userData.password = await bcrypt.hash(userData.password, 10);
    const Createuser=await authRepository.createUser(userData);
const code=crypto.randomInt(100000,999999).toString()
   await otpRepository.createOtp({
        code:code,
        email:userData.email,
        expiredAt:new Date(  Date.now()+toMs(5,'minutes'))
    })
await sendEmail(userData.email,'Vervication code', `<h1>OTP CODE: ${code}</h1>`)
return Createuser;
}

export async function verfiyAccount(email,code){
// user exist 
const userExist =await authRepository.userExist(email)


if(!userExist) throw new Error('User Not exist')

//acount verfied
if(userExist.isVerified==true) throw  new Error ('User is Verfied')

//code exist

const otp=await otpRepository.getOtp(email)
if(!otp) throw  new Error ('Otp Expired ,please resend')
//code true
if(otp.code!==code) throw  new Error ('Code is Invalid')

//update user
const updateUser=await userRepository.updateUser(email,{isVerified:true})

//delet otp
await otpRepository.deleteOtp(email)

return updateUser;


} 



export async function login(email,password){
//exist user

 
const userExist =await authRepository.userExist(email)


if(!userExist) throw new Error('User Not exist')



//user verfied

if(!userExist.isVerified) throw  new Error ('User is not Verfied')
//compare password

const match =await bcrypt.compare(password,userExist.password)
if(!match) throw new Error ('Password not matched')

//gen tokeen
const token =jwt.sign({
    id:userExist.id,
    name:userExist.name,
    email:userExist.email

},process.env.JWT_SECRET_KEY,{expiresIn: toMs(1,'hours') })

return token;

}



export async function sendOtp(email){
//user exist

const user =await authRepository.userExist(email);

if(!user) throw new Error("User not exist")

//user not verfiy

if(user.isVerified===true) throw new Error('User is verified')

//delete old otp
 
await otpRepository.deleteOtp(email)

//generate otp

const code=crypto.randomInt(100000,999999).toString()
await otpRepository.createOtp({
  code,
  email: user.email,
  expiredAt: new Date(Date.now() + toMs(5, "minutes")),
});


//send otp
sendEmail(user.email,'Vervication code', `<h1>OTP CODE: ${code}</h1>`)



}


