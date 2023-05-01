import { AuthRoute } from './auth.route';
import { BankAccountRoute } from './bankaccount.route';
import { ProviderRoute } from './provider.route';
import { TransactionRoutes } from './transactions.route';
import { UserRoute } from './users.route';

export const AppRoutes = [new UserRoute(), new AuthRoute(), new BankAccountRoute(), new ProviderRoute(), new TransactionRoutes()];
