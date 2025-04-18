import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TodoContainer } from "./Todo";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column("simple-json", { nullable: true })
  extendedProps: {
    reStyle: boolean;
  };

  @Column()
  allDays: boolean;

  @Column()
  title: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @Column()
  borderColor: string;

  @Column()
  backgroundColor: string;

  @Column()
  textColor: string;

  @ManyToOne(() => TodoContainer, (todoContainer) => todoContainer.eventList)
  @JoinColumn({ name: "userId" })
  todoContainer: TodoContainer;
}
