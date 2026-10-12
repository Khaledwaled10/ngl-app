import { finduserById } from "../../user/repository/user.repository.js";
import * as errorUser from "../../user/error/error.js"
import * as messageRepository from "../repository/message.repository.js"

export async function sendMessage(content,receiver,sender){
    const user =await finduserById(receiver);
    if(!user){
        throw  errorUser.userNotExist();
    } 

return await messageRepository.sendMessage(content,receiver,sender)


}

export async function getMessage(userId) {
    
    return await messageRepository.getMessages(userId)
}
