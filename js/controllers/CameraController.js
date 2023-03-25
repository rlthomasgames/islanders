/**
/   android
/   www.js.controllers
/   Rhys
/   28/03/2016
/
*/
// I like this pattern..


// class
function CameraController(camera) {
	this.camera = camera;
	this.targetPos =  new THREE.Vector3();//set 0,0,0 as default target pos
	this.targetPos.y = 0;
	this.originalRadius = 100;
	this.zoom = 0;
	this.radius = 0;
	this.action = false;
}

CameraController.prototype.getCamera = function()
{
	//in some case such as performing raycast we need to retrieve the camera or it poistion
	return this.camera;
};

CameraController.prototype.getCameraPosition = function()
{
	//in some case such as performing raycast we need to retrieve the camera or it poistion
	return this.camera.position;
};

CameraController.prototype.getRadius = function()
{
	return this.radius;
};

CameraController.prototype.updateCamera = function(angle)
{
	if(!this.action)
	{
		//TODO general update happens every frame or when neccessary relies on a zoom radius and current viewing angle
		this.camera.position.x = (this.radius * Math.sin( THREE.Math.degToRad( -(angle) ) ));
		this.camera.position.z = (this.radius * Math.cos( THREE.Math.degToRad( -(angle) ) ));
		this.camera.position.y = ((120)+(this.radius*0.2))-(this.radius*0.5);
		this.camera.lookAt(this.targetPos);
		this.angle = angle;
		//console.debug(this.radius, angle, this.targetPos);
    }
};

CameraController.prototype.adjustZoom = function(value)
{
	if(!this.action)
	{
		this.zoom = this.zoom + value;
		//add some limitations to the zoom below
		if(this.zoom > 150)
		{
			this.zoom = 150;
		}
		else if(this.zoom < 17)
		{
			this.zoom = 17;
		}
		this.radius = this.originalRadius+this.zoom;
	}
};

CameraController.prototype.setTargetPos = function(targetPos)
{
	this.targetPos = targetPos;
};

CameraController.prototype.changeTarget = function(targetPos, angle, radius, time)
{
	if(!this.action)
	{
	//TODO perform a tween to given target with a angle and best radius - best radius normally the one facing the out most center of the island
	//generally used for a certain action that has been performed as a focus point, after that action then will return to normal viewing of the island!
	//may need to calculate first the inner center of the island always being 0,0,0 and the target position, if possible which is unlikely finding ways around obstructions!
	//obstructions might be able to be calculated by a series of raycasts to see which ones best hit the target position without hitting something else first!
	//this is all just for cinematics and pretty viewing for a player!

	var proposedPosition = new THREE.Vector3();
	proposedPosition.x = (radius * Math.sin( THREE.Math.degToRad( -(this.angle+angle) ) ))+(targetPos.x);
	proposedPosition.z = (radius * Math.cos( THREE.Math.degToRad( -(this.angle+angle) ) ))+(targetPos.z);
	proposedPosition.y = 60;

	var tween1 = new TWEEN.Tween(this.camera.position)
		.to({x:proposedPosition.x, y:proposedPosition.y, z:proposedPosition.z}, time/2)
		.yoyo(true)
		.repeat(1)
		.easing( TWEEN.Easing.Circular.Out )
		.start();
	//var tween2 = new TWEEN.Tween(this).to({radius:this.radius+radius}, time/2).yoyo(true).repeat(1).start();
	var targetPosAltered = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);
	targetPosAltered.y = 12;
	this.targetPosAltered = new THREE.Vector3();

	var tween2 = new TWEEN.Tween(this.targetPosAltered)
		.to({x:targetPosAltered.x, y:targetPosAltered.y, z:targetPosAltered.z}, time/2)
		.yoyo(true)
		.repeat(1)
		.easing( TWEEN.Easing.Cubic.Out )
		.start();
	//this.targetPosAltered = targetPosAltered;

	var oldLoc = this.camera.position;

	this.varyingLoc = oldLoc;

/*
	var tween3 = new TWEEN.Tween(this.camera.position).to({x:targetPosAltered.x, y:targetPosAltered.y, z:targetPosAltered.z}, time/2).onUpdate(
		this.camera.lookAt(targetPosAltered)
	).repeat(0).yoyo(false).start();
	*/

	//this.camera.lookAt(targetPosAltered);
	setTimeout(function(){
		this.action = false;
	}.bind(this), time);

	var tween3 = new TWEEN.Tween(this)
		.to({radius:radius}, (time/2))
		.onUpdate(
			function(){
				this.camera.lookAt(this.targetPosAltered);
			}.bind(this)
		)
		.repeat(1)
		.easing( TWEEN.Easing.Elastic.Out )
		.yoyo(true)
		.start();

	this.action = true;
	}
};