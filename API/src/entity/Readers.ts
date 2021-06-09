import { Entity, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';
import { MinLength, IsNotEmpty } from 'class-validator';

@Entity()

export class Readers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  clave: string;

  @Column()
  @IsNotEmpty()
  nombre: string;

  @Column()
  @IsNotEmpty()
  paterno: string;

  @Column()
  materno: string;

  @Column()
  @MinLength(10)
  telefono: string


}
