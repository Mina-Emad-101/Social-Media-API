import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  value: {
    type: String,
    required: true,
  },
});

const RefreshToken = model("RefreshToken", schema);

export default RefreshToken;
