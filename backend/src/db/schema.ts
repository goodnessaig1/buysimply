import { pgTable, serial, text, varchar, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['staff', 'admin', 'superadmin']);
export const loanStatusEnum = pgEnum('status', ['pending', 'active']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('staff').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 }).notNull(),
  status: loanStatusEnum('status').default('pending').notNull(),
  maturityDate: timestamp('maturity_date').notNull(),
  totalLoan: decimal('total_loan', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Loan = typeof loans.$inferSelect;
export type NewLoan = typeof loans.$inferInsert;
