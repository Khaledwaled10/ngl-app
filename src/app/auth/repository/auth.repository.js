import { User } from './../model/auth.model.js';
export async function userExist (email){
return await User.findOne({email:email})
}

export async function createUser (userData){
return await User.create(userData)
}

