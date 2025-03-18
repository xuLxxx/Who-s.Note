import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  icon: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  parentId: number; //关联方法 1.√ 前端算法生成树。 2. typeORM OneToMany ManyToOne 直接关联 -- findTree()方法返回数据库中的所有树及其所有子级、子级的子级等等。

  @Column()
  name: string;

  @Column()
  sorts: number; //排序

  @Column()
  conditions: number; //是否启用

  @Column({ nullable: true }) //jsonb必须nullable:true
  role: string; //角色权限 'admin,user'
}
