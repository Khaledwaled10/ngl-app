import { Router } from "express";
import * as messageController from './controller/message.controller.js'
import { guard } from "../../lib/auth/guard.js";
import * as identityRequestController from "./controller/requset.controller.js"
import * as converstionController from "./controller/converstion.controller.js"
const messageRouter=Router();


messageRouter.post("/", guard, messageController.sedMessage);

messageRouter.post(
  "/public",
  guard,
  messageController.sendPublicMessage
);



messageRouter.get(
  "/",
  guard,
  messageController.getMessage
);

// Request sender identity for a specific message
messageRouter.post(
  "/:messageId/identity-request",
  guard,
  identityRequestController.requestIdentity
);


messageRouter.get(
  "/get-request-sender",
  guard,
  identityRequestController.getRequestSender
);

messageRouter.patch(
  "/identity-requests/:requestId/accept",
  guard,
  identityRequestController.acceptIdentityRequest
);

messageRouter.patch(
  "/identity-requests/:requestId/reject",
  guard,
  identityRequestController.rejectIdentityRequest
);



messageRouter.post('/create-converstion',guard,converstionController.createConversion)

messageRouter.get(
  "/conversations",
  guard,
  converstionController.getUserConversations
);


export default messageRouter;

