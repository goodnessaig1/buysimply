import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

@Injectable()
export class KeepAliveService implements OnModuleInit {
  private readonly logger = new Logger(KeepAliveService.name);
  private readonly SELF_URL = 'https://buysimply.onrender.com/';

  onModuleInit() {
    this.logger.log(`Initializing keep-alive ping for ${this.SELF_URL}`);

    setInterval(
      async () => {
        try {
          const res = await fetch(this.SELF_URL);
          if (res.ok) {
            this.logger.log('Keep-alive ping successful ✅');
          } else {
            this.logger.error(`Keep-alive ping failed ❌: ${res.statusText}`);
          }
        } catch (err) {
          this.logger.error('Keep-alive ping failed ❌');
        }
      },
      5 * 60 * 1000,
    );
  }
}
