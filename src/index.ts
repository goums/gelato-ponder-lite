import { ponder, type IndexingFunctionArgs } from "ponder:registry";
import { tasks, executions, creators } from "ponder:schema";

ponder.on("Automate:TaskCreated", onTaskCreated);
ponder.on("Automate:TaskCancelled", onTaskCancelled);

ponder.on("Automate:ExecBypassModuleSuccess", onExecSucess);
ponder.on("Automate:ExecBypassModuleSyncFeeSuccess", onExecSucess);
ponder.on("Automate:ExecSuccess", onExecSucess);

export async function onExecSucess({
	event,
	context,
}: IndexingFunctionArgs<
	| "Automate:ExecBypassModuleSyncFeeSuccess"
	| "Automate:ExecBypassModuleSuccess"
	| "Automate:ExecSuccess"
>) {
	//console.log(`ExecSuccess: ${event.args.taskId}`);
	const db = context.db;
	const chainId = context.chain.id;

	await db.insert(executions).values({
		id: event.transaction.hash,
		chainId,
		taskId: event.args.taskId,
		executedAt: event.block.timestamp,
		transactionHash: event.transaction.hash,
	});

	await db
		.update(tasks, {
			chainId,
			id: event.args.taskId,
		})
		.set((task) => ({
			nbExecutions: task.nbExecutions + 1,
		}));
}

export async function onTaskCreated({
	event,
	context,
}: IndexingFunctionArgs<"Automate:TaskCreated">) {
	const db = context.db;
	const chainId = context.chain.id;
	//console.log(`TaskCreated: ${chainId} ${event.args.taskId}`);

	await db
		.insert(creators)
		.values({
			id: event.args.taskCreator,
			nbTasks: 1,
		})
		.onConflictDoUpdate((creator) => ({
			nbTasks: creator.nbTasks + 1,
		}));

	await db
		.insert(tasks)
		.values({
			id: event.args.taskId,
			chainId,
			taskHash: event.args.taskId,
			taskCreatorId: event.args.taskCreator,
			status: "ongoing",
			nbExecutions: 0,
			modules: [...event.args.moduleData.modules],
			moduleArgs: [...event.args.moduleData.args],
			createdAt: event.block.timestamp,
		})
		.onConflictDoUpdate((task) => ({
			status: "ongoing",
			createdAt: event.block.timestamp,
		}));
}

export async function onTaskCancelled({
	event,
	context,
}: IndexingFunctionArgs<"Automate:TaskCancelled">) {
	const db = context.db;
	const chainId = context.chain.id;

	//console.log(`TaskCancelled: ${chainId} ${event.args.taskId}`);

	await db
		.update(creators, {
			id: event.args.taskCreator,
		})
		.set((creator) => ({
			nbTasks: creator.nbTasks - 1,
		}));

	await db
		.update(tasks, {
			chainId,
			id: event.args.taskId,
		})
		.set((task) => ({
			status: "cancelled",
			cancelledAt: event.block.timestamp,
		}));
}
