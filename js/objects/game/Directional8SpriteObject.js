/**
/   android
/   www.js
/   Rhys
/   07/07/2016
/
*/
// I like this pattern..


// class
function Directional8SpriteObject(textureName) {
  this._sprite3D = null;
  this._localDirectionDeg = null;
  this._globalDirectionDeg = null;
  this._cameraAngleDeg = null;
  this._currentAngleFrameOffset = null;
  this._currentAnimationFrameOffset = null;
  this._finalFrame = null;

  this._textureName = textureName;
}

Object.defineProperty(Directional8SpriteObject.prototype, "position", {
    get: function position() {
    	return this._sprite3D.position;
    },

    set: function position(vector3) {
    	this._sprite3D.position = vector3;
    }
});

Object.defineProperty(Directional8SpriteObject.prototype, "scale", {
    get: function scale() {
    	return this._sprite3D.scale;
    },

    set: function scale(vector3) {
    	this._sprite3D.scale = vector3;
    }
});


Directional8SpriteObject.prototype.getSprite = function()
{
	return this._sprite3D;
};

Directional8SpriteObject.prototype.getLocalDir = function()
{
	return this._localDirectionDeg;
};

Directional8SpriteObject.prototype.setLocalDir = function(value)
{
	this._localDirectionDeg = value;
};

Directional8SpriteObject.prototype.init = function(clone)
{
	var spriteDiff = null;
	if(clone)
	{
		spriteDiff = ThreeAssetsFactory.getInstance().getTexture(this._textureName).clone();
	}
	else
	{
		spriteDiff = ThreeAssetsFactory.getInstance().getTexture(this._textureName);
	}
	spriteDiff.minFilter = THREE.LinearFilter
	spriteDiff.needsUpdate = true;
	spriteDiff.magFilter = THREE.NearestFilter;
    //spriteDiff.minFilter = THREE.LinearMipMapLinearFilter;
	var spriteMaterial = new THREE.SpriteMaterial({map:spriteDiff, transparent:true});
	this._sprite3D = new THREE.Sprite(spriteMaterial);
	return this._sprite3D;
};