import type { TempoAgent } from "@tempo-agent-kit/core";

/**
 * Get the balance of the native token or a specific token.
 */
export async function get_balance(
  agent: TempoAgent,
  address?: string,
): Promise<number> {
  console.log(`[Plugin Action] get_balance called for ${address || "self"}`);
  // Mocked response
  return 100.5;
}

/**
 * Transfer tokens to another address.
 */
export async function transfer(
  agent: TempoAgent,
  to: string,
  amount: number,
  tokenAddress?: string,
): Promise<string> {
  console.log(`[Plugin Action] transfer called: ${amount} to ${to} ${tokenAddress ? `(token: ${tokenAddress})` : ""}`);
  // Mocked response
  return "0xMockTransactionHash" + Math.random().toString(16).slice(2);
}
