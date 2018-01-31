import 'ad-polyfills'
import * as scope from './lib/scope.js'
import * as preloader from './lib/preloader.js'
import * as payloader from './lib/payloader.js'

// NOTE: This class expects window-scoped methods to exist:
// prepare index
window.prepareIndex(scope, preloader, payloader)

// prepare network
window.prepareNetworkExit()

// make ad clickable ASAP
window.makeAuxClickable()

// payloader
payloader
	.execute()
	.then(() => {
		window.onImpression()
	})
	.catch(err => {
		window.failAd()
	})
