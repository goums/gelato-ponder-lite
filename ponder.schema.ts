import { onchainTable, primaryKey, relations } from "ponder";

export const tasks = onchainTable(
	"tasks",
	(t) => ({
		id: t.text(),
		chainId: t.integer(),
		taskHash: t.hex().notNull(),
		taskCreatorId: t.hex().notNull(),
		status: t.text().notNull(),
		nbExecutions: t.integer().notNull(),
		modules: t.integer().array().notNull(),
		moduleArgs: t.hex().array().notNull(),
		createdAt: t.bigint().notNull(),
		cancelledAt: t.bigint(),
	}),
	(table) => ({ pk: primaryKey({ columns: [table.chainId, table.id] }) }),
);

export const executions = onchainTable(
	"executions",
	(t) => ({
		id: t.hex(),
		chainId: t.integer(),
		taskId: t.text().notNull(),
		executedAt: t.bigint().notNull(),
		transactionHash: t.hex().notNull(),
	}),
	(table) => ({ pk: primaryKey({ columns: [table.chainId, table.id] }) }),
);

export const creators = onchainTable("creators", (t) => ({
	id: t.hex().primaryKey(),
	nbTasks: t.integer().notNull(),
}));

export const taskRelations = relations(tasks, ({ many, one }) => ({
	executions: many(executions),
	taskCreator: one(creators, {
		fields: [tasks.taskCreatorId],
		references: [creators.id],
	}),
}));

export const taskExecutionRelations = relations(executions, ({ one }) => ({
	task: one(tasks, {
		fields: [executions.taskId],
		references: [tasks.id],
	}),
}));

export const taskCreatorRelations = relations(creators, ({ many }) => ({
	tasks: many(tasks),
}));
