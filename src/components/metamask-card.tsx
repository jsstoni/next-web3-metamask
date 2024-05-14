import type { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units';
import { Web3ReactHooks } from "@web3-react/core";
import { metaMask } from "@/libs/web3/metamask";
import { useEffect, useState } from "react";

interface Props {
    account: ReturnType<Web3ReactHooks['useAccounts']>,
    provider: ReturnType<Web3ReactHooks['useProvider']>,
}

function useBalances(
    provider?: ReturnType<Web3ReactHooks['useProvider']>,
    accounts?: string[]
): BigNumber[] | undefined {
    const [balances, setBalances] = useState<BigNumber[] | undefined>()

    useEffect(() => {
        if (provider && accounts?.length) {
            let stale = false

            void Promise.all(accounts.map((account) => provider.getBalance(account))).then((balances) => {
                if (stale) return
                setBalances(balances)
            })

            return () => {
                stale = true
                setBalances(undefined)
            }
        }
    }, [provider, accounts])

    return balances
}

export function MetamaskCard({ account, provider }: Props) {

    const [error, setError] = useState<string>();
    const balance = useBalances(provider, account);

    const connectWallet = async () => {
        setError("");
        try {
            await metaMask.activate();
        } catch (error) {
            setError("Connect failed");
        }
    }

    return (
        <div>
            {error && <p>{error}</p>}
            {account ? (<><strong>Accounts:</strong>
                {account.length > 0
                    ? account?.map((account, i) => (
                        <p key={account}>
                            {account}
                            {balance?.[i] && ` (${formatEther(balance[i])})`}
                        </p>
                    ))
                    : null
                }
            </>
            ) : <button onClick={connectWallet} className='p-2 px-4 border-2 rounded-md'>Connect wallet</button>}
        </div>
    )
}