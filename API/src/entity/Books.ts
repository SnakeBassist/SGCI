import { Entity, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';
import { MinLength, IsNotEmpty } from 'class-validator';


@Entity()

export class Books {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  clave: string;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  title: string;

  @Column()
  autor: string;

  @Column()
  editorial: string;

  @Column()
  ejemplares: number;

  @Column()
  noPaginas: number;

}
