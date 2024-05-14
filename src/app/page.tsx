"use client";

import { MetamaskCard } from "@/components/metamask-card";
import { hooks as metaMaskHooks, metaMask } from "@/libs/web3/metamask";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import type { MetaMask } from "@web3-react/metamask";
import { useEffect } from "react";


const wallets: [MetaMask, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks]
]

export default function Home() {
  const { useAccounts, useProvider } = metaMaskHooks;
  const accounts = useAccounts();
  const provider = useProvider();

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, []);

  return (
    <Web3ReactProvider connectors={wallets}>
      <MetamaskCard account={accounts} provider={provider} />
    </Web3ReactProvider>
  );
}
