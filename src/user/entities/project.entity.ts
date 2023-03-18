import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectCategoryEnum } from '../enums/project-category.enum';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  projectName: string;
  @Column()
  projectAddress: string;
  @Column()
  projectYear: string;
  @Column()
  projectCost: string;
  @Column({ type: 'enum', enum: ProjectCategoryEnum })
  projectCategory: string;
  @Column('json', { nullable: true })
  projectImages?: string[];
  @ManyToOne(() => User, (user) => user.projects)
  user: User;
}
