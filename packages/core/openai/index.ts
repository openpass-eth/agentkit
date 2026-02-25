import { type Tool, tool } from "@openai/agents";
import type { TempoAgent } from "../agent";

/**
 * Converts TempoAgent tools to OpenAI Agent Tool format.
 * Includes similes in the description for better discovery.
 */
export const toOpenAITools = (agent: TempoAgent): Record<string, Tool> => {
  const tools: Record<string, Tool> = {};

  for (const t of agent.tools) {
    tools[t.name] = tool({
      name: t.name,
      description: `${t.description}${t.similes.length > 0 ? ` (also known as: ${t.similes.join(", ")})` : ""}`,
      parameters: t.schema as any,
      execute: async (input: any) => {
        return t.execute(agent, input);
      },
    });
  }

  return tools;
};
