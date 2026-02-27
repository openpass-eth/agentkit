import { z } from "zod";
import type { Client } from "viem";
import type { Agent } from "../agent";

export interface AgentTool<TClient extends Client = Client> {
  name: string;
  description: string;
  similes: string[];
  schema: z.AnyZodObject;
  execute(agent: Agent<TClient, any>, input: Record<string, any>): any | Promise<any>;
}

export type StripAgentArg<TClient extends Client, T> = T extends (agent: Agent<TClient, any>, ...args: infer P) => infer R
  ? (...args: P) => R
  : T;

export type ActionTransform<TClient extends Client, T> = {
  [K in keyof T]: StripAgentArg<TClient, T[K]>;
};

export interface AgentPlugin<TActions = Record<string, any>> {
  name: string;
  actions: TActions;
  tools: AgentTool[];
}
