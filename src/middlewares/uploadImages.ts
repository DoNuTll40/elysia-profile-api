
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const uploadImages = async (set: any, image: any) => {
  try {
      console.log("Received images:", image);

      // ตรวจสอบว่ามีการส่ง image มาหรือไม่
      if (!image || (Array.isArray(image) && image.length === 0)) {
          set.status = 400;
          return { status: "Error", message: "No images uploaded." };
      }

      const uploadedFiles = [];
      const files = Array.isArray(image) ? image : [image];

      if (files.length === 0 || files[0]?.size === 0) {
          set.status = 400;
          return { status: "Error", message: "No valid images uploaded." };
      }

      const pathUpload = [];

      for (const file of files) {
          // log รายละเอียดไฟล์ที่กำลังจะถูกอัปโหลด
          console.log("Processing file:", file);

          const uploadPath = path.join(__dirname, "../../uploads", uuidv4() + "." + file.name.split('.').pop());
          pathUpload.push(uploadPath);
          try {
              if (file instanceof Blob || file instanceof File) {
                  const buffer = await file.arrayBuffer();
                  const bufferData = Buffer.from(buffer);
                  
                  await fs.promises.writeFile(uploadPath, bufferData);
                  uploadedFiles.push({ filename: file.name, path: uploadPath });
              } else {
                  console.error(`Invalid file type: ${file}`);
                  set.status = 400;
                  return { status: "Error", message: "Uploaded file is not valid." };
              }
          } catch (err) {
              console.error(`Error writing file: ${err}`);
              set.status = 500;
              return { status: "Error", message: `Error writing file: ${err}` };
          }
      }

      return pathUpload;

  } catch (err: any) {
      console.error(err);
      return {
          status: "Error",
          message: err.message
      };
  }
}
