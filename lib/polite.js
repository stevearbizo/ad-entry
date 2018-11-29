let delay
let initTime
//
export function prepare(politeLoadAfter) {
	console.log(`Polite.prepare()`)
	initTime = Date.now()
	if (isDevEnvironment()) {
		console.log(` - no polite load delay in dev environment`)
		delay = 0
	} else {
		console.log(` - polite load after ${politeLoadAfter}s`)
		delay = politeLoadAfter * 1000
	}
	return Promise.resolve()
}

export function resolveDelay() {
	return new Promise(resolve => {
		if (/comp|inter|loaded/.test(document.readyState)) {
			runDelay().then(resolve)
		} else {
			document.addEventListener('DOMContentLoaded', function(event) {
				runDelay().then(resolve)
			})
		}
	})
}
function runDelay() {
	console.log(`Polite.runDelay(), on DOMContentLoaded + ${delay / 1000}s...`)
	// determine time elapsed to now
	const duration = Date.now() - initTime
	if (duration > delay) {
		return Promise.resolve()
	}
	// if required delay is not meant, timeout for remainder
	else {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve()
			}, delay - duration)
		})
	}
}
