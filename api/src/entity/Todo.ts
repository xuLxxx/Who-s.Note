import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BaseEntity,
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

  //   @Column()
  //   eventList: string;

  //   @Column()
  //   todoList: string;
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  userId: number;

  @Column()
  content: string;

  @Column()
  status: string;

  @Column()
  sorts: number;

  @ManyToOne(() => TodoContainer, (userId) => userId.todoList)
  @JoinColumn({ name: "userId" })
  todoContainer: TodoContainer;
}
