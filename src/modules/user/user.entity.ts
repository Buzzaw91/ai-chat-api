import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuthToken } from '../auth/auth.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => AuthToken, (authToken) => authToken.user, {
    cascade: ['insert', 'update', 'remove'],
  })
  authTokens: AuthToken[];

  /* Timestamps */
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
