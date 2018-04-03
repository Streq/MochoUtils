function Sprite
	( img
	, topSrc
	, leftSrc
	, widthSrc
	, heightSrc
	, topDest
	, leftDest
	, widthDest
	, heightDest
	)
{
	this.texture=img;
	this.s = {
		x : topSrc || 0,
		y : leftSrc || 0,
		w : widthSrc || 0,
		h : heightSrc || 0
	};
	this.d = {
		x : topDest || 0,
		y : leftDest || 0,
		w : widthDest || widthSrc || 0,
		h : heightDest || heightSrc || 0
	}
}
Sprite.prototype.draw = function(ctx, x, y){
	ctx.drawImage
		( this.texture
		, this.s.x
		, this.s.y
		, this.s.w
		, this.s.h
		, this.d.x + (x||0)
		, this.d.y + (y||0)
		, this.d.w
		, this.d.h
		);
}
/*
ImgSheet
	+function getAt(index)
	+texture
	+textureSize
		+width
		+height
*/
function ImgSheet(img,sizex,sizey){
	this.texture = img;
	this.textureSize = {
		x : sizex || img.width,
		y : sizey || img.height
	};
}

/*
TileSheet -> ImgBatch
	+frameSize
		+width
		+height
*/
function TileSheet(img, sizex, sizey, frameWidth, frameHeight){
	ImgSheet.call(this,img,sizex,sizey);
	this.frameSize = {
		x : frameWidth||sizex,
		y : frameHeight||sizey
	}
	this.rowLength = Math.floor(this.textureSize.x/this.frameSize.x);
	this.length = this.rowLength*(sizey/frameHeight);
}
TileSheet.prototype = Object.create(ImgSheet.prototype);
TileSheet.prototype.constructor = TileSheet;
TileSheet.prototype.getAt=function(index){
	var x = index % this.rowLength;
	var y = Math.floor(index / this.rowLength);
	return new Sprite
		( this.texture
		, x * this.frameSize.x
		, y * this.frameSize.y
		, this.frameSize.x
		, this.frameSize.y
		, 0
		, 0
		, this.frameSize.x
		, this.frameSize.y
		);
}
/*		
SpriteSheet -> ImgBatch
	+frameData [frames]
		+offset
			+x
			+y
		+frameSize
			+width
			+height
		+center
			+x
			+y
		
*/
function SpriteSheet(img, sizex, sizey, spriteArray){
	ImgSheet.call(this,img,sizex,sizey);
	this.sprites=spriteArray;
}
SpriteSheet.prototype.getAt = function(index){
	return this.sprites[index];
}


/*
AnimationFrameSet
	+function getAt(index)
	+imgSheet
	+startIndex
	+frames
	+type
*/
function offsetOnce(size,index){
	//clamp
	return Mocho.clamp(0,size-1,index);
}

function offsetRepeat(size,index){
	//wrap
	return Mocho.modulo(size,index);
}

function offsetBoomerang(size,index){
	//oscillate
	var size2 = size*2 - 2;
	var index2 = Mocho.modulo(size2,index);
	return (index2 > size-1)
		? size2 - index2
		: index2;
}
function AnimationFrameSet(spriteSheet, startIndex, frames, type){
	this.sheet = spriteSheet;
	this.startIndex = startIndex;
	this.frames = frames;
	switch(type){
		case "once":
			this.indexer = offsetOnce;
			break;
		case "repeat":
			this.indexer = offsetRepeat;
			break;
		case "boomerang":
			this.indexer = offsetBoomerang;
			break;
		default:
			this.indexer = offsetOnce;
	}
}
AnimationFrameSet.prototype.getAt = function(index){
	return this.sheet.getAt(this.indexer(this.sheet.length,this.startIndex+index%this.frames));
}
/*
Animation
	+function update(dt)
	+function getCurrentFrame()
	+frameSet
	+index
	+frameTime
*/
function Animation(frameSet, frameTime){
	this.index = 0;
	this.frameTime = frameTime;
	this.frameSet = frameSet;
	this.timeSinceLastUpdate = 0;
}
Animation.prototype.update=function(dt){
	this.timeSinceLastUpdate += dt;
	if(this.timeSinceLastUpdate > this.frameTime){
		var frames = Math.floor(this.timeSinceLastUpdate / this.frameTime);
		this.index += frames;
		this.timeSinceLastUpdate -= this.frameTime*frames;
	}
}
Animation.prototype.getCurrentFrame = function(){
	return this.frameSet.getAt(this.index);
	
}

/*
function TileSet(img, width, height, tilewidth, tileheight){
	//texture
	this.img = img;
	
	//In pixels
	this.width = width;
	this.height = height;

	//In pixels
	this.tilewidth = tilewidth;
	this.tileheight = tileheight;
}


function SpriteGallery(){
	this.data = {
		tileMap : null,
		
		//0 means all frames considered
		startFrame : 0,
		frames : 0,
		type : "once",
	};
}
(function(mod){
	mod.TYPE_ONCE = "once";
	mod.TYPE_REPEAT = "repeat";
	mod.TYPE_BOOMERANG = "boomerang";
	
	function modulo(size,index){
		return (size + (index % size)) % size;
	}
	
	function clamp(min,max,val){
		return Math.min(max, Math.max(min, val));
	}
	
	
	mod.offsetOnce = function(size,index){
		//clamp
		return clamp(0,size-1,index);
	};
	mod.offsetRepeat = function(size,index){
		//wrap
		return modulo(size,index);
	};
	mod.offsetBoomerang = function(size,index){
		//oscillate
		var size2 = size*2 - 2;
		var index2 = modulo(size2,index);
		return (index2 > size-1)
			? size2 - index2
			: index2;
		
	};
	var p = mod.prototype;
	
	p.state = {
		currentFrame : 0,	
	};
	
	p.offset = function(amount){
		var size = this.data.frames;
		var index = this.state.currentFrame+amount;
		switch(this.type){
			case "once":
				this.data.frames = SpriteGallery.offsetOnce(size,index);
				break;
			case "repeat":
				this.data.frames = SpriteGallery.offsetRepeat(size,index);
				break;
			case "boomerang":
				this.data.frames = SpriteGallery.offsetBoomerang(size,index);
				break;
		}
	};
	
	
	return mod;
}(SpriteGallery||{}));

function SpriteAnimation(spriteGallery,timePerFrame){
	this.gallery = spriteGallery||{};
	this.timePerFrame = 0;
	this.timeSinceLastFrame = 0;
	this.update=function(dt){
		timeSinceLastFrame+=dt;
		
		
	};
}
*/