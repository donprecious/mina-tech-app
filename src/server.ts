import { logger } from '@utils/logger';
import { BankAccountRoute } from './presentation/routes/bankaccount.route';
import { App } from '@/app';
import { AuthRoute } from '@/presentation/routes/auth.route';
import { UserRoute } from '@/presentation/routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AppRoutes } from './presentation/routes/routes';

// ValidateEnv();

// const app = new App([new UserRoute(), new AuthRoute(),
//    new BankAccountRoute()
//   ]);

// app.listen();

const start = () => {
  try {
    ValidateEnv();
    // const app = new App([new UserRoute(), new AuthRoute(), new BankAccountRoute()]);
    const app = new App();

    app.listen();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
start();
