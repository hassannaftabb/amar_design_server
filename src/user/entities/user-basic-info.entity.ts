import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoriesEnum } from '../enums/categories.enum';
import { User } from './user.entity';

@Entity()
export class BasicInfo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  companyName: string;
  @Column({ type: 'enum', enum: CategoriesEnum })
  category: string;
  @Column()
  address1: string;
  @Column({ nullable: true })
  address2?: string;
  @Column()
  isStreetAddressPrivate: string;
  @Column()
  city: string;
  @Column()
  state: string;
  @Column()
  country: string;
  @Column()
  pinCode: string;
  @Column()
  phoneNumber: string;
  @OneToOne(() => User, (user) => user.basicInfo)
  user: User;
}
