import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

  @ManyToOne(() => User)
  user: User;

  @Column()
  content: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
