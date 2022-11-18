import writeEndpoint, { write } from './write.js'
import readEndpoint, { read } from './read.js'
import fetchEndpoint, { fetch } from './fetch.js'

export default async function (fastify, opts) {
	await fastify.register(import('./database.js'), opts)
	await fastify.register(writeEndpoint, opts)
	await fastify.register(readEndpoint, opts)
	await fastify.register(fetchEndpoint, opts)
}

export {
	write,
	read,
	fetch,
}
