/** Method: CustomEvent() */
try {
	new CustomEvent('test');
} 
catch(e) {
	trace(' -> CustomEvent')
	function CustomEvent2(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}
	CustomEvent2.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent2;
}	
	
