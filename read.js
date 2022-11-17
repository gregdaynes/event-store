import deserializeMessage from './deserialize-message.js'
import fp from 'fastify-plugin'
import S from 'fluent-json-schema'

const schema = {
	params: S.object()
		.prop('streamName', S.string().required()),

	query: S.object()
		.prop('fromPosition', S.integer())
		.prop('maxMessages', S.integer()),

	response: {
		200: S.object()
			.prop('messages', S.array(S.object())),
	},
}

export default fp(async function (fastify, _opts) {
	fastify.route({
		method: 'GET',
		url: '/read/:streamName',
		schema,
		async handler (request, _reply) {
			const streamName = request.params.streamName
			const dbConnection = this.database
			const { fromPosition, maxMessages } = request.query

			const results = await read(dbConnection, streamName, fromPosition, maxMessages)

			return results
		},
	})

	fastify.route({
		method: 'GET',
		url: '/latest-messages/:streamName',
		schema,
		async handler (request, _reply) {
			const streamName = request.params.streamName
			const dbConnection = this.database
			const { fromPosition, maxMessages } = request.query

			const reverse = true
			const results = await read(dbConnection, streamName, fromPosition, maxMessages, reverse)

			return results
		},
	})
})

export async function read (dbConn, streamName, fromPosition = 0, maxMessages = 1000, reverse = false) {
	const query = dbConn('messages')
		.select()
		.where('globalPosition', '>=', fromPosition)
		.orderBy('globalPosition', reverse ? 'DESC' : 'ASC')
		.limit(maxMessages)

	streamName.includes('-')
		? query.where('streamName', streamName)
		: query.where('streamCategory', streamName)

	const rows = await query
	const messages = rows.reduce(messageFromRow, [])

	return { messages }
}

function messageFromRow (acc, row) {
	return acc.concat(deserializeMessage(row))
}
