import Loader from 'ad-load'
window.Loader = Loader // temp hack to get Loader module back into the global scope

/* -- PAYLOADER ----------------------------------------------
 *
 *
 */
export function execute() {
	console.log('Payloader.execute()')
	concatDependencies()
	return loadDependencies()
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
	return new Promise((resolve, reject) => {
		Promise.all([loadJs(), loadFba()])
			.then(() => {
				resolve(fbaContent)
			})
			.catch(err => {
				reject(err)
			})
	})
}

function loadJs() {
	return new Promise((resolve, reject) => {
		var jsLoader = new Loader(adParams.dependencies, {
			name: 'jsLoader',
			scope: global,
			onFail: reject,
			onComplete: resolve
		}).load()
	})
}

function loadFba() {
	return new Promise((resolve, reject) => {
		if (assets.payload.binary.length) {
			var fbaLoader = new Loader(adParams.adPath + assets.payload.binary[0], {
				name: 'fbaLoader',
				scope: global,
				fileType: 'fba',
				onFail: reject,
				onComplete: function(event) {
					new Loader(event, {
						name: 'fbaContentLoader',
						scope: global,
						onFail: reject,
						onComplete: function(event) {
							fbaContent = event
							resolve()
						}
					}).load()
				}
			}).load()
		} else {
			resolve()
		}
	})
}
