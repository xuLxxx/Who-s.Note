import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class File {
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
}
