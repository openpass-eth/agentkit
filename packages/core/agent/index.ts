import type { Client } from "viem";
import type { AgentPlugin, AgentTool, ActionTransform } from "../types/agent";

type PluginActions<TClient extends Client, T> = T extends AgentPlugin<infer A> ? ActionTransform<TClient, A> : Record<string, never>;

export type TempoAgent<TClient extends Client = Client, TActions = Record<string, any>> = {
  client: TClient;
  actions: TActions;
  tools: AgentTool<TClient>[];
  use: <P extends AgentPlugin<any>>(plugin: P) => TempoAgent<TClient, TActions & PluginActions<TClient, P>>;
};

export type CreateTempoAgentParameters<TClient extends Client = Client> = {
  client: TClient;
};

export function createTempoAgent<TClient extends Client, TActions = Record<string, never>>(
  parameters: CreateTempoAgentParameters<TClient>
): TempoAgent<TClient, TActions> {
  const plugins = new Map<string, AgentPlugin>();

  const agent = {
    client: parameters.client,
    actions: {},
    tools: [] as AgentTool<TClient>[],
  };

  function use(base: any) {
    return <P extends AgentPlugin<any>>(plugin: P) => {
      if (plugins.has(plugin.name)) {
        return base;
      }

      const newActions = { ...base.actions } as Record<string, unknown>;
      for (const [actionName, action] of Object.entries(plugin.actions)) {
        if (newActions[actionName]) {
          throw new Error(`Action ${actionName} already exists in actions`);
        }
        newActions[actionName] = (...args: any[]) => (action as any)(base, ...args);
      }

      const newTools = [...base.tools];
      for (const tool of plugin.tools) {
        newTools.push(tool);
      }

      plugins.set(plugin.name, plugin);

      const combined = {
        ...base,
        actions: newActions,
        tools: newTools,
      };

      return Object.assign(combined, { use: use(combined) });
    };
  }

  return Object.assign(agent, { use: use(agent) }) as unknown as TempoAgent<TClient, TActions>;
}
