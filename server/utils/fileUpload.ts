import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types from tipos_queja.py and design requirements
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg', 
    'image/png'
  ];

  const allowedExtensions = /\.(pdf|doc|docx|jpg|jpeg|png)$/i;

  if (allowedMimes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten PDF, DOC, DOCX, JPG, PNG'));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit as specified in design
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: fileFilter
});

// Utility function to validate uploaded files
export function validateUploadedFiles(files: Express.Multer.File[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!files || files.length === 0) {
    return { valid: true, errors: [] }; // No files is valid (optional upload)
  }

  // Check file count
  if (files.length > 10) {
    errors.push('Máximo 10 archivos permitidos');
  }

  // Check individual files
  files.forEach((file, index) => {
    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      errors.push(`Archivo ${index + 1}: excede el límite de 5MB`);
    }

    // Check file exists
    if (!fs.existsSync(file.path)) {
      errors.push(`Archivo ${index + 1}: no se pudo guardar correctamente`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// Utility function to delete files
export function deleteFiles(filePaths: string[]): void {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  });
}

// Utility function to get file info
export function getFileInfo(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const name = path.basename(filePath);
    
    return {
      name,
      size: stats.size,
      extension: ext,
      path: filePath,
      exists: true
    };
  } catch (error) {
    return null;
  }
}
