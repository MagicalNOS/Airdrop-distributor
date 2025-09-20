import Header from "@/components/Header";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import AirdropForm from "@/components/AirdropForm";
export default function Home() {
  return (
    <div>
      <Header />
      <AirdropForm />
    </div>
  );
}
