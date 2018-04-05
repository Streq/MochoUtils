var Mocho = (function(mod){
	function getCurrentScriptElement(){
		var script = document.getElementsByTagName("script");
		script = script[script.length - 1];
		return script;
	}
	
	function insertBefore(el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode);
	}
	function insertAfter(el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
	}
	mod.getCurrentScriptElement = getCurrentScriptElement;
	mod.insertBefore = insertBefore;
	mod.insertAfter = insertAfter;
	return mod;
})(Mocho||{});