
import { model, Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
  },
  { timestamps: true }
);


export const Conversation = model(
  "Conversation",
  conversationSchema
);
