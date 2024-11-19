import multer from 'multer';

const LIMITS_VALUE_IN_OCT = 45 * 1024 * 1024;
const upload = multer({ limits: LIMITS_VALUE_IN_OCT });

export default upload;