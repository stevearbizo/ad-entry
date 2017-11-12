/* -- ENVIRONMENT --------------------------------------------
 *
 *
 */ 
export function prepare(environmentId) {
	trace('Environment.prepare()', environmentId);
	var environment = getDeployProfile(environmentId)
	adParams.environmentId = environment.id
	// run-path + subpaths
	adParams.runPath = matchProtocolTo(environment.runPath) 	// must be defined in environment
	adParams.corePath = adParams.runPath + ('corePath' in environment ? environment.corePath : '_adlib/core/')
	adParams.commonPath = adParams.runPath + ('commonPath' in environment ? environment.commonPath : '_adlib/common/')
	adParams.jsPath = adParams.corePath + ('jsPath' in environment ? environment.jsPath : 'js/')
	adParams.loaderPath = adParams.jsPath + 'net/load/'
	adParams.fontsPath = adParams.commonPath + ('fontsPath' in environment ? environment.fontsPath : 'fonts/')

	// ad-path and subpaths
	adParams.adPath = adParams.runPath + environment.adPath	// must be defined in environment
	adParams.imagesPath = adParams.adPath + ('imagesPath' in environment ? environment.imagesPath : 'images/')
	adParams.videosPath = adParams.adPath + ('videosPath' in environment ? environment.videosPath : 'videos/')
}
function getDeployProfile(id) {
	for (var i = 0; i < environments.length; i++) {
		if (environments[i].id === id) 
			return environments[i]
	}
	return false
}




export function checkDebugFlag() {
	trace('Environment.checkDebugFlag()')
	var debugModeRequested
	// index-coded debug control
	if (typeof debug != 'undefined' && typeof debug != 'function') {
		debugModeRequested = 'via window-param "var debug = ' + debug + '"'
	}
	// query-string debug control - can override window.debug
	else if ('debug' in queryParams) {
		debugModeRequested = 'via query-string "?debug=' + debug + '"'
		debug = queryParams.debug.match(/^(true|yes|t|y|1)/i) != null
	}
	// unspecified debug state implies we are in build mode
	else { 
		var debug = true
	}
	// set pathing per requested state
	if (debugModeRequested) {
		if (debug) {
			prepare("debug")
			traceDeployProfile()
			console.log(' - DEBUG MODE ON, ' + debugModeRequested)
			console.log('    * requires "to_debug/" content is at: "' + debugEnvironment.runPath + '"')
		}
		else {
			prepare(adParams.requestedEnvironmentId)
			traceDeployProfile()
			trace(' - DEBUG MODE OFF, ' + debugModeRequested)
		}
	}
	else {
			traceDeployProfile()
	}
}


function traceDeployProfile() {
	var line = Array(80).join('-')
	trace(line)
	trace(' ==== TEMPLATE.id == ')
	trace(line)
	trace(' NETWORK:', adParams.networkId)
	trace(' AD SIZE:', adParams.adSize)
	trace(' ENVIRONMENT:', adParams.environmentId)
	if (adParams.runPath == '') trace('  RUN PATH:', './'); else trace('  RUN PATH:', adParams.runPath)
	if (adParams.adPath == '') trace('  AD PATH:', './'); else trace('  AD PATH:', adParams.adPath)
	if (adParams.adManager) trace('  JSON PATH:', adParams.adManager.jsonMapUrl)
	trace(' POLITE LOAD AFTER:', adParams.politeLoadAfter + 's')
	trace(line)
	trace(' AD PARAMS:', adParams)
	trace(line)
}


