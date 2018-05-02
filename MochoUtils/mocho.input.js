var Mocho = (function(mod){
	
	/**
	 * EventListenerQueue Factory
	 * @function
	 * @param {Element} element - the element events will be relative to,
	 * @param {String[]} types - event types that will be listened to.
	 * @param {function(Event)} [filter] - filter function that filters and/or transforms events,
	 *        it must return null or undefined if the event is filtered out, the transformed value otherwise.
	 */
	function makeEventListenerQueue(element, types, filter){
		var queue = new Mocho.DBufferQueue();
		
		types.forEach(function(type){
			element.addEventListener(type,function(ev){
				let transformed = filter? filter(ev) : ev;
				if(transformed!=null){
					queue.enqueue(transformed);
				}
			});
		});
		
		return queue;
	}
	mod.makeEventQueue = makeEventListenerQueue;
	return mod;
	
})(Mocho||{});