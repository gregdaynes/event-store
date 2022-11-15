/**
 * Hash64 string value to unique 64-bit integer
 *
 * @param {string} str - string to hash
 * @returns {integer}
 */
export default function hash (str) {
	let i = str.length
	let hash1 = 5381
	let hash2 = 52711

	while (i--) {
		const char = str.charCodeAt(i)
		hash1 = (hash1 * 33) ^ char
		hash2 = (hash2 * 33) ^ char
	}

	return (hash1 >>> 0) * 4096 + (hash2 >>> 0)
}
