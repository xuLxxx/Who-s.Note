import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column()
  tabIcon: string;
}
