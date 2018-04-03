var Mocho = (function(mod){
	
	function loadScripts(srcs, onload){
		function loadAndSetUpNext(index,array){
			var callback;
			if(index < array.length-1){
				callback = function(){
					loadAndSetUpNext(index+1,array)
				}
			}else{
				callback = onload;
			}
			loadScript(array[index],callback);
		}
		loadAndSetUpNext(0,srcs);
	}
	function loadScript(src, onload){
		var script = document.createElement("script");
		script.onload = onload;
		script.src = src;
		document.head.appendChild(script);
	}
	
	function loadImage(src, onload){
		var img = document.createElement("img");
		img.async = false;
		img.onload = function(){onload(img);};
		img.src = src;
	}
	
	function loadJSON(src, onload){
		fetch(src).then(
			function(response) {
				return response.json();
			}
		).then(
			function(myJson){
				onload(myJson);
			}
		);
	}
	
	mod.loadScripts = loadScripts;
	mod.loadScript = loadScript;
	mod.loadImage = loadImage;
	mod.loadJSON = loadJSON;
	return mod;
	
})(Mocho||{});