"use strict";
(function(){
	//get parameters
	var currentScript = document.currentScript;
	var scriptPath = 
		(function(){
			var rootPath = currentScript.getAttribute("src");
			return rootPath.substring(0,rootPath.lastIndexOf('/')+1);
		})();
	var rootPath = currentScript.getAttribute('root-path') || scriptPath;
	var runSrc = currentScript.getAttribute("run-src");
	var height = currentScript.getAttribute("height");
	var width = currentScript.getAttribute("width");
	
	var html = `
	<head></head>
	<body>
		<script>
			var Program = (function(mod){
				//get parameters
				mod.baseDir =  "` + rootPath + `";
				return mod;
			})(Program||{});

			(function (){
				var script = document.createElement("script");
				script.src = "` + runSrc + `";
				document.head.appendChild(script);
			})();
		</script>
	</body>
	`
	var iframe = document.createElement("iframe");
	iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
	iframe.style.border="none";
	iframe.style.width=width;
	iframe.style.height=height;
	
	currentScript.parentElement.insertBefore(iframe,currentScript);
	
})();

	
