import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '../db/db.module';
import { users, NewUser, roleEnum } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_PROVIDER) private db: any) {}

  async findByEmail(email: string) {
    const results = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return results[0];
  }

  async create(data: NewUser) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const results = await this.db.insert(users).values({
      ...data,
      password: hashedPassword,
    }).returning();
    return results[0];
  }

  async findAll() {
    return this.db.select().from(users);
  }
}
