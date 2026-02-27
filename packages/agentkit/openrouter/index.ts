import { toOpenAITools } from "../openai";
import type { Agent } from "../agent";

/**
 * Converts Agent tools to OpenRouter format (identical to OpenAI).
 */
export const toOpenRouterTools = (agent: Agent) => {
  return toOpenAITools(agent);
};
