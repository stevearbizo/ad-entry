/* -- ENVIRONMENT --------------------------------------------
 *
 *
 */ 
export function prepare(environmentId) {
	console.log('Environment.prepare()', environmentId);
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
	console.log('Environment.checkDebugFlag()')
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
			console.log(' - DEBUG MODE OFF, ' + debugModeRequested)
		}
	}
	else {
			traceDeployProfile()
	}
}


function traceDeployProfile() {
	var line = Array(80).join('-')
	console.log(line)
	console.log(' ==== TEMPLATE.id == ')
	console.log(line)
	console.log(' NETWORK:', adParams.networkId)
	console.log(' AD SIZE:', adParams.adSize)
	console.log(' ENVIRONMENT:', adParams.environmentId)
	if (adParams.runPath == '') console.log('  RUN PATH:', './'); else console.log('  RUN PATH:', adParams.runPath)
	if (adParams.adPath == '') console.log('  AD PATH:', './'); else console.log('  AD PATH:', adParams.adPath)
	if (adParams.adManager) console.log('  JSON PATH:', adParams.adManager.jsonMapUrl)
	console.log(' POLITE LOAD AFTER:', adParams.politeLoadAfter + 's')
	console.log(line)
	console.log(' AD PARAMS:', adParams)
	console.log(line)
}


