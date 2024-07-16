// pages/api/books/update/[id].ts
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

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Get the title from the request body
    const title = req.body.title as string;
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

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      await new Promise<void>((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            reject(err);
          } else if (err) {
            reject(new Error('Failed to upload file'));
          } else {
            resolve();
          }
        });
      });

      const { title, sinopsis } = req.body;
      const fileReq = req as NextApiRequestWithFile;
      const cover = fileReq.file ? `/books/cover/${fileReq.file.filename}` : undefined;

      // Validate if id is a valid number
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }

      const updatedBook = await prisma.book.update({
        where: { id: Number(id) },
        data: {
          title,
          cover,
          sinopsis,
        },
      });

      if (updatedBook) {
        res.status(200).json(updatedBook);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      console.error('Failed to update book:', error);
      res.status(500).json({ error: 'Failed to update book' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
