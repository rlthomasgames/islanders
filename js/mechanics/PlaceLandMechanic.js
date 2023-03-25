/**
/   android
/   www.js.mechanics
/   Rhys
/   29/09/2016
/
*/
// I like this pattern..


// class
function PlaceLandMechanic(landLayer, scene, gameObjects, detail, raycaster, size, type, callback) {
  this._landLayer = landLayer;
  this.scene = scene;
  this._gameObjects = gameObjects;
  this._currentArrows = [];
  this.detail = detail;
  this.dirty = true;
  this.raycaster = raycaster;
  this.callback = callback;
  this.size = size;
  this.type = type;
}

PlaceLandMechanic.prototype.createFallingLand = function()
{
	this._landLayer.clearAlphaPositions();
	while(this._currentArrows.length > 0)
	{
		this._currentArrows.shift();
	}
	var landType = this.type;
	var size = this.size;

	var landShape = this.testUtil(size);
	this.currentFallingLand = null;

	var group = new THREE.Group();

	var colour = null;
	switch(landType)
	{
		case 0:
			colour = 0xffdf71;
		break;
		case 1:
			colour = 0x734d26;
		break;
		case 2:
			colour = 0x808080;
		break;
	}

	var texture = ThreeAssetsFactory.getInstance().getTexture('placeArrow');
	var material = new THREE.SpriteMaterial( { map: texture, color:colour, fog: true } );
	var fallMesh = new THREE.Sprite(material);
	fallMesh.renderOrder = 3;
	fallMesh.scale.x = 4.0;
	fallMesh.scale.y = 4.0;
	fallMesh.scale.z = 4.0;
	fallMesh.castShadows = false;
	fallMesh.renderOrder = 20;

	for(var i = 0; i < landShape.length; i++)
	{
		var newMesh = fallMesh.clone();
		newMesh.position.x = (landShape[i].x/(this.detail/16))*10;
		newMesh.position.z = (landShape[i].y/(this.detail/16))*10;
		newMesh.position.y = 0;
		newMesh.castShadow = false;
		newMesh.renderOrder = 20;
		newMesh.name = "arrow";
		group.add(newMesh);
	}

	var cylinderGeom = new THREE.CylinderGeometry(size*(this.detail/14)-5,size*(this.detail/14),45,16);

	console.debug('its geom = ', cylinderGeom);

	var cylinderText = ThreeAssetsFactory.getInstance().getTexture('indicator');
	var cylinderMat1 = new THREE.MeshBasicMaterial({map:cylinderText, transparent:true, depthWrite:false, opacity:0.25});
	cylinderMat1.side = THREE.DoubleSide;
	var cylinderMat2 = new THREE.MeshBasicMaterial({color:0xff0000, transparent:true, depthWrite:false, opacity:0});
	cylinderMat2.side = THREE.BackSide;
	cylinderMat1.blending = THREE.AdditiveBlending;

	var materialsArray = [];
	materialsArray.push(cylinderMat1);
	materialsArray.push(cylinderMat2);

	var material = new THREE.MeshFaceMaterial(materialsArray);

	for(var i = 0; i < cylinderGeom.faces.length; i++)
    	{
    		if(i > 31 )
    		{
    			cylinderGeom.faces[i].materialIndex = 1;
    		}
    	}

	var cylinder = new THREE.Mesh(cylinderGeom, material);
	cylinder.renderOrder = 100;
	cylinder.position.y = -23;

	group.add(cylinder);
	var tween = new TWEEN.Tween(cylinder.scale)
		.to({y:1.1, z:1.1, x:1.1}, 1500)
		.easing( TWEEN.Easing.Cubic.InOut )
		.repeat(Infinity)
		.delay(200)
		.yoyo(true)
		.start();

	var tween2 = new TWEEN.Tween(cylinder.rotation)
    		.to({y:cylinder.rotation.y+(THREE.Math.degToRad(359))}, 4000)
    		.repeat(Infinity)
    		.start();

	this._currentArrows = group.children;

	this.scene.add(group);

	group.position.y = 48;
	var landObject = {mesh:group, value:landType, size:size, tween:[tween,tween2]};
	this.currentFallingLand = landObject;
	this.currentFallingLand.removedCylinder = false;
	this.fallen = false;
}

