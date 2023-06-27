import { providers, Wallet } from 'ethers'

/**
 * Types
 */
interface IInitArgs {
  mnemonic?: string
}

/**
 * Library
 */
export default class EIP155Lib {
  wallet: Wallet

  constructor(wallet: Wallet) {
    this.wallet = wallet
  }

  static init(privateKey?: string) {
    const wallet = privateKey ? Wallet.fromMnemonic(privateKey) : new Wallet("a5ca7b27c368d98960dc0c948efc7f269c43a66ed9da94e4a803ec7f2e9d513b")

    return new EIP155Lib(wallet)
  }

  getMnemonic() {
    return this.wallet.mnemonic.phrase
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
