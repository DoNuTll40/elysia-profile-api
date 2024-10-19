
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = (req: any) => {
    return new Promise((resolve, reject) => {
      upload.single('image')(req.raw, req.raw.res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(req.file); // ส่งคืนไฟล์เมื่ออัปโหลดเสร็จ
      });
    });
  };

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../../uploads");
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
    },
});

export const upload = multer({storage});
