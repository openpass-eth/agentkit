import type { Agent } from "@openpass-eth/agentkit";
import { type Client, type Address } from "viem";
import { type TempoActions } from "viem/tempo";

/**
 * Get the balance of the native token or a specific token.
 */
export async function get_balance(
  agent: Agent<Client & TempoActions>,
  tokenAddress: string,
): Promise<string> {
  const address = agent.client.account?.address;
  if (!address) {
    throw new Error("No wallet address connected to agent");
  }
  const balance = await agent.client.token.getBalance({
    account: address,
    token: tokenAddress as Address,
  });

  return balance.toString();
}

/**
 * Transfer tokens to another address.
 */
export async function transfer(
  agent: Agent,
  to: string,
  amount: number,
  tokenAddress?: string,
): Promise<string> {
  console.log(`[Plugin Action] transfer called: ${amount} to ${to} ${tokenAddress ? `(token: ${tokenAddress})` : ""}`);
  // Mocked response
  return "0xMockTransactionHash" + Math.random().toString(16).slice(2);
}
