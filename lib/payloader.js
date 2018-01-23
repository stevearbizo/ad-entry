import Async from 'ad-control/lib/Async'
import Loader from 'ad-load'
window.Loader = Loader // temp hack to get Loader module back into the global scope

/* -- PAYLOADER ----------------------------------------------
 *
 *
 */

export function execute() {
	console.log('Payloader.execute()')
	concatDependencies()
	loadDependencies()
}
function concatDependencies() {
	assets.payload.text = assets.payload.text.filter(function(item) {
		var isDebugAsset = item.indexOf('.min.') == -1
		if ((debug && isDebugAsset) || (!debug && !isDebugAsset)) return true
		else return false
	})
	assets.payload.text = assets.payload.text.map(function(item) {
		return adParams.adPath + item
	})
	// TODO:
	// work out the live/debug loading scenarios
	adParams.dependencies = []
		.concat(externalIncludes)
		.concat(includes.call())
		.concat(assets.payload.text)
}

var fbaContent
function loadDependencies() {
	console.log('Payloader.loadDependencies()')
	var loadAsync = new Async()
	loadAsync.onComplete(prepareCore)
	loadAsync.wait()
	var jsLoader = new Loader(adParams.dependencies, {
		name: 'jsLoader',
		onComplete: loadAsync.done,
		onFail: failAd,
		scope: global
	})
	if (assets.payload.binary.length) {
		loadAsync.wait()
		var fbaLoader = new Loader(adParams.adPath + assets.payload.binary[0], {
			name: 'fbaLoader',
			scope: global,
			fileType: 'fba',
			onFail: failAd,
			onComplete: function(event) {
				new Loader(event, {
					name: 'fbaContentLoader',
					scope: global,
					onFail: failAd,
					onComplete: function(event) {
						fbaContent = event
						loadAsync.done()
					}
				}).load()
			}
		})
		fbaLoader.load()
	}
	jsLoader.load()
}

// move these calls to ad-control
function prepareCore() {
	Control.prepareCore(fbaContent)
}
