import { Router } from "express";
import { messageModel } from "../DAO/models/chatModel.js";

const router = Router();

export const getMessages = async (req, res) => {
    try {
      let users = await messageModel.find();
      console.log(users);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  export const saveMessages = (req, res) => {
    let messages = [];
    res.json(messages);
  }

  export default router;