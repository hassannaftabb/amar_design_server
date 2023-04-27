import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class DesignIdeaCategory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  image: string;
}
