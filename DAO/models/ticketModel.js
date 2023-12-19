import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
  },
  purchase_datetime: Date,
  quantity: Number,
  purchaser: String,
  created_at: Date,
  updated_at: Date,
  products: [
    {
      name: String,
      price: Number,
      quantity: Number,
      totalPrice: Number,
    }
  ],
  totalAPagar: Number,
});

ticketSchema.plugin(mongoosePaginate);

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
