import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Extend NextApiRequest to include file property
interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

const uploadDir = './public/books/cover';

// Pastikan direktori upload ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Get the title from the request body
    const title = req.body.title;
    // Create a safe filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    cb(null, `${safeTitle}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
}).single('cover');

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, as multer will handle it
  },
};

const handler = (req: any, res: any) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { title, sinopsis } = req.body;
    const fileReq = req as NextApiRequestWithFile;
    const cover = fileReq.file ? `/books/cover/${fileReq.file.filename}` : null;

    try {
      const newBook = await prisma.book.create({
        data: {
          title,
          cover,
          sinopsis,
        },
      });
      res.status(201).json(newBook);
    } catch (error) {
      console.error('Failed to create book:', error);
      res.status(500).json({ error: 'Failed to create book' });
    }
  });
};

export default handler;
