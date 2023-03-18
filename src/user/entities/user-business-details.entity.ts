import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

type TypicalJobCost = {
  from: string;
  to: string;
};
@Entity()
export class BusinessDetails {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  website?: string;
  @Column({ nullable: true })
  businessDescription?: string;
  @Column({ nullable: true })
  certificatesAndAwards?: string;
  @Column({ nullable: true })
  photo?: string;
  @Column('json', { nullable: true })
  typicalJobCost?: TypicalJobCost;
  @Column({ nullable: true })
  facebook?: string;
  @Column({ nullable: true })
  instagram?: string;
  @Column({ nullable: true })
  logo?: string;
  @OneToOne(() => User, (user) => user.businessDetails)
  user: User;
}