PlaceLandMechanic.prototype.movePeice = function(direction)
{
	this.proposedPosition = new THREE.Vector2();
	//console.debug('what am i ', this.currentFallingLand);
	switch(direction)
	{
		case 0:
			this.proposedPosition.x = this.currentFallingLand.mesh.position.x + this.leftDir.x/2.25;
			this.proposedPosition.y = this.currentFallingLand.mesh.position.z + this.leftDir.y/2.25;
			break;
		case 1:
			this.proposedPosition.x = this.currentFallingLand.mesh.position.x - this.leftDir.x/2.25;
			this.proposedPosition.y = this.currentFallingLand.mesh.position.z - this.leftDir.y/2.25;
			break;
		case 2:
			this.proposedPosition.x = this.currentFallingLand.mesh.position.x - this.forDir.x/2.25;
			this.proposedPosition.y = this.currentFallingLand.mesh.position.z - this.forDir.y/2.25;
			break;
		case 3:
			this.proposedPosition.x = this.currentFallingLand.mesh.position.x + this.forDir.x/2.25;
			this.proposedPosition.y = this.currentFallingLand.mesh.position.z + this.forDir.y/2.25;
			break;
	}
	var rad = 74;
	if((this.proposedPosition.x*this.proposedPosition.x)+(this.proposedPosition.y*this.proposedPosition.y) <=((((rad-(this.currentFallingLand.size)*2)*(rad-(this.currentFallingLand.size)*2)))-(rad+-this.currentFallingLand.size)))
    {
		this.currentFallingLand.mesh.position.x = this.proposedPosition.x;
		this.currentFallingLand.mesh.position.z = this.proposedPosition.y;
	}
	else
	{
    	this.currentFallingLand.mesh.position.x-=((this.proposedPosition.x-this.currentFallingLand.mesh.position.x)*20);
    	this.currentFallingLand.mesh.position.z-=((this.proposedPosition.y-this.currentFallingLand.mesh.position.z)*20);
    }
}

PlaceLandMechanic.prototype.fallPiece = function()
{
	if(this.currentFallingLand)
	{
		if(this.placing && this.fallen == false)
		{
			this.placeLand();
			this.placing = false;
		}
	}
}

PlaceLandMechanic.prototype.placeLand = function()
{
	var raiseObjects = [];
	if(!this.currentFallingLand.removedCylinder)
	{
		this.currentFallingLand.removedCylinder = true;
		var cylinder = this.currentFallingLand.mesh.children[this.currentFallingLand.mesh.children.length-1];
		//this.currentFallingLand.mesh.remove(cylinder);
		this.currentFallingLand.mesh.children.pop();
		while(this.currentFallingLand.tween.length > 0)
		{
        	TWEEN.remove(this.currentFallingLand.tween[i]);
        	this.currentFallingLand.tween.shift();
        }
        this.currentFallingLand.tween = null;
        if(this.currentFallingLand.tween)
        {
        	console.debug('removing tween.. ', this.currentFallingLand.tween[0]);
			while(this.currentFallingLand.tween.length > 0)
			{
				this.currentFallingLand.tween[0].stop();
				this.currentFallingLand.tween.shift();
			}
		}
	}
	for(var i = 0; i < this.currentFallingLand.mesh.children.length; i++)
	{
		var peice = this.currentFallingLand.mesh.children[i];
		var position = new THREE.Vector3(
			peice.position.x+this.currentFallingLand.mesh.position.x,
			peice.position.y+this.currentFallingLand.mesh.position.y,
			peice.position.z+this.currentFallingLand.mesh.position.z
		)
		this.raycaster.set(position, new THREE.Vector3(0,-1,0));
		var landNum = this.currentFallingLand.value;
		var landType = this._landLayer;
		/*
		switch(landNum)
		{
			case 0:
				landType = this._sandLayer;
			break;
			case 1:
				landType = this._grndLayer;
			break;
			case 2:
				landType = this._rockLayer;
			break;
		}
		*/
		var intersects = this.raycaster.intersectObjects( [landType.getMesh()] );
		if(intersects.length > 0)
		{
			var raiseObject = {peice:peice, intersect:intersects[0]};
			raiseObjects.push(raiseObject);
		}
	}
	//console.debug('did i place land multiples??');
	for(var j = 0; j < raiseObjects.length; j++)
	{
		this.fallPieceDistance(raiseObjects[j], landNum);
	}
	this.placing = false;
	this.fallen = true;
};

