import { BadRequestException } from '@/application/exceptions/badRequestException';
import { CreateWalletDto } from '@/application/wallet/walletdto.dto';
import { IWallet } from '@/domain/interfaces/wallets.interface';
import { Service } from 'typedi';
import { WalletModel } from '../models/wallets.model';
import { IWalletService } from './../../../application/wallet/IwalletService';

@Service()
export class WalletService implements IWalletService {
  async createWallet(walletDto: CreateWalletDto): Promise<IWallet> {
    const findWallet = await WalletModel.query().findOne({ userId: walletDto.userid, currencyCode: walletDto.currencyCode });
    if (findWallet) {
      throw new BadRequestException('wallet already exists for this user and currency code');
    }

    const wallet = {
      amount: 0.0,
      currencyCode: walletDto.currencyCode,
      userId: walletDto.userid,
    } as WalletModel;
    const result = await WalletModel.query().insert(wallet);
    return result;
  }
}
