import * as messageRepository from "../repository/message.repository.js"
import * as requestRepository from "../repository/request.repository.js"
import { AppError } from './../../../pkj/error/appError.js';
export async function requestSenderIdentity(messageId,requesterID){

    // finde messsage
const message=await messageRepository.findMessageById(messageId)


if (!message || message.isDeleted) {
    throw new Error("Message not found");
  }


    //message.reciver !== requsterId

    if(message.receiver.toString()!==requesterID.toString()){
    throw new Error("You are not allowed to request this identity");
    }



    //!message.sender
if(!message.sender){
    throw new Error("Sender not found");

}

//message.id === requset.id

if(message.sender.toString()===requesterID.toString()){
    
    throw new Error("You cannot request your own identity");
}    






//exist request
const existRequest=await requestRepository.findRequset(messageId,requesterID)
    
if(existRequest){

    throw new Error("You have already requested this identity");
}

    //create requst
      return await requestRepository.createRequest({
    message: message._id,
    requester: requesterID,
    sender: message.sender,
    status: "pending",
  });


}




export async function getIdentityRequests(senderId) {
  return await requestRepository.getRequestSender(senderId);
}


export async function acceptOrRejectRequest(requestID,sender,status){

  const existRequest=await requestRepository.findRequestById(requestID)
  
if(!existRequest){

    throw new Error("This request Not Exist");
}

if(existRequest.sender.toString()!==sender.toString()){
   throw new Error("You are not allowed to update this request");
}

if (existRequest.status !== "pending") {
  throw new Error("This request has already been processed");
}
return await requestRepository.updateRequsetStatus(
  requestID,
  status
);



}