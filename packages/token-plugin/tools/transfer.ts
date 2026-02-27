import { z } from "zod";
import type { AgentTool, Agent } from "@openpass-eth/agentkit";
import { type Client, type PublicActions, type WalletActions } from "viem";
import { transfer } from "../actions";

const transferSchema = z.object({
  to: z.string().describe("The recipient address"),
  amount: z.number().describe("The amount to transfer"),
  tokenAddress: z.string().optional().describe("The address of the token to transfer (optional, defaults to native token)"),
});

const transferTool: AgentTool = {
  name: "transfer_token",
  description: "Transfer native or ERC20 tokens to a recipient address.",
  similes: ["send_tokens", "pay_address"],
  schema: transferSchema,
  execute: async (agent: Agent<Client & PublicActions & WalletActions>, input: Record<string, any>) => {
    const { to, amount, tokenAddress } = input;
    try {
      const transferInfo = await transfer(agent, to, amount, tokenAddress);
      return {
        status: "success",
        ...transferInfo,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error.message || "Failed to transfer token",
      };
    }
  },
};

export default transferTool;
