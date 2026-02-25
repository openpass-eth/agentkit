import type { PublicClient, WalletClient } from "viem";
import type { AgentPlugin, AgentTool } from "../types/agent";

type PluginActions<T> = T extends AgentPlugin ? T["actions"] : Record<string, never>;

export type TempoAgent<TActions = Record<string, never>> = {
  publicClient: PublicClient;
  walletClient: WalletClient;
  actions: TActions;
  tools: AgentTool[];
  use: <P extends AgentPlugin>(plugin: P) => TempoAgent<TActions & PluginActions<P>>;
};

export type CreateTempoAgentParameters = {
  publicClient: PublicClient;
  walletClient: WalletClient;
};

export function createTempoAgent<TActions = Record<string, never>>(
  parameters: CreateTempoAgentParameters
): TempoAgent<TActions> {
  const plugins = new Map<string, AgentPlugin>();

  const agent = {
    publicClient: parameters.publicClient,
    walletClient: parameters.walletClient,
    actions: {},
    tools: [] as AgentTool[],
  };

  function use(base: any) {
    return <P extends AgentPlugin>(plugin: P) => {
      if (plugins.has(plugin.name)) {
        return base;
      }

      plugin.initialize(base);

      const newActions = { ...base.actions } as Record<string, unknown>;
      for (const [actionName, action] of Object.entries(plugin.actions)) {
        if (newActions[actionName]) {
          throw new Error(`Action ${actionName} already exists in actions`);
        }
        newActions[actionName] = action.bind(plugin);
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

  return Object.assign(agent, { use: use(agent) }) as unknown as TempoAgent<TActions>;
}
