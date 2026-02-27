import { z } from "zod";
import type { AgentTool, Agent } from "@openpass-eth/agentkit";
import { type Client, type PublicActions, type WalletActions } from "viem";
import { get_balance } from "../actions";

const balanceSchema = z.object({
  tokenAddress: z.string().optional().describe("The token address to check the balance of (optional, defaults to native token)"),
});

const balanceTool: AgentTool = {
  name: "get_balance",
  description: "Get the balance of a token for the agent.",
  similes: ["check_balance", "show_funds"],
  schema: balanceSchema,
  execute: async (agent: Agent<Client & PublicActions & WalletActions>, input: Record<string, any>) => {
    const { tokenAddress } = input;
    try {
      const balanceInfo = await get_balance(agent, tokenAddress);
      return {
        status: "success",
        ...balanceInfo,
        tokenAddress: tokenAddress || "native",
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error.message || "Failed to fetch balance",
      };
    }
  },
};

export default balanceTool;
