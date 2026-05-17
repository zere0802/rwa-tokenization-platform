import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'
import { defineChain } from 'viem'

export const anvil = defineChain({
  id: 31337,
  name: 'Anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
})

export const config = getDefaultConfig({
  appName: 'RWA Platform',

  projectId: '1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1',

  chains: [anvil, baseSepolia],
})