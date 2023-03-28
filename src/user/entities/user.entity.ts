import { IsEmail } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { BasicInfo } from './user-basic-info.entity';
import { BusinessDetails } from './user-business-details.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsEmail()
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  googleAccessToken?: string;

  @Column({ nullable: true })
  fbAccessToken?: string;

  @JoinTable()
  @OneToOne(() => BasicInfo, (info) => info.user, {
    cascade: true,
  })
  basicInfo: BasicInfo;

  @JoinTable()
  @OneToOne(() => BusinessDetails, (detail) => detail.user, {
    cascade: true,
  })
  businessDetails: BusinessDetails;

  @JoinTable()
  @OneToMany(() => Project, (project) => project.user, {
    cascade: true,
  })
  projects?: Project[];
}
