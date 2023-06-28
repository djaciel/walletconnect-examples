import { providers, Wallet } from 'ethers'

/**
 * Library
 */
export default class EIP155Lib {
  wallet: Wallet

  constructor(wallet: Wallet) {
    this.wallet = wallet
  }

  static init(privateKey?: string) {
    const wallet = privateKey ? new Wallet(privateKey) : new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY || "")

    return new EIP155Lib(wallet)
  }

  getPrivateKey() {
    return this.wallet.privateKey
  }

  getAddress() {
    return this.wallet.address
  }

  signMessage(message: string) {
    return this.wallet.signMessage(message)
  }

  _signTypedData(domain: any, types: any, data: any) {
    return this.wallet._signTypedData(domain, types, data)
  }

  connect(provider: providers.JsonRpcProvider) {
    return this.wallet.connect(provider)
  }

  signTransaction(transaction: providers.TransactionRequest) {
    return this.wallet.signTransaction(transaction)
  }
}
