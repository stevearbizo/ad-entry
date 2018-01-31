/* -- PRELOADER ----------------------------------------------
 *
 *
 */
export function prepare() {
	console.log('Preloader.prepare()')
	preparePreloader().then(() => {
		window.preparePreloadMisc()
	})
}

var _assets
var _preloader
var _borderW

function preparePreloader() {
	return new Promise((resolve, reject) => {
		_assets = window.assets.preloader
		_borderW = _assets.borderWidth || 0
		prepareContainer()

		// begin loading the images
		let promises = []
		window.assets.preloader.images.forEach(pdata => {
			promises.push(loaderPreloaderImage(pdata))
		})

		// images are loaded
		Promise.all(promises).then(() => {
			console.log('Preloader.onLoadComplete()')
			applyContainerStyle()
			if (window.assets.preloader.startDelay > 0) {
				setTimeout(() => {
					resolve()
				}, window.assets.preloader.startDelay)
			} else {
				resolve()
			}
		})
	})
}

function prepareContainer() {
	_preloader = document.getElementById('preloader')
	_preloader.style.display = 'none'
}

function applyContainerStyle() {
	const styleCss = 'width: ' + adParams.preloaderWidth + 'px; height: ' + adParams.preloaderHeight + 'px; '
	if (adParams.responsive) {
		styleCss = 'width: 100%; height: 100%; '
	}
	_preloader.style.cssText =
		'display: block; overflow: hidden; position: absolute; ' +
		'top:' +
		adParams.preloaderY +
		'px; left:' +
		adParams.preloaderX +
		'px; ' +
		_styleCss +
		'border-color: ' +
		(_assets.borderColor || _assets.backgroundColor) +
		'; border-width: ' +
		_borderW +
		'px; background-color: ' +
		_assets.backgroundColor +
		'; '
}

function loaderPreloaderImage(pdata) {
	return new Promise((resolve, reject) => {
		var img = new Image()
		_preloader.appendChild(img)

		img.onload = function(event) {
			applyImageStyle(img, pdata)
			resolve()
		}
		// ** note: InlineSrc is introduced by the webpack "inline" entry bundle
		img.src = window.InlineSrc.get(adParams.imagesPath + pdata.source)
	})
}

function applyImageStyle(img, pdata) {
	if (!pdata.offset) {
		pdata.offset = {x: 0, y: 0}
	}
	img.width *= pdata.scale || 1
	img.height *= pdata.scale || 1
	const left = Math.round((adParams.preloaderWidth - img.width) / 2 + (pdata.offset.x || 0) - _borderW)
	const top = Math.round((adParams.preloaderHeight - img.height) / 2 + (pdata.offset.y || 0) - _borderW)
	img.style.cssText = 'position: absolute; left: ' + left + 'px; top: ' + top + 'px;'
}
