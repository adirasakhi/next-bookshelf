// pages/api/books/delete/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    // Check if id is a valid number
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
      const book = await prisma.book.findUnique({
        where: { id: Number(id) },
      });

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Delete the book from the database
      await prisma.book.delete({
        where: { id: Number(id) },
      });

      // Delete the cover image if it exists
      if (book.cover) {
        const filePath = path.join(process.cwd(), 'public', book.cover);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Failed to delete book:', error);
      res.status(500).json({ error: 'Failed to delete book' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
