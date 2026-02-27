import type { AgentPlugin } from "@openpass-eth/agentkit";
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
} satisfies AgentPlugin<typeof actions>;

export default tokenPlugin;
export { tokenPlugin };
