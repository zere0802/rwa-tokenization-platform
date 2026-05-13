import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { arbitrumSepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'RWA Platform',

  projectId: '1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1',

  chains: [arbitrumSepolia],
})