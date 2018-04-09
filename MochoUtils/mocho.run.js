var Program = (function(mod){
	//get parameters
	var currentScript = document.currentScript;
	var scriptPath = 
		(function(){
			var rootPath = currentScript.getAttribute("src");
			return rootPath.substring(0,rootPath.lastIndexOf('/')+1);
		})();
	var rootPath = currentScript.getAttribute('root-path') || scriptPath;
	var runSrc = currentScript.getAttribute("run-src");
	var containerElement = document.createElement("div");
	currentScript.parentElement.insertBefore(containerElement,currentScript);
	
	mod.baseDir = rootPath;
	mod.containerElement = containerElement;
	mod.scriptElement = currentScript;
	mod.src = runSrc;
	return mod;
})(Program||{});

(function (){
	var script = document.createElement("script");
	script.src = Program.src;
	document.head.appendChild(script);
})();