import { createConfig } from "ponder";

import { AutomateAbi } from "./abis/AutomateAbi";

export default createConfig({
	ordering: "multichain",
	chains: {
		berachain: {
			id: 80094,
			rpc: process.env.PONDER_RPC_URL_80094,
		},
	},
	contracts: {
		Automate: {
			abi: AutomateAbi,
			chain: {
				berachain: {
					address: "0xafd37d0558255aA687167560cd3AaeEa75c2841E",
					startBlock: 702100,
				},
			},
		},
	},
});
