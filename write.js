import fp from 'fastify-plugin'
import S from 'fluent-json-schema'
import hash from './hash.js'
import Err from './errors.js'
import { randomUUID } from 'node:crypto'

const schema = {
	params: S.object()
		.prop('streamName', S.string().required()),

	body: S.object()
		.prop('id', S.string())
		.prop('type', S.string().required())
		.prop('data', S.object())
		.prop('metadata', S.object())
		.prop('expectedVersion', S.integer()),

	response: {
		200: S.object()
			.prop('message', S.string().required()),
	},
}

export default fp(async function (fastify, _opts) {
	fastify.route({
		method: 'POST',
		url: '/write/:streamName',
		schema,
		async handler (request, _reply) {
			const streamName = request.params.streamName
			const dbConnection = this.database
			const { id, type, data, metadata, expectedVersion } = request.body

			const message = {
				id,
				type,
				data,
				metadata,
			}

			await write(dbConnection, streamName, message, expectedVersion)

			return { message: 'success' }
		},
	})
})

export async function write (dbConn, streamName, message, expectedVersion) {
	if (!message.type) {
		throw new Err.Raw('Message must have a type')
	}

	const id = message.id || randomUUID()
	const position = await getNextPosition(dbConn, streamName, expectedVersion)

	const values = {
		id,
		position,
		type: message.type,
		data: JSON.stringify(message.data),
		metadata: JSON.stringify(message.metadata),
		...parseStream(streamName),
	}

	return await dbConn('messages').insert(values)
}

async function getNextPosition (dbConn, streamName, expectedVersion) {
	const [row] = await dbConn('messages')
		.select('position')
		.where({ streamName })
		.orderBy('position', 'DESC')

	const position = row?.position || 0
	const nextMessagePosition = 1 + position

	if (expectedVersion) {
		if (nextMessagePosition !== expectedVersion) {
			throw new Err.VersionConflict(
				streamName,
				position,
				expectedVersion,
			)
		}
	}

	return nextMessagePosition
}

function parseStream (streamName) {
	const streamId = streamName.slice(streamName.indexOf('-') + 1)
	const streamCategory = streamName.slice(0, streamName.indexOf('-'))
	const streamHash = hash(streamId)

	return {
		streamName,
		streamCategory,
		streamId,
		streamHash,
	}
}
