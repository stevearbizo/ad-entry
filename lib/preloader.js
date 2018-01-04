import Async from 'ad-control/lib/Async'

/* -- PRELOADER ----------------------------------------------
 *
 *
 */ 
export function prepare() {
	console.log('Preloader.prepare()')
	preparePreloader()
	preparePreloadMisc()
}


function preparePreloader() {
	var _assets = assets.preloader;
	var _preloader = document.getElementById('preloader');
	var _borderW = _assets.borderWidth || 0;
	var _styleCss;
	var _index = 0;

	var _onPreloadersComplete = function() {
		console.log('Preloader._onPreloadersComplete()');
		// if there is a preloader delay then we do not remove this preloader images token
		// from global.async until that delay completes
		// otherwise we just fire async.done() because why wait?
		if (assets.preloader.startDelay > 0) 
			setTimeout(async.done.bind(async), assets.preloader.startDelay);
		else async.done();
	}

	// load a preloader image; gets recursively called if there is a following image to add
	var _getPreloaderImg = function() {
		// add one more async token per image loaded
		_imgAsync.wait();

		var _obj = _assets.images[ _index ];
		var _img = new Image();

		if (!_obj.offset) _obj.offset = { x:0, y:0 }
		
		_img.onload = function(event) {
			_img.width *= _obj.scale || 1;
			_img.height *= _obj.scale || 1;
			var _left = Math.round(((adParams.preloaderWidth - _img.width) / 2) + (_obj.offset.x || 0) - _borderW);
			var _top = Math.round(((adParams.preloaderHeight - _img.height) / 2) + (_obj.offset.y || 0) - _borderW);
			_styleCss = 'position: absolute; left: ' + _left + 'px; top: ' + _top + 'px;';
			_img.style.cssText = _styleCss;

			_preloader.appendChild(_img);

			if (++_index < _assets.images.length) {
				// go get the next iamge
				_getPreloaderImg();
			} else {
				// this means we've loaded every single preloader image. now we will apply background colors and border properties
				if (adParams.responsive) _styleCss = 'width: 100%; height: 100%; ';
				else _styleCss = 'width: ' + adParams.preloaderWidth + 'px; height: ' + adParams.preloaderHeight + 'px; ';

				_preloader.style.cssText = 'overflow: hidden; position: absolute; ' + 'top:' + adParams.preloaderY + 'px; left:' + adParams.preloaderX + 'px; ' + _styleCss + 'border-color: ' + (_assets.borderColor || _assets.backgroundColor) + '; border-width: ' + _borderW + 'px; background-color: ' + _assets.backgroundColor + '; ';
			}

			// remove the token for this preloader image
			_imgAsync.done();
		}

		// ** note: InlineSrc is introduced by the webpack "inline" entry bundle
		_img.src = window.InlineSrc.get(adParams.imagesPath + _obj.source);
	}

	// create an async specific for this process
	var _imgAsync = new Async();
	_imgAsync.onComplete(_onPreloadersComplete);

	// make the master async wait for a token for all preloader images
	async.wait();

	// begin loading the images
	_getPreloaderImg();
}

