"use client"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import config from "../rainbowKitConfig";
import { WagmiProvider } from "wagmi";
import {useState} from "react";
import "@rainbow-me/rainbowkit/styles.css";

export function Providers(props: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
  return(
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {props.children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}