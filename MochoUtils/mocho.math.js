"use strict";
var mod = module.exports;
mod.approach = function (val, target, amount){
	if(val==target) return;
	if(val<target) return Math.min(val+amount,target);
	return Math.max(val-amount,target);
};

mod.toRadians = function(degrees){ 
	return degrees * Math.PI / 180;
};

mod.toDegrees = function(radians){ 
	return radians * 180 / Math.PI;
};


mod.modulo = function modulo(size,index){
	return (size + (index % size)) % size;
}

mod.clamp = function clamp(min,max,val){
	return Math.min(max, Math.max(min, val));
}

mod.offsetNoRepeat = function offsetNoRepeat(size,index){
	//clamp
	return mod.clamp(0,size-1,index);
}

mod.offsetRepeat = function offsetRepeat(size,index){
	//wrap
	return mod.modulo(size,index);
}

mod.offsetBoomerang = function offsetBoomerang(size,index){
	//oscillate
	var size2 = size*2 - 2;
	var index2 = mod.modulo(size2,index);
	return (index2 > size-1)
		? size2 - index2
		: index2;
}
