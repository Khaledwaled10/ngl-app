import {z}from "zod"
import { AppError } from "../error/appError.js"

export function validationBody(dto,body){
const result=dto.safeParse(body)

if(result.success===false){
  const errorMessage = result.error.issues.map(issue=> `${issue.path} : ${issue.message}`)
throw new AppError(errorMessage.join(' , '),400)

}

return result.data;

}