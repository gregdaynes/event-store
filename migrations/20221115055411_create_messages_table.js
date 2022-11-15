export function up (knex) {
	return knex.schema.createTable('messages', (table) => {
		table.uuid('id').notNullable().unique()
		table.increments('globalPosition', { primaryKey: true })
		table.integer('position').notNullable()
		table.string('type').notNullable()
		table.jsonb('data').nullable()
		table.jsonb('metadata').nullable()
		table.string('streamName').notNullable()
		table.string('streamCategory').notNullable()
		table.string('streamId').notNullable()
		table.integer('streamHash').notNullable()
		table.timestamp('time').defaultTo(knex.fn.now())

		table.index(['streamCategory'])
		table.index(['streamHash'])
		table.index(['streamName', 'position'])
		table.index(['streamId'])
	})
}

export function down (knex) {
	return knex.schema.dropTable('messages')
}
