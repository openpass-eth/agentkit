import type { TempoAgent, AgentPlugin } from "@tempo-agent-kit/core";
import transferTool from "./tools/transfer";
import balanceTool from "./tools/balance";
import * as actions from "./actions";

const tokenPlugin = {
  name: "token_plugin",

  actions: { ...actions } as any, // Will be wrapped in initialize

  tools: [
    transferTool,
    balanceTool,
  ],

  initialize: function (agent: TempoAgent): void {
    console.log("[TokenPlugin] Initialized with agent");
    // Wrap actions to inject agent
    for (const [key, action] of Object.entries(actions)) {
      (this.actions as any)[key] = (...args: any[]) => (action as any)(agent, ...args);
    }
  },
} satisfies AgentPlugin;

export default tokenPlugin;
export { tokenPlugin };
