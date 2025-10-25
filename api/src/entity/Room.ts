import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity()
export class Room {
  @PrimaryColumn({ type: "varchar", length: 40 })
  id: string;

  @Column()
  name: string;
  @Column()
  avatar: string;
  @Column()
  banner: string;
  // 多对多关系：一个房间可以有多个用户，一个用户可以加入多个房间
  @ManyToMany(() => User)
  @JoinTable() // 在拥有方添加此装饰器
  userList: User[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @BeforeInsert()
  generateId() {
    // 生成随机字符串
    const randomNumber = (Math.random() * 100) | 0;
    // 获取时间戳后8位
    const timestamp = Date.now().toString().slice(-8);
    // 组合ID：前缀+时间戳+随机字符串
    this.id = `${timestamp}${randomNumber}`;
  }
}
