import multer, { diskStorage } from "multer";
import path from "path";

const storage = diskStorage({
    filename(req, file, cb)
    {
        let ext = path.extname(file.originalname || "").toLowerCase();
        let safeExt = [".jpeg", ".jpg", ".png", ".webp"].includes(ext) ? ext : "";
        let unique = `${Date.now()}-${Math.round(Math.random()*1e9)}`;
        cb(null, `${unique}${safeExt}`);
    }
});

const fileFilter = (req, file, cb) =>
{
    let allowedTypes = /jpeg|jpg|png|webp/;
    let extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    let mimeType = allowedTypes.test(file.mimetype);

    if (extname && mimeType)
        cb(null, true);
    else
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});