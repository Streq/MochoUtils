var Mocho = (function(mod){
	
	function Queue(){
		this.array=[];
	}
	Queue.prototype.enqueue=function(el){
		this.array.push(el);
	}
	Queue.prototype.dequeue=function(){
		return this.array.shift();
	}
	Queue.prototype.isEmpty=function(){
		return this.array.length == 0;
	}
	Queue.prototype.length = function(){
		return this.array.length;
	}
	
	function DBufferQueue(){
		this.first = new Queue();
		this.second = new Queue();
		this.inqueue = this.first;
		this.outqueue = this.second;
	}
	DBufferQueue.prototype.enqueue=function(el){
		this.inqueue.enqueue(el);
	}
	DBufferQueue.prototype.dequeue=function(){
		return this.outqueue.dequeue();
	}
	DBufferQueue.prototype.swapBuffer = function(){
		let aux = this.inqueue;
		this.inqueue = this.outqueue;
		this.outqueue = aux;
	}
	DBufferQueue.prototype.isEmpty = function(){
		return this.outqueue.isEmpty();
	}
	mod.Queue = Queue;
	mod.DBufferQueue = DBufferQueue;
	return mod;
	
})(Mocho||{});