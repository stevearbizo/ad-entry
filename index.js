import 'ad-polyfills'
import * as scope from './lib/scope.js'
import * as preloader from './lib/preloader.js'
import * as payloader from './lib/payloader.js'

// NOTE: This class expects window-scoped methods to exist:
window
	// prepare vendor onload (Network.js)
	.prepareIndex()

	// prepare scope
	.then(() => {
		return scope.prepare().then(() => {
			// misc
			window.prepareAdParamsMisc()

			// prepare network
			window.prepareNetworkExit()

			// DEPRECATED 4/19/18 - this now happens on window.preparePreloadMisc()
			// but must keep for older ads so the failover is clickable!
			if (!window.isVersionOrNewer || !window.isVersionOrNewer('0.1.2')) {
				window.makeAuxClickable()
			}
		})
	})

	// prepare preload
	.then(() => {
		return preloader.prepare().then(() => {
			window.preparePreloadMisc()
		})
	})

	// prepare payload
	.then(() => {
		return payloader.execute().then(fbaContent => {
			window.onImpression(fbaContent)
		})
	})

	.catch(err => {
		console.error(err)
		window.failAd()
	})
