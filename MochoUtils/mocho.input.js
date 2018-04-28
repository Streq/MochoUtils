var Mocho = (function(mod){
	function makeEventListenerQueue(el,events){
		var queue = new Mocho.DBufferQueue();
		
		events.forEach(function(type){
			el.addEventListener(type,function(ev){
				queue.enqueue(ev);
			});
		});
		
		return queue;
	}
	mod.makeEventQueue = makeEventListenerQueue;
	return mod;
	
})(Mocho||{});