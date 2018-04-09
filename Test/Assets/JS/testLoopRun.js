(function(){
	var containerElement=Program.containerElement;
	
	function runThisThang(){
		var canvas = document.createElement("canvas");
		var st = canvas.style;
		st.backgroundColor="white"; 
		st.borderColor="black"; 
		st.borderWidth="1px"; 
		st.borderStyle="solid";
		
		canvas.width='200';
		canvas.height='200';
		containerElement.appendChild(canvas);
		
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#00FF00";
		ctx.globalAlpha = 1;
		var x=0, y=0;
		var signox=1;
		var signoy=1;
		var width = 25;
		var height = 25;
		new Mocho.Loop(
			function(onload){
				onload();
			},
			function(dt){
				var secs = (dt/1000);
				var nextX=x+secs*200*signox;
				var nextY=y+secs*150*signoy;
				if(nextX+width > canvas.width || nextX < 0) {
					signox=-signox;
				}
				if(nextY+height > canvas.height || nextY < 0){
					signoy=-signoy;
				}
				x=Math.min(Math.max(0,nextX),canvas.width-width);
				y=Math.min(Math.max(0,nextY),canvas.height-height);


			},
			function(){
				ctx.clearRect(0,0,canvas.width,canvas.height);
				ctx.fillRect(x,y,width,height);
			},
			60,
			false
		).run();
	}
	
	
	var script = document.createElement("script");
	script.onload=function(){
		var srcs = ["MochoUtils/mocho.loop.js","MochoUtils/mocho.dom.js"]
			.map(
				function(e){
					return Program.baseDir+e;
				}
			);
		Mocho.loadScripts(srcs,runThisThang);
	};
	script.src=Program.baseDir+"MochoUtils/mocho.load.js";
	document.head.appendChild(script);
})()