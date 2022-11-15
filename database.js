import fp from 'fastify-plugin'
import knex from 'knex'
import knexfile from './knexfile.js'

export default fp(async function (fastify, _opts) {
	const database = knex(knexfile[process.env.NODE_ENV])

	database.migrate.latest()

	fastify.decorate('database', database)
})
