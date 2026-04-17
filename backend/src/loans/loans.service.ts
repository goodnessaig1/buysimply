import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '../db/db.module';
import { loans, Loan } from '../db/schema';
import { eq, lt, and } from 'drizzle-orm';

@Injectable()
export class LoansService {
  constructor(@Inject(DRIZZLE_PROVIDER) private db: any) {}

  async findAll(status?: string) {
    let query = this.db.select().from(loans);
    if (status) {
      query = query.where(eq(loans.status, status as any));
    }
    return query;
  }

  async findByEmail(email: string) {
    const results = await this.db
      .select()
      .from(loans)
      .where(eq(loans.userEmail, email));
    return results;
  }

  async findExpired() {
    const now = new Date();
    return this.db.select().from(loans).where(lt(loans.maturityDate, now));
  }

  async delete(id: number) {
    const results = await this.db
      .delete(loans)
      .where(eq(loans.id, id))
      .returning();
    if (results.length === 0) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }
    return { message: 'Loan deleted successfully' };
  }

  async create(data: any) {
    return this.db.insert(loans).values(data).returning();
  }
}
