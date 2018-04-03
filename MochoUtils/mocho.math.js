var Mocho =
(function(mod){
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
	return mod;
})(Mocho||{});