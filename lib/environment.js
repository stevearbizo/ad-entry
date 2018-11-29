/* -- ENVIRONMENT --------------------------------------------
 *
 *	Nominated Deprecation: 11/28/18
 *	 - depends on FAT-403, which would extend @common, @size, @index paradigm to runtime
 *
 */
export function prepare(environmentId) {
	console.log('Environment.prepare()', environmentId)
	var environment = getDeployProfile(environmentId)
	adParams.environmentId = environment.id
	// run-path + subpaths
	adParams.runPath = matchProtocolTo(environment.runPath) // must be defined in environment
	// ad-path and subpaths
	adParams.adPath = adParams.runPath + environment.adPath // must be defined in environment
	adParams.imagesPath = adParams.adPath + ('imagesPath' in environment ? environment.imagesPath : 'images/')
	adParams.videosPath = adParams.adPath + ('videosPath' in environment ? environment.videosPath : 'videos/')
	// common paths
	adParams.commonPath = adParams.adPath + ('commonPath' in environment ? environment.commonPath : 'common/')
	adParams.jsPath = adParams.commonPath + ('jsPath' in environment ? environment.jsPath : 'js/')
	adParams.fontsPath = adParams.commonPath + ('fontsPath' in environment ? environment.fontsPath : 'fonts/')
}
