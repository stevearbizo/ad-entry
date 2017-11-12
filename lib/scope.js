import * as environment from './environment.js'

export function prepare() {
	trace('Scope.prepare()')
	prepareAdParams()
	prepareAdParamsMisc() // window
	prepareQueryParams()
	checkForAdTagParams()
	prepareEnvironment()
	prepareOnError()
	preparePolite()
}

function prepareAdParams() {
	trace('Scope.prepareAdParams()')
	adParams.adSize = adParams.adWidth + 'x' + adParams.adHeight
	adParams.failoverWidth = adParams.preloaderWidth = adParams.adWidth
	adParams.failoverHeight = adParams.preloaderHeight = adParams.adHeight
	adParams.failoverX = adParams.preloaderX = 0
	adParams.failoverY = adParams.preloaderY = 0
}

function prepareEnvironment() {
	trace('Scope.prepareEnvironment()')
	adParams.requestedEnvironmentId = adParams.environmentId
	environment.prepare(adParams.requestedEnvironmentId)
	environment.checkDebugFlag()
}


function prepareQueryParams() {
	trace('Scope.prepareQueryParams()')
	queryParams = getQueryParams()
}

function checkForAdTagParams() {
	trace('Scope.checkForAdTagParams()')
	for (var key in queryParams) {
		var value = queryParams[ key ].replace(/^\{/, '').replace(/\}$/, '')
		if (value != '') {
			trace(' - applying to global.' + key + ': ' + value)
			window[ key ] = value
		}
	}
}


function prepareOnError() {
	trace('Scope.prepareOnError()')
	if (adParams.failoverOnError)
		onerror = handleError
}

function handleError() {
	trace('Scope.handleError() - JAVASCRIPT ERROR!')
	onerror = function() {} // after the first error, disable the event listening
	failAd()
}



function preparePolite() {
	trace('Scope.preparePolite()')
	async.wait()
	function runDelay() {
		var delay = isDevEnvironment() ? 0 : adParams.politeLoadAfter
		setTimeout(function() {
			trace('Scope.DOMContentLoaded + ' + delay + 's')
			async.done()
		}, delay * 1000)					
	}
	if (/comp|inter|loaded/.test(document.readyState)) {
		runDelay()
	}
	else {
		document.addEventListener('DOMContentLoaded', function(event) {
			runDelay()
		})
	}
}




