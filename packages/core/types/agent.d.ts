import { z } from "zod";
import type { TempoAgent } from "../agent";

export interface AgentTool {
  name: string;
  description: string;
  similes: string[];
  schema: z.AnyZodObject;
  execute(agent: TempoAgent, input: Record<string, any>): any | Promise<any>;
}

export type StripAgentArg<T> = T extends (agent: TempoAgent<any>, ...args: infer P) => infer R
  ? (...args: P) => R
  : T;

export type ActionTransform<T> = {
  [K in keyof T]: StripAgentArg<T[K]>;
};

export interface AgentPlugin<TActions = Record<string, any>> {
  name: string;
  actions: TActions;
  tools: AgentTool[];
  initialize(agent: TempoAgent<any>): void;
}
