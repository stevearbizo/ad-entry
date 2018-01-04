import * as environment from './environment.js'

export function prepare() {
	console.log('Scope.prepare()')
	prepareAdParams()
	prepareAdParamsMisc() // window
	prepareQueryParams()
	checkForAdTagParams()
	prepareEnvironment()
	prepareOnError()
	preparePolite()
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
		var value = queryParams[ key ].replace(/^\{/, '').replace(/\}$/, '')
		if (value != '') {
			console.log(' - applying to global.' + key + ': ' + value)
			window[ key ] = value
		}
	}
}


function prepareOnError() {
	console.log('Scope.prepareOnError()')
	if (adParams.failoverOnError)
		onerror = handleError
}

function handleError() {
	console.log('Scope.handleError() - JAVASCRIPT ERROR!')
	onerror = function() {} // after the first error, disable the event listening
	failAd()
}



function preparePolite() {
	console.log('Scope.preparePolite()')
	async.wait()
	function runDelay() {
		var delay = isDevEnvironment() ? 0 : adParams.politeLoadAfter
		setTimeout(function() {
			console.log('Scope.DOMContentLoaded + ' + delay + 's')
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




