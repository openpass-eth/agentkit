import { createTempoAgent } from "@tempo-agent-kit/core"

async function main() {
  const agent = createTempoAgent({
    publicClient: null as any,
    walletClient: null as any,
  });

  console.log(agent);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
