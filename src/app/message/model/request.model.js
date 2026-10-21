
import { model, Schema } from "mongoose";

const requestSchema = new Schema(
  {
    message: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },

    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    
  },
  {
    timestamps: true,
  }
);

requestSchema.index(
  { message: 1, requester: 1 },
  { unique: true }
);

export const IdentityRequest = model(
  "IdentityRequest",
  requestSchema
);
