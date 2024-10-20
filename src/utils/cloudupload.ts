
import cloudinary from "../config/cloudinary";
import fs from "fs";

export const cloudUpload = async (path: any) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(path, {
            folder: 'my-profile',
        });
    
        fs.promises.unlink(path)
              .then(() => console.log(`Upload finish, Deleted file: ${path}`))
              .catch((err) => {
                console.error(`Error deleting file: ${err}`)
                return {
                    status: "Error",
                    message: err.message
                }
            });
    
        return uploadResponse;
    }catch(err: any){
        return {
            status: "Error",
            message: err.message
        }
    }
}