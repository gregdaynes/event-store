import writeEndpoint, { write } from './write.js'

export default async function (fastify, opts) {
	await fastify.register(import('./database.js'), opts)
	await fastify.register(writeEndpoint, opts)
}

export {
	write,
}
