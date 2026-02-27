import { createAgent, type AgentTool } from "@openpass-eth/agentkit"
import { tokenPlugin } from "@openpass-eth/token-plugin"
import { createClient, http, publicActions, walletActions } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { tempoModerato } from "viem/chains";
import { tempoActions } from "viem/tempo";

async function main() {
  const account = privateKeyToAccount(generatePrivateKey())
  const client = createClient({
    account: account,
    chain: tempoModerato,
    transport: http(),
  })
    .extend(publicActions)
    .extend(walletActions)
    .extend(tempoActions())

  const agent = createAgent({
    client: client,
  }).use(tokenPlugin);

  console.log("Agent Tools:", agent.tools.map((t: AgentTool) => t.name));

  // Test the actions from the plugin
  const balance = await agent.actions.get_balance("0x20c000000000000000000000e988df03afa8ccdb");
  console.log("Balance Result:", balance);

  const transferResult = await agent.actions.transfer("0x123", 1.5);
  console.log("Transfer Result:", transferResult);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
