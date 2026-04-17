import {
  Injectable,
  OnApplicationBootstrap,
  Inject,
  Logger,
} from '@nestjs/common';
import { DRIZZLE_PROVIDER } from './db.module';
import { users, loans } from './schema';
import { UsersService } from '../users/users.service';
import { LoansService } from '../loans/loans.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @Inject(DRIZZLE_PROVIDER) private db: any,
    private usersService: UsersService,
    private loansService: LoansService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking if seeding is needed...');

    const userCount = await this.db.select({ count: users.id }).from(users);
    const hasUsers = userCount.length > 0 && userCount[0].count > 0;

    const loanCount = await this.db.select({ count: loans.id }).from(loans);
    const hasLoans = loanCount.length > 0 && loanCount[0].count > 0;

    if (hasUsers && hasLoans) {
      this.logger.log('Database already seeded. Skipping.');
      return;
    }

    try {
      if (!hasUsers) {
        this.logger.log('Seeding users...');
        await this.seedUsers();
      }

      if (!hasLoans) {
        this.logger.log('Seeding loans...');
        await this.seedLoans();
      }

      this.logger.log('Seeding completed successfully.');
    } catch (error) {
      this.logger.error('Seeding failed:', error);
    }
  }

  private async seedUsers() {
    const filePath = path.join(process.cwd(), 'seed', 'staffs.json');
    if (!fs.existsSync(filePath)) {
      this.logger.warn(`Users seed file not found at ${filePath}`);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const user of data) {
      try {
        await this.usersService.create({
          email: user.email,
          password: user.password || 'password123',
          role: user.role.toLowerCase() as any,
        });
      } catch (e) {
        this.logger.warn(`Failed to seed user ${user.email}: ${e.message}`);
      }
    }
  }

  private async seedLoans() {
    const filePath = path.join(process.cwd(), 'seed', 'loans.json');
    if (!fs.existsSync(filePath)) {
      this.logger.warn(`Loans seed file not found at ${filePath}`);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const loan of data) {
      try {
        const cleanAmount = loan.amount.replace(/[^0-9]/g, '');

        await this.loansService.create({
          userEmail: loan.applicant.email,
          status: loan.status.toLowerCase() as any,
          maturityDate: new Date(loan.maturityDate),
          totalLoan: cleanAmount,
        });
      } catch (e) {
        this.logger.warn(`Failed to seed loan ${loan.id}: ${e.message}`);
      }
    }
  }
}
