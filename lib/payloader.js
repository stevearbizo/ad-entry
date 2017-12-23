			import Async from 'ad-control/lib/Async'
			import Loader from 'ad-load'
			window.Loader = Loader // temp hack to get Loader module back into the global scope


			/* -- PAYLOADER ----------------------------------------------
			 *
			 *
			 */ 
			export function execute() {
				trace('Payloader.execute()')
				prepareDependencies()
				prepareExternalDependencies()
				concatDependencies()
				loadDependencies()
			}

			function prepareDependencies() {
				/*-- Red.Component.body_js_dependencies.start --*/
				adParams.dependencies = [];
				// these get compiled only if there are references to them in compiled.js + build.html
				adParams.optionalDependencies = [];				
				/*-- Red.Component.body_js_dependencies.end --*/
			}
			function prepareExternalDependencies() {
				/*-- Red.Component.body_js_external_dependencies.start --*/
				adParams.externalDependencies = [
					// TweenLite dependencies, cached via - https://support.google.com/richmedia/answer/6307288
					"https://s0.2mdn.net/ads/studio/cached_libs/cssplugin_1.18.0_71489205621d46cbe88348eeb8fe493f_min.js",
					"https://s0.2mdn.net/ads/studio/cached_libs/easepack_1.18.0_ed5816e732515f56d96a67f6a2a15ccb_min.js",
					"https://s0.2mdn.net/ads/studio/cached_libs/tweenlite_1.18.0_56fa823cfbbef1c2f4d4346f0f0e6c3c_min.js",
				];
				/*-- Red.Component.body_js_external_dependencies.end --*/
			}
			function concatDependencies() {
				assets.payload.text = assets.payload.text.filter(function(item) { 
					var isDebugAsset = item.indexOf('.min.') == -1
					if ((debug && isDebugAsset) || (!debug && !isDebugAsset)) 
						return true
					else return false
				})
				assets.payload.text = assets.payload.text.map(function(item) {
					return adParams.adPath + item
				})
				adParams.dependencies = adParams.dependencies
				.concat(adParams.optionalDependencies)
				.concat(includes.call())
				.concat(assets.payload.text)
				.concat(adParams.externalDependencies)
				.concat(externalIncludes)
			}	


			var fbaContent
			function loadDependencies() {
				trace('Payloader.loadDependencies()')
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

			
