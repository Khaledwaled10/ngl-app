import { toMs } from "../../../common/time/time.js";
import * as authService from "../service/auth.service.js";

export async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);

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
    const {email,code}= req.body
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
    const {email,password}= req.body
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
  const {email}=req.body
    try {
    const token = await authService.sendOtp(email);
    return res.status(201).json({
      message: "User Login successfully",
      success: true,

    });

  } catch (error) {
    next(error);
  }
}