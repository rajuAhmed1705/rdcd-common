/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2021-10-31 18:54:06
 * @modify date 2021-10-31 18:54:06
 * @desc [description]
 */

import multer from "multer";
import { BadRequestError } from "../errors/bad-request.error";

export const multerUpload = multer({
  limits: {
    fileSize: 5000000, //5MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new BadRequestError("file type not allowed"));
    }
  },
});
