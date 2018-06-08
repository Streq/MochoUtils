"use strict";
var Mocho=Mocho||{};
Mocho.Collision = (function(mod){
	function boxPoint(x,y,w,h,px,py){
		return (
			px > x &&
			py > y &&
			px < x + w &&
			py < y + h
		);
	}
	
	function segmentSegment(x0,w0,x1,w1){
		return (
			!(x0 + w0 < x1) &&
			!(x1 + w1 < x0)
		);
	}
	
	function boxBox(x0, y0, w0, h0, x1, y1, w1, h1){
		return (
			(x0 + w0 > x1) && 
			(x1 + w1 > x0) && 
			(y0 + h0 > y1) && 
			(y1 + h1 > y0)
		);
	}
	
	function boxContainsBox(x0, y0, w0, h0, x1, y1, w1, h1){
		return (
			(x0 + w0 < x1) && 
			(x1 + w1 > x0) && 
			(y0 + h0 < y1) && 
			(y1 + h1 > y0)
		)
	}
	
	function boxLine(x, y, w, h, a, b, c, d){
		if (boxPoint(x, y, w, h, a, b) || boxPoint(x, y, w, h, c, d))
		{
			return true;
		}
		return (
			lineLine(a, b, c, d, x, y, x + w, y) ||//top
			lineLine(a, b, c, d, x + w, y, x + w, y + h) ||//right
			lineLine(a, b, c, d, x, y + h, x + w, y + h) ||//bot
			lineLine(a, b, c, d, x, y, x, y + h)//left
		);
	}
	function boxLineLambda(x, y, w, h, a, b, c, d){
		return (
			Math.min(
				lineLineLambda(a, b, c, d, x, y, x + w, y) || 1,//top
				lineLineLambda(a, b, c, d, x + w, y, x + w, y + h) || 1,//right
				lineLineLambda(a, b, c, d, x, y + h, x + w, y + h) || 1,//bot
				lineLineLambda(a, b, c, d, x, y, x, y + h) || 1
			)//left
		);
	}
	
	function lineLine(a,b,c,d,p,q,r,s){
		var det, gamma, lambda;
		det = (c - a) * (s - q) - (r - p) * (d - b);
		if (det === 0) {
			return false;
		} else {
			lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
			gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
			return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
		}
	}
	
	function lineLineLambda(a,b,c,d,p,q,r,s){
		var det, gamma, lambda;
		det = (c - a) * (s - q) - (r - p) * (d - b);
		if (det === 0) {
			return null;
		} else {
			lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
			gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
			return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)?
				lambda
				: null;
		}
	}
	
	//checks for a collision assuming aabb0 has moved (dx,dy) relative to aabb1
	function boxBoxMovingSteps(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy){
		//get boundaries
		var boundx = Math.min(x0, x0 - dx);
		var boundy = Math.min(y0, y0 - dy);
		var boundw = w0 + Math.abs(dx);
		var boundh = h0 + Math.abs(dy);
		//if boundaries collide with box then keep checking
		if(mod.boxBox(boundx, boundy, boundw, boundh, x1, y1, w1, h1)){
			//if they just collide that's it
			if(mod.boxBox(x0, y0, w0, h0, x1, y1, w1, h1)){
				return true;
			}
			var abvelx = Math.abs(velx);
			var abvely = Math.abs(vely);
			//move by steps and check
			var steps = Math.ceil((abvelx>abvely) ? abvelx : abvely);
			var stepx = dx/steps;
			var stepy = dy/steps;
			for(i = 0; i < steps; ++i){
				if(mod.boxBox(x0-stepx*i, y0-stepy*i, w0, h0, x1, y1, w1, h1)){
					return true;
				}
			}
		}
		return false;
	}
	function boxBoxMovingBroad(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy){
		return boxBox //check the bounding box of the moving box
			( Math.min(x0, x0 - dx), Math.min(y0, y0 - dy)
			, w0 + Math.abs(dx), h0 + Math.abs(dy)
			, x1, y1
			, w1, h1
			);
	}
	function getBoundingBox(x,y,w,h,dx,dy){
		return { 
			x: x + Math.min(0,dx), 
			y: y + Math.min(0,dy),
			w: w + Math.abs(dx), 
			h: h + Math.abs(dy)
		}
	}
	function getBoundingRange(x,y,w,h,dx,dy){
		return { 
			x0: x + Math.min(0,dx), 
			y0: y + Math.min(0,dy),
			x1: x + w + Math.max(0,dx), 
			y1: y + h + Math.max(0,dy)
		}
	}
	function boxBoxMoving(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy){
		return (
			boxBoxMovingBroad.apply(null, arguments) && //if bounding box doesn't collide it don't matter
			(
				boxBox.apply(null, arguments) || //if box collides at final position then there's collision 
				boxLine(x1-x0-w0, y1-y0-h0, w0+w1, h0+h1, 0, 0, -dx, -dy)//actual calc thx to my man minkowski
			)
		);
	}
	function boxBoxIntersection(x0, y0, w0, h0, x1, y1, w1, h1){
		var x = Math.max(x0,x1);
		var y = Math.max(y0,y1)
		return !boxBox.apply(null, arguments) ? null :
			{ x : x
			, y : y
			, w : Math.min(x0 + w0, x1 + w1) - x
			, h : Math.min(y0 + h0, y1 + h1) - y
			}
	}
	function segmentDistance(x0,w0,x1,w1){
		return (
			+(x1 > x0 + w0) * (x1 - x0 - w0)
			-(x0 > x1 + w1) * (x0 - x1 - w1)
		);
	}
	function boxBoxShortestWay(x0, y0, w0, h0, x1, y1, w1, h1){
		return {
			x : segmentDistance(x0,w0,x1,w1),
			y : segmentDistance(y0,h0,y1,h1)
		};
		
	}
	function boxBoxSideOfCollision(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy){
		let x,y;
		if(!dy){
			x = dx;
		}
		else if(!dx){
			y = dy;
		}
		else{
			let shortest = boxBoxShortestWay.apply(null,arguments);
			let horizontal_collision = !shortest.y || (shortest.x && shortest.x/dx > shortest.y/dy);
			x = !!horizontal_collision * Math.sign(dx);
			y = !horizontal_collision * Math.sign(dy);			
		}
		return{x : x, y : y};
	}
	function boxBoxMovingLambda(x0, y0, w0, h0, x1, y1, w1, h1, dx, dy){
		return boxLineLambda(x1-x0-w0, y1-y0-h0, w0+w1, h0+h1, 0, 0, -dx, -dy);
	}
	
	mod.boxPoint = boxPoint;
	mod.boxBox = boxBox;
	mod.lineLine = lineLine;
	mod.lineLineLambda = lineLineLambda;
	mod.boxLine = boxLine;
	mod.boxLineLambda = boxLineLambda
	mod.boxBoxMoving = boxBoxMoving;
	mod.boxBoxMovingLambda = boxBoxMovingLambda;
	mod.boxBoxSideOfCollision = boxBoxSideOfCollision;
	mod.getBoundingBox = getBoundingBox;
	mod.getBoundingRange = getBoundingRange;
	
	return mod;
})(Mocho.Collision||{});