import multer, { Field, FileFilterCallback, Options } from "multer";
import fs from "fs"
import { BadRequestError } from "./appErrors";
import { Request } from "express";

//adjust how files are stored
const storage = multer.diskStorage({
  destination: function (req:Request, file:Express.Multer.File, cb:any) {
    let dir = process.cwd();
    console.log(
      "This is the directory:..........\n...................... ",
      dir
    );
    //Sets destination for fileType
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      dir = dir + `/uploads/images`;
    } else {
      dir = dir + `/uploads/pdfs`;
    }

    fs.mkdir(dir, { recursive: true }, (err:any) => cb(err, dir));
  },
  filename: function (req:Request, file:Express.Multer.File, callback:any) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = function (req:Request, file:Express.Multer.File, callback:any) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "application/octet-stream"
  ) {
    callback(null, true);
  } else {
    callback(
      new BadRequestError(
        "Error uploading file, Must either be Jpgs, docx,doc, png or csv"
      ),
      false
    );
  }
};

function fileSize (): number {
  const size:number = 1024 * 1024 * 15;
 return size;
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileSize(),
  },
  fileFilter: fileFilter,
});
