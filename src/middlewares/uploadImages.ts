
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const uploadImages = async (set: any, image: any) => {
    try {
        // ตรวจสอบว่ามีการส่ง image มาหรือไม่
      if (!image || (Array.isArray(image) && image.length === 0)) {
        set.status = 400;
        return { message: "No images uploaded." };
      }

      const uploadedFiles = [];

      const files = Array.isArray(image) ? image : [image];

      if (files.length === 0) {
        set.status = 400;
        return { message: "No valid images uploaded." };
      }

      const pathUpload = []

      for (const file of files) {
        const uploadPath = path.join(__dirname, "../../uploads", uuidv4() + "." + file.name.split('.')[1]);
        pathUpload.push(uploadPath)
          try {
              const buffer = await file.arrayBuffer();
              const bufferData = Buffer.from(buffer);

              await fs.promises.writeFile(uploadPath, bufferData);

              uploadedFiles.push({ filename: file.name, path: uploadPath });

          } catch (err) {
              console.error(`Error writing file: ${err}`);
              set.status = 500;
              return { message: `Error writing file: ${err}` };
          }
      }

      return pathUpload;

    }catch(err: any){
        return {
            status: "Error",
            message: err.message
        }
    }
}