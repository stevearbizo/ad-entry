import { Async } from 'ad-control'
window.Async = Async // temp hack to get Async module back into the global scope
import 'ad-polyfills'

import * as scope from './lib/scope.js'
import * as preloader from './lib/preloader.js'
import * as payloader from './lib/payloader.js'


// NOTE: This class expects window-scoped methods to exist:


// make ad clickable ASAP
window.makeAuxClickable()

// prepare async + callback
async = new Async()
async.onComplete(() => {
	onImpression()
	payloader.execute()
})

// prepare index
window.prepareIndex(scope, preloader, payloader)

// prepare network
window.prepareNetworkExit()



