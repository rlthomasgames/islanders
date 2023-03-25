/**
/   android
/   www.js.objects.game
/   Rhys
/   25/09/2016
/
*/
// I like this pattern..


// class
function PlantObject(textureName, plantType) {
  this._textureName = textureName;
  this._plantType = plantType;
  this.init();
}

PlantObject.prototype.init = function()
{
	if(this._sprite3D && this._sprite3D.parent)
	{
		this._sprite3D.parent.remove(this._sprite3D);
		this._sprite3D = null;
	}
	var spriteDiff = ThreeAssetsFactory.getInstance().getTexture(this._textureName).clone();
	spriteDiff.needsUpdate = true;
	spriteDiff.magFilter = THREE.NearestFilter;
    spriteDiff.minFilter = THREE.LinearFilter;
	var spriteMaterial = new THREE.SpriteMaterial({map:spriteDiff, transparent:true});

	var offset = new THREE.Vector2();
	switch(this._plantType)
        	{
        		case 0:
        			offset.y = 0;
        			break;
        		case 1:
        			offset.y = 0.166;
        			break;
        		case 2:
        			offset.y = 0.33;
        			break;
        		case 3:
        			offset.y = 0.499;
        			break;
        		case 4:
        			offset.y = 0.66;
        			break;
        		case 5:
        			offset.y = 0.826;
        			break;
        	}
    spriteMaterial.map.offset = offset;
    spriteMaterial.map.repeat.y = 0.166;

	this._sprite3D = new THREE.Sprite(spriteMaterial);
	return this._sprite3D;
};

PlantObject.prototype.setTextureName = function(name)
{
	this._textureName = name;
	this._sprite3D = this.init();
}

/*
// class methods
PlantObject.prototype.getFunction = function() {
  return this._variable;
}

// same as above, function as a method
PlantObject.prototype.setFunction = function(value) {
  this._variable = value;
}

// the get age method can be a "static"
// method on the constructor function if you pass the
// person object
PlantObject.staticConstructorFunction = function() {
  //perform a task
}
*/