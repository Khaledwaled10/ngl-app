import { Router } from "express";
import * as messageController from './controller/message.controller.js'
import { guard } from "../../lib/auth/guard.js";

const messageRouter=Router();

messageRouter.post('/',messageController.sedMessage)
messageRouter.post('/public',guard,messageController.sedMessage)
messageRouter.get(
  "/",
  guard,
  messageController.getMessage
);
export default messageRouter;

