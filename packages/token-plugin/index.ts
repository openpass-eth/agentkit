import type { TempoAgent, AgentPlugin } from "@tempo-agent-kit/core";
import transferTool from "./tools/transfer";
import balanceTool from "./tools/balance";
import * as actions from "./actions";

const tokenPlugin = {
  name: "token_plugin",

  actions: { ...actions },

  tools: [
    transferTool,
    balanceTool,
  ],

  initialize: function (agent: TempoAgent<any>): void {
    console.log("[TokenPlugin] Initialized with agent");
    // Wrap actions to inject agent
    for (const [key, action] of Object.entries(actions)) {
      (this.actions as any)[key] = (...args: any[]) => (action as any)(agent, ...args);
    }
  },
} satisfies AgentPlugin<typeof actions>;

export default tokenPlugin;
export { tokenPlugin };
