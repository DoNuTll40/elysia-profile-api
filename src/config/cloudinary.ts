
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: 'donutll40', 
    api_key: '297848371783773', 
    api_secret: process.env.CLOUDINARY_SECRET, 
});

export default cloudinary;