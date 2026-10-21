
import { IdentityRequest } from "../model/request.model.js";

export async function findRequset(message,requester){
     return IdentityRequest.findOne({
        message,
        requester
     })

}

export async function createRequest(data) {
  return await IdentityRequest.create(data);
}


export async function getRequestSender(sender) {
  return await IdentityRequest.find({
    sender
  }).populate("message","content createdAt").populate("requester", "name")
    .sort({ createdAt: -1 });
}


export async function findRequestById(requestId) {
  return await IdentityRequest.findById(requestId);
}

export async function updateRequsetStatus(requestId, status) {
  return await IdentityRequest.findByIdAndUpdate(requestId, {
    status: status
  });
}


export async function getAcceptedRequests(messageIds, requesterId) {
  return await IdentityRequest.find({
    message: { $in: messageIds },
    requester: requesterId,
    status: "accepted",
  }).select("message");
}
