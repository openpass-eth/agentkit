import { tool, type Tool } from "ai";
import type { TempoAgent } from "../agent";

export const toVercalAITools = (agent: TempoAgent): Record<string, Tool> => {
  const tools: Record<string, Tool> = {};

  for (const t of agent.tools) {
    tools[t.name] = tool({
      description: `${t.description}${t.similes.length > 0 ? ` (also known as: ${t.similes.join(", ")})` : ""}`,
      inputSchema: t.schema as any,
      execute: async (input: any) => {
        return t.execute(agent, input);
      },
    });
  }

  return tools;
};