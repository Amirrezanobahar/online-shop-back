import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path';



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/events/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});
  
 const upload = multer({
     storage,
     limits: { fileSize: 5 * 1024 * 1024 },
     fileFilter: (req, file, cb) => {
         const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
         allowedTypes.includes(file.mimetype)
             ? cb(null, true)
             : cb(new Error('فرمت فایل غیرمجاز است'), false);
     }
 });

export default upload.single('image')
