export class ErrorVersionConflict extends Error {
	constructor (streamName, errorMatch, expectedVersion) {
		const actualVersion = parseInt(errorMatch, 10)
		const message = `VersionConflict: stream ${streamName} expected version ${expectedVersion} but was at version ${actualVersion}`
		super(message)
		this.name = 'ErrorVersionConflict'
	}
}

export default {
	Raw: Error,
	VersionConflict: ErrorVersionConflict,
}
