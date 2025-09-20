"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { InputForm } from "./ui/InputForm";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { chainsToTSender, tsenderAbi, erc20Abi } from "./constants";
import { readContract, waitForTransactionReceipt, simulateContract } from "@wagmi/core";
import { calculateTotal } from "./utils/calculateTotal";
import { ClipLoader } from "react-spinners";
import { formatUnits, parseUnits } from "viem";

// Define keys for local storage
const TOKEN_ADDRESS_KEY = "airdropForm_tokenAddress";
const RECIPIENTS_KEY = "airdropForm_recipients";
const AMOUNTS_KEY = "airdropForm_amounts";

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_ADDRESS_KEY) || "" : ""
  );
  const [recipients, setRecipients] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem(RECIPIENTS_KEY) || "" : ""
  );
  const [amounts, setAmounts] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem(AMOUNTS_KEY) || "" : ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>(""); // Added token symbol
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const [estimatedGas, setEstimatedGas] = useState<bigint | null>(null);

  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();

  const totalWei: bigint = useMemo(() => {
    const calculated = calculateTotal(amounts);
    return BigInt(calculated);
  }, [amounts]);

  const { writeContractAsync } = useWriteContract();

  // Local storage effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_ADDRESS_KEY, tokenAddress);
    }
  }, [tokenAddress]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECIPIENTS_KEY, recipients);
    }
  }, [recipients]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AMOUNTS_KEY, amounts);
    }
  }, [amounts]);

  const fetchTokenDetails = useCallback(async () => {
    if (!tokenAddress || !account.address) {
      setTokenName("");
      setTokenSymbol("");
      setTokenDecimals(18);
      return;
    }
    try {
      const name = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: 'name',
      }) as string;
      setTokenName(name);

      const symbol = await readContract(config, { // Fetch token symbol
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: 'symbol',
      }) as string;
      setTokenSymbol(symbol);

      const decimals = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: 'decimals',
      }) as number;
      setTokenDecimals(decimals);
    } catch (error) {
      console.error("Error fetching token details:", error);
      setTokenName("Unknown Token");
      setTokenSymbol("UNKN");
      setTokenDecimals(18);
    }
  }, [tokenAddress, account.address, config]);

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  const estimateAirdropGas = useCallback(async () => {
    const tsenderAddress = chainsToTSender[chainId]?.["tsender"];
    if (!tsenderAddress || !tokenAddress || !account.address || !totalWei) {
      setEstimatedGas(null);
      return;
    }

    const parsedAmounts = amounts.split(/[,\n]+/).map(amt => {
      try {
        return parseUnits(amt.trim(), tokenDecimals);
      } catch (e) {
        return BigInt(0);
      }
    }).filter(amt => amt > BigInt(0));

    const parsedRecipients = recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== '');

    if (parsedAmounts.length === 0 || parsedRecipients.length === 0 || parsedAmounts.length !== parsedRecipients.length) {
      setEstimatedGas(null);
      return;
    }

    try {
      const { request } = await simulateContract(config, {
        abi: tsenderAbi,
        address: tsenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress as `0x${string}`,
          parsedRecipients as `0x${string}`[],
          parsedAmounts,
          totalWei,
        ],
        account: account.address,
      });

      if ('gas' in request) {
        setEstimatedGas(request.gas as bigint);
      } else {
        console.warn("Gas estimate not found directly in simulateContract result. You might need to use estimateGas explicitly.");
        setEstimatedGas(null);
      }

    } catch (error) {
      console.error("Error estimating gas:", error);
      setEstimatedGas(null);
    }
  }, [tokenAddress, recipients, amounts, totalWei, chainId, account.address, config, tokenDecimals]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      estimateAirdropGas();
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [tokenAddress, recipients, amounts, estimateAirdropGas]);

  async function getApproved(tsenderAddress: string | null): Promise<bigint> {
    if (!tsenderAddress || !tokenAddress) {
      alert("Unsupported network or invalid token address");
      return BigInt(0);
    }
    try {
      const result = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: 'allowance',
        args: [account.address!, tsenderAddress as `0x${string}`]
      });
      return result as bigint;
    } catch (error) {
      console.error("Error reading allowance:", error);
      return BigInt(0);
    }
  }

  async function headSummit() {
    setIsLoading(true);
    try {
      const tsenderAddress = chainsToTSender[chainId]?.["tsender"];
      if (!tsenderAddress) {
        alert("Unsupported network or tsender address not found.");
        return;
      }

      const parsedAmounts = amounts.split(/[,\n]+/).map(amt => {
        try {
          return parseUnits(amt.trim(), tokenDecimals);
        } catch (e) {
          throw new Error(`Invalid amount found: ${amt.trim()}. Please ensure all amounts are valid numbers.`);
        }
      }).filter(amt => amt > BigInt(0));

      const parsedRecipients = recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== '');

      if (parsedAmounts.length === 0 || parsedRecipients.length === 0 || parsedAmounts.length !== parsedRecipients.length) {
        alert("Please ensure recipients and amounts are correctly formatted and matched.");
        return;
      }

      const approvedAmount = await getApproved(tsenderAddress);

      if (approvedAmount < totalWei) {
        console.log("Approving token...");
        const approveHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: 'approve',
          args: [tsenderAddress as `0x${string}`, totalWei]
        });
        console.log("Approval transaction sent, waiting for receipt:", approveHash);
        await waitForTransactionReceipt(config, { hash: approveHash });
        console.log("Token approved successfully.");
      }

      console.log("Sending airdrop transaction...");
      const airdropHash = await writeContractAsync({
        abi: tsenderAbi,
        address: tsenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress as `0x${string}`,
          parsedRecipients as `0x${string}`[],
          parsedAmounts,
          totalWei,
        ],
      });
      console.log("Airdrop transaction sent, waiting for receipt:", airdropHash);
      await waitForTransactionReceipt(config, { hash: airdropHash });
      alert("Airdrop successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  const totalEther = useMemo(() => {
    if (!totalWei || tokenDecimals === undefined) return "0";
    return formatUnits(totalWei, tokenDecimals);
  }, [totalWei, tokenDecimals]);

  return (
    <div className="p-6 bg-white shadow-2xl rounded-2xl max-w-2xl mx-auto mt-10 space-y-5 transform transition-all duration-300 hover:shadow-3xl">
      <h2 className="text-3xl font-light text-center text-zinc-800 mb-6 tracking-wide">Send Your Airdrop</h2>

      <InputForm
        label={<span className="font-light text-lg">Token Address</span>}
        placeholder="0x..."
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputForm
        label={<span className="font-light text-lg">Recipients (comma or new line separated)</span>}
        placeholder="0x..., 0x..., 0x..."
        value={recipients}
        large
        onChange={(e) => setRecipients(e.target.value)}
      />
      <InputForm
        label={<span className="font-light text-lg">Amounts (wei; comma or new line separated)</span>}
        placeholder="1000, 2000, 3000"
        large
        value={amounts}
        onChange={(e) => setAmounts(e.target.value)}
      />

      <button
        onClick={headSummit}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg tracking-wide"
      >
        {isLoading ? (
          <>
            <ClipLoader color="#fff" size={20} />
            <span className="ml-2">Processing...</span>
          </>
        ) : (
          "Submit Airdrop"
        )}
      </button>

      {/* Token Details Box - 美化后的样式 */}
      <div className="mt-8 p-5 border border-blue-200 rounded-xl bg-blue-50 shadow-md transform transition-all duration-300 hover:shadow-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4 tracking-wide">Airdrop Details</h3>
        <div className="space-y-3 text-base text-zinc-700 font-light">
          <p><strong>Token Name:</strong> {tokenName || "N/A"}</p>
          <p><strong>Total Amount ({tokenSymbol || "Token"}):</strong> {totalEther}</p>
          <p><strong>Total Amount (Wei):</strong> {totalWei.toString()}</p>
          <p>
            <strong>Estimated Gas:</strong> {estimatedGas ? `${formatUnits(estimatedGas, 18)} ETH` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}