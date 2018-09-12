import * as environment from './environment.js'

export function prepare() {
	console.log('Scope.prepare()')
	prepareAdParams()
	prepareQueryParams()
	checkForAdTagParams()
	prepareEnvironment()
	prepareOnError()
	return preparePolite()
}

function prepareAdParams() {
	console.log('Scope.prepareAdParams()')
	adParams.adSize = adParams.adWidth + 'x' + adParams.adHeight
	adParams.failoverWidth = adParams.preloaderWidth = adParams.adWidth
	adParams.failoverHeight = adParams.preloaderHeight = adParams.adHeight
	adParams.failoverX = adParams.preloaderX = 0
	adParams.failoverY = adParams.preloaderY = 0
}

function prepareEnvironment() {
	console.log('Scope.prepareEnvironment()')
	adParams.requestedEnvironmentId = adParams.environmentId
	environment.prepare(adParams.requestedEnvironmentId)
	environment.checkDebugFlag()
}

function prepareQueryParams() {
	console.log('Scope.prepareQueryParams()')
	queryParams = getQueryParams()
}

function checkForAdTagParams() {
	console.log('Scope.checkForAdTagParams()')
	for (var key in queryParams) {
		var value = queryParams[key].replace(/^\{/, '').replace(/\}$/, '')
		if (value != '') {
			console.log(' - applying to global.' + key + ': ' + value)
			window[key] = value
		}
	}
}

function prepareOnError() {
	console.log('Scope.prepareOnError()')
	if (adParams.failoverOnError) onerror = handleError
}

function handleError() {
	console.log('Scope.handleError() - JAVASCRIPT ERROR!')
	// ignore known errors. Currently only a DC analytic error happens when tapping on video player in iOS
	const surpressedErrorList = [
		"TypeError: b.some is not a function. (In 'b.some(function(b){return a.j.includes(b.identifier)})', 'b.some' is undefined)"
	]
	const error = arguments[0]
	if (surpressedErrorList.indexOf(error) > -1) {
		console.log('surpressing known error')
		return
	}
	onerror = function() {} // after the first error, disable the event listening
	failAd()
}

function preparePolite() {
	console.log('Scope.preparePolite()')
	return new Promise(resolve => {
		function runDelay() {
			var delay = isDevEnvironment() ? 0 : adParams.politeLoadAfter
			setTimeout(function() {
				console.log('Scope.DOMContentLoaded + ' + delay + 's')
				resolve()
			}, delay * 1000)
		}
		if (/comp|inter|loaded/.test(document.readyState)) {
			runDelay()
		} else {
			document.addEventListener('DOMContentLoaded', function(event) {
				runDelay()
			})
		}
	})
}
