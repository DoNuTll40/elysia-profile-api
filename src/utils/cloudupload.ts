import cloudinary from "../config/cloudinary";

export const cloudUpload = async (path: any) => {
    const res = await cloudinary.uploader.upload(path);
    return res.secure_url;
}