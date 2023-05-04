import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DesignIdeaCategory } from './design-idea-category.entity';

@Entity()
export class DesignIdeaProject {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  sizeOrDimensions: string;
  @Column()
  description: string;
  @JoinTable()
  @ManyToOne(() => DesignIdeaCategory, (category) => category.projects)
  category: DesignIdeaCategory;
  @Column('json', { nullable: true })
  images?: string[];
}
