import project from './project.js'

export default function ({ events, projection }) {
	if (typeof projection === 'string') {
		// DANGER AHEAD
		// EVAL IN USE AGAINST RECEIVED PAYLOADS FROM REQUESTS
		// ---------------------------------------------------
		// An http request can supply a json body with a projection blob in it.
		// We use this though a service worker to keep it from the global of our
		// main application, and can crash gracefully without concern.
		//
		// This however, is VERY unsafe and should be replaced with another
		// mechanism as soon as possible. Possibly some light, basic logic
		// templating language.
		//
		// TODO replace eval with new Function
		//
		// eslint-disable-next-line
		projection = eval(`function wrap() { return ${projection} } wrap`)()
	}

	return project(events, projection)
}
