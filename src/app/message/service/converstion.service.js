import * as conversationRepository from "../repository/converstion.repository.js"
import * as userRepository from "../../user/repository/user.repository.js"

import * as messageRepository from "../repository/message.repository.js";
import * as requestRepository from "../repository/request.repository.js"
import { AppError } from "../../../pkj/error/appError.js";
export async function createConverstion(requestId,receiverId){
   //search request id

    const identityRequest =
    await requestRepository.findRequestById(requestId);


   //if not  request 
  if (!identityRequest) {
    throw new AppError("Identity request not found", 404);
  }

   // if request.sender 

     if (identityRequest.sender.toString() !== receiverId.toString()) {
    throw new AppError(
      "You are not allowed to create this conversation",
      403
    );
  }


   // if request.status!== accept

  if (identityRequest.status !== "accepted") {
    throw new AppError(
      "Identity request must be accepted first",
      400
    );
  }

const originalMessage=await messageRepository.findMessageById(identityRequest.message)

  if (!originalMessage || originalMessage.isDeleted) {
    throw new AppError("Original message not found", 404);
  }



    const existingConversation =
    await conversationRepository.findConversationByMessage(
      originalMessage._id
    );

  if (existingConversation) {
    return existingConversation;
  }

  return await conversationRepository.createConversation({
    sender: identityRequest.requester,
    receiver: identityRequest.sender,
    originalMessage: originalMessage._id,
  });




}



export async function getUserConversations(userId) {
  return await conversationRepository.getUserConversations(userId);
}