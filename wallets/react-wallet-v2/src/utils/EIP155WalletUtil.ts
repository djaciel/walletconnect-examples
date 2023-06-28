import EIP155Lib from '@/lib/EIP155Lib'

export let wallet1: EIP155Lib
export let wallet2: EIP155Lib
export let eip155Wallets: Record<string, EIP155Lib>
export let eip155Addresses: string[]

let address1: string

/**
 * Utilities
 */
export function createOrRestoreEIP155Wallet() {
  const privateKey = localStorage.getItem('EIP155_PRIVATE_KEY')

  if (privateKey) {
    wallet1 = EIP155Lib.init()
  } else {
    wallet1 = EIP155Lib.init()

    // Don't store privateKey in local storage in a production project!
    localStorage.setItem('EIP155_PRIVATE_KEY', wallet1.getPrivateKey())
  }

  address1 = wallet1.getAddress()

  eip155Wallets = {
    [address1]: wallet1,
  }
  eip155Addresses = Object.keys(eip155Wallets)

  return {
    eip155Wallets,
    eip155Addresses
  }
}
