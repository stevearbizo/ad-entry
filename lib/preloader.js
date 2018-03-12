/* -- PRELOADER ----------------------------------------------
 *
 *
 */
export function prepare() {
	console.log('Preloader.prepare()')
	prepareContainer()
	return load()
}

function load() {
	return new Promise((resolve, reject) => {
		// begin loading the images
		let promises = []
		_assets.images.forEach(pdata => {
			promises.push(loaderPreloaderImage(pdata))
		})
		// images are loaded
		Promise.all(promises).then(() => {
			console.log('Preloader.onLoadComplete()')
			applyContainerStyle()
			if (_assets.startDelay > 0) {
				setTimeout(() => {
					resolve()
				}, _assets.startDelay)
			} else {
				resolve()
			}
		})
	})
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
		img.src = window.InlineSrc.get('images/' + pdata.source)
	})
}

var _assets
var _preloader
var _borderW

function prepareContainer() {
	_assets = window.assets.preloader
	_borderW = _assets.borderWidth || 0
	_preloader = document.getElementById('preloader')
	_preloader.style.display = 'none'
}

function applyContainerStyle() {
	let styleCss = 'width: ' + adParams.preloaderWidth + 'px; height: ' + adParams.preloaderHeight + 'px; '
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
		styleCss +
		'border-color: ' +
		(_assets.borderColor || _assets.backgroundColor) +
		'; border-width: ' +
		_borderW +
		'px; background-color: ' +
		_assets.backgroundColor +
		'; '
}

function applyImageStyle(img, pdata) {
	if (!pdata.offset) {
		pdata.offset = { x: 0, y: 0 }
	}
	img.width *= pdata.scale || 1
	img.height *= pdata.scale || 1
	const left = Math.round((adParams.preloaderWidth - img.width) / 2 + (pdata.offset.x || 0) - _borderW)
	const top = Math.round((adParams.preloaderHeight - img.height) / 2 + (pdata.offset.y || 0) - _borderW)
	img.style.cssText = 'position: absolute; left: ' + left + 'px; top: ' + top + 'px;'
}
