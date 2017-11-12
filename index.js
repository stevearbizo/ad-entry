import { Async } from 'ad-control'
window.Async = Async // temp hack to get Async module back into the global scope
import * as scope from './lib/scope'
import * as preloader from './lib/preloader.js'
import * as payloader from './lib/payloader.js'
import './lib/polyfills.js'

// NOTE: This class expects window-scoped methods to exist:
//	- makeAuxClickable()
//	- prepareIndex()
//	- prepareNetworkExit()

// make ad clickable ASAP
makeAuxClickable()

// prepare async + callback
async = new Async()
async.onComplete(() => {
	onImpression()
	payloader.execute()
})

// prepare index
prepareIndex(scope, preloader, payloader)

// prepare network
prepareNetworkExit()



