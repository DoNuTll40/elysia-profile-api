import cloudinary from "../config/cloudinary"

export const cloudImgDelete = async (public_id: string) => {
    try {
       const deleteImage = await cloudinary.uploader.destroy(public_id, function(result){
        return result;
       })
       return deleteImage;
    }catch(err: any){
        return {
            status: "Error",
            message: err.message
        }
    }
}