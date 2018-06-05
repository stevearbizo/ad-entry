/* -- ENVIRONMENT --------------------------------------------
 *
 *
 */

export function prepare(environmentId) {
	console.log('Environment.prepare()', environmentId)
	var environment = getDeployProfile(environmentId)
	adParams.environmentId = environment.id
	// run-path + subpaths
	adParams.runPath = matchProtocolTo(environment.runPath) // must be defined in environment
	adParams.commonPath = adParams.runPath + ('commonPath' in environment ? environment.commonPath : 'common/')
	adParams.jsPath = adParams.commonPath + ('jsPath' in environment ? environment.jsPath : 'js/')
	adParams.fontsPath = adParams.commonPath + ('fontsPath' in environment ? environment.fontsPath : 'fonts/')

	// ad-path and subpaths
	adParams.adPath = adParams.runPath + environment.adPath // must be defined in environment
	adParams.imagesPath = adParams.adPath + ('imagesPath' in environment ? environment.imagesPath : 'images/')
	adParams.videosPath = adParams.adPath + ('videosPath' in environment ? environment.videosPath : 'videos/')
}

export function checkDebugFlag() {
	console.log('Environment.checkDebugFlag()')
	let debugModeRequested
	// index-coded debug control
	if (typeof window.debug !== 'undefined' && typeof window.debug !== 'function') {
		debugModeRequested = 'via window-param "var debug = ' + window.debug + '"'
	} else if ('debug' in queryParams) {
		// query-string debug control - can override window.debug
		debugModeRequested = 'via query-string "?debug=' + window.debug + '"'
		window.debug = queryParams.debug.match(/^(true|yes|t|y|1)/i) != null
	} else {
		// unspecified debug state implies we are in build mode
		window.debug = true
	}
	// set pathing per requested state
	if (debugModeRequested) {
		if (window.debug) {
			prepare('debug')
			traceDeployProfile()
			console.log(' - DEBUG MODE ON, ' + debugModeRequested)
			console.log('    * requires "to_debug/" content is at: "' + debugEnvironment.runPath + '"')
		} else {
			prepare(adParams.requestedEnvironmentId)
			traceDeployProfile()
			console.log(' - DEBUG MODE OFF, ' + debugModeRequested)
		}
	} else {
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
	if (adParams.runPath == '') console.log('  RUN PATH:', './')
	else console.log('  RUN PATH:', adParams.runPath)
	if (adParams.adPath == '') console.log('  AD PATH:', './')
	else console.log('  AD PATH:', adParams.adPath)
	console.log(' POLITE LOAD AFTER:', adParams.politeLoadAfter + 's')
	console.log(line)
	console.log(' AD PARAMS:', adParams)
	console.log(line)
}
