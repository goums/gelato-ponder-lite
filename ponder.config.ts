import { createConfig } from "ponder";

import { AutomateAbi } from "./abis/AutomateAbi";

export default createConfig({
	ordering: "multichain",
	chains: {
		arbitrum: {
			id: 42161,
			rpc: process.env.PONDER_RPC_URL_42161,
		},
		bepolia: {
			id: 80069,
			rpc: process.env.PONDER_RPC_URL_80069,
		},
		berachain: {
			id: 80094,
			rpc: process.env.PONDER_RPC_URL_80094,
		},
	},
	contracts: {
		Automate: {
			abi: AutomateAbi,
			chain: {
				arbitrum: {
					address: "0x2A6C106ae13B558BB9E2Ec64Bd2f1f7BEFF3A5E0",
					startBlock: 58563527,
				},
				bepolia: {
					address: "0xafd37d0558255aA687167560cd3AaeEa75c2841E",
					startBlock: 1792563,
				},
				berachain: {
					address: "0xafd37d0558255aA687167560cd3AaeEa75c2841E",
					startBlock: 702100,
				},
			},
		},
	},
});
