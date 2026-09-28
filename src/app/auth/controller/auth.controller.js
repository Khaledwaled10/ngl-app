import { toMs } from "../../../common/time/time.js";
import { validationBody } from "../../../common/validation/validation.js";
import { loginDto, registerDto, sentDto, verfiyDto } from "../dto/auth.dto.js";
import * as authService from "../service/auth.service.js";
import { resetPasswordDto } from './../dto/auth.dto.js';

export async function register(req, res, next) {
  try {
  const data=  validationBody(registerDto,req.body)
    const user = await authService.register(data);

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function verfiyAccount(req, res, next) {
  try {
  const data=  validationBody(verfiyDto,req.body)
const {email,code}=data

    const userUpdate = await authService.verfiyAccount(email,code);

    return res.status(200).json({
      message: "User Verfied successfully",
      success: true,
      data: userUpdate,
    });
  } catch (error) {
    next(error);
  }
}



export async function login(req, res, next) {
  try {
  const data=  validationBody(loginDto,req.body)
    const {email,password}= data
    const token = await authService.login(email,password);
    res.cookie('access_token',token,{
        httpOnly:true,
        maxAge:toMs(1,'hours')
    })

    return res.status(201).json({
      message: "User Login successfully",
      success: true,

    });

  } catch (error) {
    next(error);
  }
}




export async function sendotp(req, res, next) {
  const data=  validationBody(sentDto,req.body)
  
  
  const {email}=data
    try {
    const token = await authService.sendOtp(email);
    return res.status(201).json({
      message: "Send Otp successfully",
      success: true,

    });

  } catch (error) {
    next(error);
  }
}



export async function resetPassword(req, res, next) {
  const data=  validationBody(resetPasswordDto,req.body)
 
  const {email,code,newPassword}=data
    try {

      await authService.resetPassword(email,code,newPassword)
    return res.status(201).json({
      message: "Reset Password successfully",
      success: true,
    });

  } catch (error) {
    next(error);
  }
}