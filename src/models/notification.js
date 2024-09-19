import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      required: true,
      default: null,
    },
    to: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const Notification = model("Notification", schema);

export default Notification;
