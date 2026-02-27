import { tool, type Tool } from "ai";
import type { Agent } from "../agent";

export const toVercalAITools = (agent: Agent): Record<string, Tool> => {
  const tools: Record<string, Tool> = {};

  for (const t of agent.tools) {
    tools[t.name] = tool({
      description: `${t.description}${t.similes.length > 0 ? ` (also known as: ${t.similes.join(", ")})` : ""}`,
      inputSchema: t.schema,
      execute: async (input: Record<string, any>) => {
        return t.execute(agent, input);
      },
    });
  }

  return tools;
};