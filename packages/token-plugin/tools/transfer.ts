import { z } from "zod";
import type { AgentTool, TempoAgent } from "@tempo-agent-kit/core";
import { transfer } from "../actions";

const transferSchema = z.object({
  to: z.string().describe("The recipient address"),
  amount: z.number().describe("The amount to transfer"),
  tokenAddress: z.string().optional().describe("The address of the token to transfer (optional, defaults to native token)"),
});

const transferTool: AgentTool = {
  name: "transfer_token",
  description: "Transfer native or SPL tokens to a recipient address.",
  similes: ["send_tokens", "pay_address"],
  schema: transferSchema,
  execute: async (agent: TempoAgent, input: Record<string, any>) => {
    const { to, amount, tokenAddress } = input;
    const hash = await transfer(agent, to, amount, tokenAddress);
    return {
      status: "success",
      hash,
      to,
      amount,
      tokenAddress: tokenAddress || "native",
    };
  },
};

export default transferTool;
