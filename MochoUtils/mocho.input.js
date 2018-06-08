"use strict";
var Mocho = (function(mod){
	
	/**
	 * EventListenerQueue Factory
	 * @function
	 * @param {Element} [element] - the element events will be relative to,
	 * @param {String[]} [types] - event types that will be listened to.
	 * @param {function(Event)} [filter] - filter function that filters and/or transforms events,
	 *        it must return null or undefined if the event is filtered out, the transformed value otherwise.
	 */
	function makeEventListenerQueue(element, types, filter){
		var queue = new Mocho.DBufferQueue();
		
        if(types != null){
            types.forEach(function(type){
                addListener(queue, element, type, filter);
            });
		}
		return queue;
	}
    
    /**
	 * Add listener to queue
	 * @function
     * @param {Mocho.DBufferQueue} queue - the event queue
	 * @param {Element} element - the element events will be relative to,
	 * @param {String} types - event type that will be listened to.
	 * @param {function(Event)} [filter] - filter function that filters and/or transforms events,
	 *        it must return null or undefined if the event is filtered out, the transformed value otherwise.
	 */
    function addListener(queue, element, type, filter){
        element.addEventListener(type,function(ev){
            let transformed = filter? filter(ev) : ev;
            if(transformed!=null){
                queue.enqueue(transformed);
            }
        });
    }
    
    var preventDefaultArrowKeys = (event) => {
        switch(event.keyCode){
            case 37:
            case 38:
            case 39:
            case 40:
                event.view.event.preventDefault();
        }  
    };
    
    function avoidArrowKeyScroll(element){
        element.addEventListener("keydown", preventDefaultArrowKeys)
    }
    
    function allowArrowKeyScroll(element){
        element.removeEventListener("keydown", preventDefaultArrowKeys);
    }
    
	mod.makeEventQueue = makeEventListenerQueue;
    mod.addListener = addListener;
    mod.avoidArrowKeyScroll = avoidArrowKeyScroll;
    mod.allowArrowKeyScroll = allowArrowKeyScroll;
	return mod;
	
})(Mocho||{});