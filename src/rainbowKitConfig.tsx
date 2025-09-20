import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import { anvil, zksync, sepolia, avalancheFuji } from "wagmi/chains";

export default getDefaultConfig({
    appName: "TS Sender",
    chains: [anvil, zksync, sepolia, avalancheFuji],
    projectId: process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID!,
    ssr: false,
})