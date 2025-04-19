import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeUpdate,
} from "typeorm";
import { TodoContainer } from "./Todo";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-json", { nullable: true })
  extendedProps: {
    reStyle: boolean;
  };

  @Column()
  allDay: boolean;

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

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => TodoContainer, (todoContainer) => todoContainer.eventList)
  @JoinColumn({ name: "containerId" })
  todoContainer: TodoContainer;
}
