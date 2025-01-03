import { Button } from '@/components/ui/button';
import { useChain } from '../contexts/chain-context';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';
import { useState } from 'react';
import ChainItem from '@/components/ChainItem';
import { TChainItem } from '@/constants/chains';
import { toast } from '@/hooks/use-toast';
import PackingTip from '../components/PackingTip';
import { useWallet } from '@/contexts/wallet';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import { useAccount } from '../contexts/account-context';

export default function CreateNewAddress() {
  const { chains, currentChain, getCurrentChain } = useChain();
  const { getAccounts, updateAccount, updateTokens } = useAccount();
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState<TChainItem | null>(null);
  const handleChange = (value: string) => {
    setSelectedChain(
      () => chains.find((chain) => chain.id.toString() === value) || chains[0]
    );
  };

  const handleAfterCreating = async () => {
    await getCurrentChain();
    await getAccounts();
    await updateAccount();
    await updateTokens();
  };

  const handleCreate = async () => {
    if (!selectedChain) return;
    if (currentChain?.id === selectedChain.id) {
      toast({
        title: 'Create address failed',
        description: 'You are already on this network',
      });
      return;
    }
    try {
      setIsLoading(true);
      await wallet.createAccount(selectedChain.id);
      await handleAfterCreating();
      setTimeout(() => {
        navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
      }, 300);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SecondaryPageWrapper
      title="Create New Address"
      footer={
        !isLoading && (
          <Button
            size="large"
            className="w-full"
            onClick={handleCreate}
            disabled={!selectedChain}
          >
            Create
          </Button>
        )
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-1/2">
          <PackingTip body="Preparing your account" subBody="" />
        </div>
      ) : (
        <>
          <div className=" text-lg font-semibold mb-2">
            Create a new address
          </div>
          <div className="text-gray-600 mb-2">
            You are about to create a new address within the below network. You
            can use the same local password to access it.
          </div>
          <div className="space-y-2">
            {chains.map((chain) => {
              return (
                <ChainItem
                  isSelected={selectedChain?.id === chain.id}
                  key={chain.id}
                  chain={chain}
                  onClick={() => handleChange(chain.id.toString())}
                />
              );
            })}
          </div>
        </>
      )}
    </SecondaryPageWrapper>
  );
}
