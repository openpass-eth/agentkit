import { createTempoAgent } from "@tempo-agent-kit/core"
import { tokenPlugin } from "@tempo-agent-kit/token-plugin"

async function main() {
  const agent = createTempoAgent({
    publicClient: null as any,
    walletClient: null as any,
  }).use(tokenPlugin);

  console.log("Agent Tools:", agent.tools.map((t: any) => t));

  // Test the actions from the plugin
  const balance = await agent.actions.get_balance();
  console.log("Balance Result:", balance);

  const transferResult = await agent.actions.transfer("0x123", 1.5);
  console.log("Transfer Result:", transferResult);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
