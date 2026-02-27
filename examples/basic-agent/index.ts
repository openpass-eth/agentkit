import { createAgent, type AgentTool } from "@openpass-eth/agentkit"
import { tokenPlugin } from "@openpass-eth/token-plugin"
import { createClient, http, publicActions, walletActions } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

async function main() {
  const account = privateKeyToAccount(generatePrivateKey())
  const client = createClient({
    account: account,
    chain: sepolia,
    transport: http(),
  })
    .extend(publicActions)
    .extend(walletActions)

  const agent = createAgent({
    client: client,
  }).use(tokenPlugin);

  console.log("Agent Tools:", agent.tools.map((t: AgentTool) => t.name));

  // Test the actions from the plugin
  try {
    const balance = await agent.actions.get_balance();
    console.log("Native Balance Result:", balance);
  } catch (e) {
    console.error(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
