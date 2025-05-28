import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  UpdateDateColumn,
} from "typeorm";
import { Event } from "./Event";
// /实体（Entities）：这些是数据库表的映射，它们定义了表的结构和关系。

@Entity()
export class TodoContainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToMany(() => Event, (event) => event.todoContainer)
  eventList: Event[];

  @OneToMany(() => Todo, (todo) => todo.todoContainer)
  todoList: Todo[];
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  time: string; // 截止日期

  @Column({ nullable: true })
  stara: boolean; // 是否标星

  @Column()
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne(() => TodoContainer, (todoContainer) => todoContainer.todoList)
  @JoinColumn({ name: "containerId" })
  todoContainer: TodoContainer;
}

@Entity()
export class TodoSorts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column("simple-array")
  sorts: number[];
}
