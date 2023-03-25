/**
/   android
/   www.js
/   Rhys
/   30/07/2016
/
*/
// I like this pattern..


// class
function AnimatedDirectional8SpriteObject(textureName, anims, totalFrames) {
	this._currentFrame = 0;
	this._currentAnim = '';
	this.anims = anims;
	this._totalFrames = totalFrames;

	Directional8SpriteObject.call(this, textureName, true);
}

AnimatedDirectional8SpriteObject.prototype = Directional8SpriteObject.prototype;

Object.defineProperty(AnimatedDirectional8SpriteObject.prototype, "currentFrame", {
 	get: function currentFrame(){
 		return this._currentFrame;
 	},

 	set: function currentFrame(value){
 		this._currentFrame = value;
 	}
});

Object.defineProperty(AnimatedDirectional8SpriteObject.prototype, "currentAnim", {
 	get: function currentAnim(){
 		return this._currentAnim;
 	},

 	set: function currentAnim(string){
 		this._currentAnim = string;
 	}
});

Object.defineProperty(AnimatedDirectional8SpriteObject.prototype, "currentAnimObject", {
 	get: function currentAnimObject(){
 		return this.anims[this._currentAnim];
 	},

 	set:function currentAnimObject(value){
 		this.anims[this._currentAnimObject] = value;
 	}
});