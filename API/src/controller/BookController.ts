import { Books } from "../entity/Books";
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

export class BookController {
  static getAll = async (req: Request, res: Response) => {
    const bookRepository = getRepository(Books);
    let books;

    try {
      books = await bookRepository.find({ select: ['id', 'clave', 'title', 'autor'] });
    } catch (e) {
      res.status(404).json({ message: 'Somenthing goes wrong!' });
    }

    if (books.length > 0) {
      res.send(books);
    } else {
      res.status(404).json({ message: 'Empty inventory' });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const { clave } = req.params;
    const bookRepository = getRepository(Books);
    try {
      const book = await bookRepository.findOneOrFail(clave);
      res.send(book);
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  };

  static new = async (req: Request, res: Response) => {
    const { clave, title, autor, editorial, noPaginas} = req.body;
    const book = new Books();

    book.clave = clave;
    book.title = title;
    book.autor = autor;
    book.editorial = editorial;
    book.noPaginas = noPaginas;

    // Validate
    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(book, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const bookRepository = getRepository(Books);
    try {
      await bookRepository.save(book);
    } catch (e) {
      return res.status(409).json({ message: 'Book already exist!' });
    }
    // All ok
    res.send('Book registred');
  };

  static edit = async (req: Request, res: Response) => {
    let book;
    const { clave } = req.params;
    const { title, autor, editorial, noPaginas } = req.body;

    const userRepository = getRepository(Books);
    // Try get book
    try {
      book = await userRepository.findOneOrFail(clave);
      book.title = title;
      book.autor = autor;
      book.editorial = editorial;
      book.noPaginas = noPaginas;

    } catch (e) {
      return res.status(404).json({ message: 'Book not found!' });
    }
    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(book, validationOpt);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Try to save book
    try {
      await userRepository.save(book);
    } catch (e) {
      return res.status(409).json({ message: 'Book already registred' });
    }

    res.status(201).json({ message: 'Book updated' });
  };

  static delete = async (req: Request, res: Response) => {
    const { clave } = req.params;
    const bookRepository = getRepository(Books);
    let books: Books;

    try {
      books = await bookRepository.findOneOrFail(clave);
    } catch (e) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Remove user
    bookRepository.delete(clave);
    res.status(201).json({ message: ' Book deleted' });
  };
}

export default BookController;
