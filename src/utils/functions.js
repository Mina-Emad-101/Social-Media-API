import Notification from "../models/notification.js";

const notifDataMap = {
  new_post: "has uploaded a new post",
  like_post: "has liked your post",
  comment: "has commented on your post",
  like_comment: "has liked your comment",
};

export const sendNotification = async (from, from_name, to, type) => {
  if (from === to) return;
  const notification = new Notification({
    from: from,
    to: to,
    data: `${from_name} ${notifDataMap[type]}`,
  });
  await notification.save().catch((err) => console.log(err));
};
