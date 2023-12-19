import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
  user:String,
  id: String,
  message: String,
});

export const messageModel = mongoose.model(messageCollection, messageSchema);