import { IWallet } from '@/domain/interfaces/wallets.interface';
import { CreateWalletDto } from './walletdto.dto';

export interface IWalletService {
  createWallet(walletDto: CreateWalletDto): Promise<IWallet>;
}

export const walletServiceInjectionToken = 'wallet.service.token';
