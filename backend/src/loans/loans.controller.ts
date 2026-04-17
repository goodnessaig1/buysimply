import { Controller, Get, Delete, Query, Param, UseGuards, Req, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';
import { LoansService } from './loans.service';

@ApiTags('loans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loans')
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all loans with optional status filter' })
  async getLoans(@Query('status') status: string, @Req() req: any) {
    const rawLoans = await this.loansService.findAll(status);
    return this.mapLoans(rawLoans, req.user.role);
  }

  @Get('expired')
  @ApiOperation({ summary: 'Get all expired loans' })
  async getExpiredLoans(@Req() req: any) {
    const rawLoans = await this.loansService.findExpired();
    return this.mapLoans(rawLoans, req.user.role);
  }

  @Get(':userEmail/get')
  @ApiOperation({ summary: 'Get loans by user email' })
  async getLoansByEmail(@Param('userEmail') email: string, @Req() req: any) {
    const rawLoans = await this.loansService.findByEmail(email);
    return { loans: this.mapLoans(rawLoans, req.user.role) };
  }

  @Delete(':loanId/delete')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete a loan (Superadmin only)' })
  async deleteLoan(@Param('loanId', ParseIntPipe) id: number) {
    return this.loansService.delete(id);
  }

  private mapLoans(loans: any[], role: string) {
    return loans.map(loan => {
      const { ...loanData } = loan;
      if (role === 'staff') {
        delete (loanData as any).totalLoan;
      }
      return loanData;
    });
  }
}
