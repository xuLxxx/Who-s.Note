import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Room } from "./Room";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ default: "" })
  avatar: string;

  @ManyToMany(() => Room)
  rooms: Room[];
}
