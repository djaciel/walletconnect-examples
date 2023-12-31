import AccountCard from '@/components/AccountCard'
import PageHeader from '@/components/PageHeader'
import { EIP155_MAINNET_CHAINS, EIP155_TEST_CHAINS } from '@/data/EIP155Data'
import SettingsStore from '@/store/SettingsStore'
import { Text } from '@nextui-org/react'
import { Fragment } from 'react'
import { useSnapshot } from 'valtio'

export default function HomePage() {
  const {
    testNets,
    eip155Address,
  } = useSnapshot(SettingsStore.state)

  return (
    <Fragment>
      <PageHeader title="Accounts">
      </PageHeader>
      <Text h4 css={{ marginBottom: '$5' }}>
        Mainnets
      </Text>
      {Object.entries(EIP155_MAINNET_CHAINS).map(([caip10, {name, logo, rgb}]) => (
        <AccountCard key={name} name={name} logo={logo} rgb={rgb} address={eip155Address} chainId={caip10.toString()}/>
      ))}

      {testNets ? (
        <Fragment>
          <Text h4 css={{ marginBottom: '$5' }}>
            Testnets
          </Text>
          {Object.entries(EIP155_TEST_CHAINS).map(([caip10, {name, logo, rgb}]) => (
            <AccountCard key={name} name={name} logo={logo} rgb={rgb} address={eip155Address} chainId={caip10.toString()}/>
          ))}
        </Fragment>
      ) : null}
    </Fragment>
  )
}
