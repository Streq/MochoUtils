"use strict";
var mod = module.exports;
function getLastScript(){
	var script = document.getElementsByTagName("script");
	script = script[script.length - 1];
	return script;
}

function getCurrentScript(){
	return document.currentScript||getLastScript();
}

function getScriptPath(script){
	var path = script.getAttribute("src");
	return path.substring(0,path.lastIndexOf('/')+1);
}

function insertBefore(el, referenceNode) {
	referenceNode.parentNode.insertBefore(el, referenceNode);
}
function insertAfter(el, referenceNode) {
	referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}
mod.getCurrentScript = getCurrentScript;
mod.insertBefore = insertBefore;
mod.insertAfter = insertAfter;
mod.getScriptPath = getScriptPath;