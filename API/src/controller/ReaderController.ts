import { Readers } from "../entity/Readers";
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

export class BookController {
  static getAll = async (req: Request, res: Response) => {
    const readerRepository = getRepository(Readers);
    let readers;

    try {
      readers = await readerRepository.find({ select: ['id', 'clave', 'nombre', 'paterno', 'materno', 'telefono'] });
    } catch (e) {
      res.status(404).json({ message: 'Somenthing goes wrong!' });
    }

    if (readers.length > 0) {
      res.send(readers);
    } else {
      res.status(404).json({ message: 'Empty users' });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const { clave } = req.params;
    const readerRepository = getRepository(Readers);
    try {
      const reader = await readerRepository.findOneOrFail(clave);
      res.send(reader);
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  };

  static new = async (req: Request, res: Response) => {
    const { clave, nombre, paterno, materno, telefono} = req.body;
    const reader = new Readers();

    reader.clave = clave;
    reader.nombre = nombre;
    reader.paterno = paterno;
    reader.materno = materno;
    reader.telefono = telefono;

    // Validate
    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(reader, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const bookRepository = getRepository(Readers);
    try {
      await bookRepository.save(reader);
    } catch (e) {
      return res.status(409).json({ message: 'Reader already exist!' });
    }
    // All ok
    res.send('Reader registred');
  };

  static edit = async (req: Request, res: Response) => {
    let reader;
    const { clave } = req.params;
    const { nombre, paterno, materno, telefono } = req.body;

    const readerRepository = getRepository(Readers);
    // Try get reader
    try {
      reader = await readerRepository.findOneOrFail(clave);
      reader.nombre = nombre;
      reader.paterno = paterno;
      reader.materno = materno;
      reader.telefono = telefono;

    } catch (e) {
      return res.status(404).json({ message: 'Reader not found!' });
    }
    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(reader, validationOpt);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Try to save reader
    try {
      await readerRepository.save(reader);
    } catch (e) {
      return res.status(409).json({ message: 'Reader already registred' });
    }

    res.status(201).json({ message: 'Reader updated' });
  };

  static delete = async (req: Request, res: Response) => {
    const { clave } = req.params;
    const readerRepository = getRepository(Readers);
    let readers: Readers;

    try {
      readers = await readerRepository.findOneOrFail(clave);
    } catch (e) {
      return res.status(404).json({ message: 'Reader not found' });
    }

    // Remove reader
    readerRepository.delete(clave);
    res.status(201).json({ message: ' Reader deleted' });
  };
}

export default BookController;
