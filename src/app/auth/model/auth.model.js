import { model, Schema } from "mongoose";
import { boolean } from "zod";

const schemaUser = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    Dob: Date,
    gander: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },

    loginAttempts: {
  type: Number,
  default: 0,
},


lockUntil: {
  type: Date,
  default: null,
},


twoFactorEnabled: {
  type: Boolean,
  default: false,
},

    profilePicPath:String,
    coverImagePaths:[String],
    cvPath:String
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
);

export const User = model("User", schemaUser);
