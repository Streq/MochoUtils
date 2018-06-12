"use strict";
var mod = module.exports
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
mod.Sprite = Sprite;
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

mod.ImgSheet = ImgSheet;
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
mod.TileSheet = TileSheet;
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
mod.SpriteSheet = SpriteSheet;
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
function AnimationFrameSet(spriteSheet, startIndex, frames, type){
	this.sheet = spriteSheet;
	this.startIndex = startIndex;
	this.frames = frames;
	switch(type){
		case "once":
			this.indexer = Mocho.offsetNoRepeat;
			break;
		case "repeat":
			this.indexer = Mocho.offsetRepeat;
			break;
		case "boomerang":
			this.indexer = Mocho.offsetBoomerang;
			break;
		default:
			this.indexer = Mocho.offsetOnce;
	}
}
mod.AnimationFrameSet = AnimationFrameSet;
AnimationFrameSet.prototype.getAt = function(index){
	return this.sheet.getAt(
		this.startIndex
		+this.indexer(this.frames,this.startIndex + index)
	);
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
mod.Animation = Animation;
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
