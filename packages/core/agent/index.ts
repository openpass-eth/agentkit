import type { PublicClient, WalletClient } from "viem";
import type { AgentPlugin, AgentTool } from "../types/agent";

type PluginMethods<T> = T extends AgentPlugin ? T["methods"] : Record<string, never>;

export type TempoAgent<TPlugins = Record<string, never>> = {
  publicClient: PublicClient;
  walletClient: WalletClient;
  methods: TPlugins;
  tools: AgentTool[];
  use: <P extends AgentPlugin>(plugin: P) => TempoAgent<TPlugins & PluginMethods<P>>;
};

export type CreateTempoAgentParameters = {
  publicClient: PublicClient;
  walletClient: WalletClient;
};

export function createTempoAgent<TPlugins = Record<string, never>>(
  parameters: CreateTempoAgentParameters
): TempoAgent<TPlugins> {
  const plugins = new Map<string, AgentPlugin>();

  const agent = {
    publicClient: parameters.publicClient,
    walletClient: parameters.walletClient,
    methods: {},
    tools: [] as AgentTool[],
  };

  function use(base: any) {
    return <P extends AgentPlugin>(plugin: P) => {
      if (plugins.has(plugin.name)) {
        return base;
      }

      plugin.initialize(base);

      const newMethods = { ...base.methods } as Record<string, unknown>;
      for (const [methodName, method] of Object.entries(plugin.methods)) {
        if (newMethods[methodName]) {
          throw new Error(`Method ${methodName} already exists in methods`);
        }
        newMethods[methodName] = method.bind(plugin);
      }

      const newTools = [...base.tools];
      for (const tool of plugin.tools) {
        newTools.push(tool);
      }

      plugins.set(plugin.name, plugin);

      const combined = {
        ...base,
        methods: newMethods,
        tools: newTools,
      };

      return Object.assign(combined, { use: use(combined) });
    };
  }

  return Object.assign(agent, { use: use(agent) }) as unknown as TempoAgent<TPlugins>;
}
