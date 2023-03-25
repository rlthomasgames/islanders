/**
/   android
/   www.js
/   Rhys
/   11/07/2016
/
*/
// I like this pattern..


// class
function Directional8SpriteController() {
}


// class methods
Directional8SpriteController.prototype.updateObject = function(object, cameraTheta) {
  var material = object.getSprite().material;
  var localDir = object.getLocalDir();
  var direction = object.getLocalDir();
  var offset = new THREE.Vector2();
  offset.x = -0.05;

  var finalCameraRotation = cameraTheta;
  	if(finalCameraRotation > 360)
  	{
  		finalCameraRotation -= 360;
  	}
  	if(finalCameraRotation < 0)
  	{
  		finalCameraRotation += 360;
  	}

  	var cameraDirection = parseInt((finalCameraRotation-22.5)/45);

  	var globalDirection = direction + cameraDirection;

  	while(globalDirection > 7)
  	{
  		globalDirection = globalDirection-8;
  	}
  	while(globalDirection < 0)
  	{
  		globalDirection = globalDirection+7;
  	}

  	switch(globalDirection)
    	{
    		case 7:
    			offset.y = 0;
    			break;
    		case 6:
    			offset.y = 0.125;
    			break;
    		case 5:
    			offset.y = 0.25;
    			break;
    		case 4:
    			offset.y = 0.375;
    			break;
    		case 3:
    			offset.y = 0.5;
    			break;
    		case 2:
    			offset.y = 0.625;
    			break;
    		case 1:
    			offset.y = 0.75;
    			break;
    		case 0:
    			offset.y = 0.875;
    			break;
    		default:
    			console.debug('unkown case', globalDirection);
    			break;
    	}
    material.map.offset = offset;
    material.map.repeat.y = 0.125;
    material.map.repeat.x = 1.15;
    object.material = material;
}
/*
// same as above, function as a method
Directional8SpriteController.prototype.setFunction = function(value) {
  this._variable = value;
}

// the get age method can be a "static"
// method on the constructor function if you pass the
// person object
Directional8SpriteController.staticConstructorFunction = function() {
  //perform a task
}
*/