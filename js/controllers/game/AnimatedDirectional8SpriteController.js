/**
/   android
/   www.js
/   Rhys
/   30/07/2016
/
*/
// I like this pattern..


// class
function AnimatedDirectional8SpriteController() {
}

AnimatedDirectional8SpriteController.prototype.updateObject = function(object, cameraTheta)
{
	var material = object.getSprite().material;
    var localDir = object.getLocalDir();
    var direction = object.getLocalDir();
    var offset = new THREE.Vector2();
    var frame = object.currentFrame;
    var anim = object.currentAnimObject;
    var totalFrames = object._totalFrames;


    anim.counter+=0.5;

    if(object.currentAnimObject.currentFrame > object.currentAnimObject.frames.length-1)
	{
		anim.currentFrame = 0;
	}

    offset.x = (1.0/totalFrames)*anim.currentFrame;
    //offset.x = 0;

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
      		globalDirection = globalDirection-7;
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
        	}
        material.map.offset = offset;
        material.map.repeat.y = 0.125;
        material.map.repeat.x = 1.0/totalFrames;
        //material.map.repeat.x = 1;
        object.material = material;

		if(anim.counter > 4)
		{
        	object.currentAnimObject.currentFrame++;
        	anim.counter = 0;
        }
}