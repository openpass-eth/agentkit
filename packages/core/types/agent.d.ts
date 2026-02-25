import { z } from "zod";
import type { TempoAgent } from "../agent";

export interface AgentTool {
  name: string;
  description: string;
  similes: string[];
  schema: z.ZodType<any>;
  execute(agent: TempoAgent, input: Record<string, any>): Record<string, any>;
}

export interface AgentPlugin {
  name: string;
  methods: Record<string, any>;
  tools: AgentTool[];
  initialize(agent: TempoAgent): void;
}
