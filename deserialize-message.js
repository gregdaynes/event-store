export default function deserializeMessage (rawMessage) {
	if (!rawMessage) {
		return null
	}

	const data = JSON.parse(rawMessage.data, '{}')
	const metadata = JSON.parse(rawMessage.metadata, '{}')

	return {
		...rawMessage,
		data,
		metadata,
		position: parseInt(rawMessage.position, 10),
		globalPosition: parseInt(rawMessage.globalPosition, 10),
	}
}

export {
	deserializeMessage,
}
