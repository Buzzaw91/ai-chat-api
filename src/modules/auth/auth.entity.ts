import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity()
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: number

  @ManyToOne(() => User, (user) => user.authTokens)
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
