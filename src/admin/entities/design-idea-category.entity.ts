import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DesignIdeaProject } from './design-idea-project,entity';

@Entity()
export class DesignIdeaCategory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  image: string;
  @JoinTable()
  @OneToMany(() => DesignIdeaProject, (project) => project.category)
  projects?: DesignIdeaProject[];
}
