import type { Agent } from "@openpass-eth/agentkit";
import { type Client, type Address, type PublicActions, type WalletActions, parseEther, formatEther, formatUnits, parseUnits, erc20Abi } from "viem";

type ExtClient = Client & PublicActions & WalletActions;

export type BalanceResult = {
  balance: string;
  uiAmount: string;
  decimals: number;
  symbol?: string;
};

export type TransferResult = {
  hash: string;
  to: string;
  amount: number;
  tokenAddress?: string;
};

/**
 * Get the balance of the native token or a specific token.
 */
export async function get_balance(
  agent: Agent<ExtClient>,
  tokenAddress?: string,
): Promise<BalanceResult> {
  const address = agent.client.account?.address;
  if (!address) {
    throw new Error("No wallet address connected to agent");
  }

  if (!tokenAddress) {
    const balance = await agent.client.getBalance({ address });
    return {
      balance: balance.toString(),
      uiAmount: formatEther(balance),
      decimals: 18,
      symbol: agent.client.chain?.nativeCurrency?.symbol || "ETH",
    };
  }

  const [balance, decimals, symbol] = await Promise.all([
    agent.client.readContract({ address: tokenAddress as Address, abi: erc20Abi, functionName: "balanceOf", args: [address] }),
    agent.client.readContract({ address: tokenAddress as Address, abi: erc20Abi, functionName: "decimals" }),
    agent.client.readContract({ address: tokenAddress as Address, abi: erc20Abi, functionName: "symbol" }).catch(() => undefined)
  ]);

  return {
    balance: balance.toString(),
    uiAmount: formatUnits(balance, decimals),
    decimals,
    symbol,
  };
}

/**
 * Transfer tokens to another address.
 */
export async function transfer(
  agent: Agent<ExtClient>,
  to: string,
  amount: number,
  tokenAddress?: string,
): Promise<TransferResult> {
  if (!agent.client.account) {
    throw new Error("No wallet connected to agent");
  }

  if (!tokenAddress) {
    const value = parseEther(amount.toString());
    const hash = await agent.client.sendTransaction({
      account: agent.client.account,
      chain: agent.client.chain ?? null,
      to: to as Address,
      value,
    });
    return { hash, to, amount, tokenAddress };
  }

  const decimals = await agent.client.readContract({ address: tokenAddress as Address, abi: erc20Abi, functionName: "decimals" });
  const value = parseUnits(amount.toString(), decimals);

  const hash = await agent.client.writeContract({
    account: agent.client.account,
    chain: agent.client.chain ?? null,
    address: tokenAddress as Address,
    abi: erc20Abi,
    functionName: "transfer",
    args: [to as Address, value],
  });

  return { hash, to, amount, tokenAddress };
}
