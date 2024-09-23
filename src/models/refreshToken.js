import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const RefreshToken = model("RefreshToken", schema);

export default RefreshToken;