PlaceLandMechanic.prototype.fallPieceDistance = function(raiseObject, landNum)
{
	var newPos = new THREE.Vector3(raiseObject.peice.position.x, raiseObject.peice.position.y-raiseObject.intersect.distance, raiseObject.peice.position.z);
	var raiseLandArr = [true,true,true];
	var addAlphaArr = [];
	switch(landNum)
	{
		case 0:
			addAlphaArr = [true, false, false];
		break;
		case 1:
			addAlphaArr = [true, true, false];
		break;
		case 2:
			addAlphaArr = [true, true, true];
		break;
	}
	/*
	for(var i = 0; i < 3; i++)
	{
		if(i == landNum)
		{
			new TWEEN.Tween(raiseObject.peice.position).to(newPos, 24*raiseObject.intersect.distance).onComplete(this.raiseLayer.bind(this, [i, addAlphaArr[i], raiseObject])).start();
		}
	}
	*/
	new TWEEN.Tween(raiseObject.peice.position).to(newPos, 24*raiseObject.intersect.distance).onComplete(this.raiseLayer.bind(this, [landNum, addAlphaArr[landNum], raiseObject])).start();
};

PlaceLandMechanic.prototype.raiseLayer = function(params)
{
	//console.debug('hey hey i got here with >>>>>>', params);
	var landLayer = null;
	var raiseObject = params[2];
	/*
	switch(params[0])
	{
		case 0:
			landLayer = this._sandLayer;
		break;
		case 1:
			landLayer = this._grndLayer;
		break;
		case 2:
			landLayer = this._rockLayer;
		break;
	}
	*/
	landLayer = this._landLayer;
	landLayer.clearAlphaPositions();
	landLayer.raiseVerts(raiseObject.intersect, raiseObject.peice.position, params[1], params[0]);
	landLayer.modifyTexture(params[0]);
	if(raiseObject.peice.parent)
	{
		this.currentFallingLand.mesh.remove(raiseObject.peice);
	}
};

PlaceLandMechanic.prototype.testUtil = function(size)
{
	this.testUtilRan++;
	var arr2 = [];
	var rad = size/2;
	for(var i = -rad; i < size; i++)
	{
		for(var j= -rad; j < size; j++)
		{
			if((i*i)+(j*j) <=((((rad)*(rad)))-(rad)))
			{
				arr2.push({x:i, y:j});
			}
		}
	}
	//console.debug('rand test util >>>> ', this.testUtilRan);
	return arr2;
};

PlaceLandMechanic.prototype.update = function(forDir, leftDir)
{
	this.leftDir = leftDir;
	this.forDir = forDir;
	if(this.placing && this.fallen == false)
    	{
    		this.fallPiece();
    		this.placing = false;
    	}
    	if(this.left)
    	{
    		this.movePeice(1);
    	}
    	if(this.right)
    	{
    		this.movePeice(0);
    	}
    	if(this.up)
    	{
    		this.movePeice(3);
    	}
    	if(this.down)
    	{
    		this.movePeice(2);
    	}

    	if(this.currentFallingLand.mesh.children.length === 0)
            {
            	this.placed = true;
            	this.fallen = true;
            			//setTimeout(function(){this.placed = true;}.bind(this), 200);
            }

        	if(this.placed)
        	{
        		setTimeout(this._nextMechanic, 2500);
        		this.scene.remove(this.currentFallingLand.mesh);
        		//console.debug('the current falling land', this.currentFallingLand, this.currentFallingLand.mesh, this.currentFallingLand.mesh.children.length);
        		this.currentFallingLand.mesh = null;
        		this.currentFallingLand = null;
        		//console.debug('i was called!!!');
        		this.placed = false;
                this.placing = false;
                while(this._currentArrows.length > 0)
                	{
                		this._currentArrows.shift();
                	}
                if(this._currentArrows.length == 0)
                {
                	//MECHANIC COMPLETE
        			//this.createFallingLand();
        			this.callback();
                }
        	}
};

/*
// class methods
PlaceLandMechanic.prototype.getFunction = function() {
  return this._variable;
}

// same as above, function as a method
PlaceLandMechanic.prototype.setFunction = function(value) {
  this._variable = value;
}

// the get age method can be a "static"
// method on the constructor function if you pass the
// person object
PlaceLandMechanic.staticConstructorFunction = function() {
  //perform a task
}
*/