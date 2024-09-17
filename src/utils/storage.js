import multer from "multer";
import path from "path";

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, done) =>
    done(null, path.join(import.meta.dirname, "/../public/attachments")),
  filename: (req, file, done) => done(null, Date.now().toString()),
});

const upload = multer({ storage: fileStorageEngine });

export default upload;
