import fp from 'fastify-plugin'
import S from 'fluent-json-schema'
import { Piscina } from 'piscina'
import { read } from './read.js'

const schema = {
	params: S.object()
		.prop('streamName', S.string().required()),

	body: S.object()
		.prop('projection', S.string().required()),

	response: {
		200: S.object()
			.prop('aggregate', S.raw()),
	},
}

const piscina = new Piscina({
	filename: new URL('./projection-worker.js', import.meta.url).href,
})

export default fp(async function (fastify, _opts) {
	fastify.route({
		method: 'POST',
		url: '/fetch/:streamName',
		schema,
		async handler (request, _reply) {
			const streamName = request.params.streamName
			const dbConnection = this.database
			const { projection } = request.body

			const results = await fetch(dbConnection, streamName, projection)

			return results
		},
	})
})

export async function fetch (dbConn, streamName, projection) {
	const { messages } = await read(dbConn, streamName)

	const aggregate = await piscina.run({ events: messages, projection })

	return { aggregate }
}
