import React from 'react';
import RequestProvider from './RequestProvider';
import '@/index.css';
import { Toaster } from './ui/toaster';
import { WalletProvider } from '@/contexts/wallet';
import { KeyringProvider } from '@/contexts/keyring';

interface IPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

function PageContainer({ children, className }: IPageContainerProps) {
  return (
    <>
      <div className={`w-screen h-screen flex ${className}`}>
        <WalletProvider>
          <KeyringProvider>
            <RequestProvider>{children}</RequestProvider>
          </KeyringProvider>
        </WalletProvider>
      </div>

      <Toaster />
    </>
  );
}

export default PageContainer;