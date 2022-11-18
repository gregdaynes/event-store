export default function (events, projection) {
	return events.reduce((entity, event) => {
		if (!projection[event.type]) {
			return entity
		}

		return projection[event.type](entity, event)
	}, projection.$init())
}
