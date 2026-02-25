import { z } from "zod";
import type { AgentTool, TempoAgent } from "@tempo-agent-kit/core";
import { get_balance } from "../actions";

const balanceSchema = z.object({
  address: z.string().optional().describe("The address to check the balance of (optional, defaults to agent address)"),
});

const balanceTool: AgentTool = {
  name: "get_balance",
  description: "Get the balance of native or SPL tokens for an address.",
  similes: ["check_balance", "show_funds"],
  schema: balanceSchema,
  execute: async (agent: TempoAgent, input: Record<string, any>) => {
    const { address } = input;
    const balance = await get_balance(agent, address);
    return {
      status: "success",
      balance,
      address: address || "self",
    };
  },
};

export default balanceTool;
