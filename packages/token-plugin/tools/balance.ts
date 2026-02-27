import { z } from "zod";
import type { AgentTool, Agent } from "@openpass-eth/agentkit";
import type { Client } from "viem";
import type { TempoActions } from "viem/tempo";
import { get_balance } from "../actions";

const balanceSchema = z.object({
  tokenAddress: z.string().describe("The token address to check the balance of"),
});

const balanceTool: AgentTool = {
  name: "get_balance",
  description: "Get the balance of a token for the agent.",
  similes: ["check_balance", "show_funds"],
  schema: balanceSchema,
  execute: async (agent: Agent<Client & TempoActions>, input: Record<string, any>) => {
    const { tokenAddress } = input;
    try {
      const balance = await get_balance(agent, tokenAddress);
      return {
        status: "success",
        balance,
        tokenAddress,
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
