import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { File } from "./File";

@Entity()
export class Markdown extends File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  fileUrl: string;

  @Column()
  pic: string;

  @Column()
  title: string;
}
