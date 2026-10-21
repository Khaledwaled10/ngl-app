import { finduserById } from "../../user/repository/user.repository.js";
import * as errorUser from "../../user/error/error.js"
import * as messageRepository from "../repository/message.repository.js"
import * as requestRepository from "../repository/request.repository.js"
import { request } from "express";



export async function sendMessage(
  content,
  receiver,
  sender,
  type = "anonymous"
) {
  const user = await finduserById(receiver);

  if (!user) {
    throw errorUser.userNotExist();
  }

  return await messageRepository.sendMessage(
    content,
    receiver,
    sender,
    type
  );
}




export async function getMessage(userId) {
  const messages = await messageRepository.getMessages(userId);

  const acceptedRequests =
    await requestRepository.getAcceptedRequests(
      messages.map((msg) => msg._id),
      userId
    );


    
for (const msg of messages) {
  if (msg.type === "public") {
    continue;
  }

  const accepted = acceptedRequests.some(
    (req) => req.message.toString() === msg._id.toString()
  );

  if (!accepted) {
    msg.sender = undefined;
  }
}

  


  return messages;
}

