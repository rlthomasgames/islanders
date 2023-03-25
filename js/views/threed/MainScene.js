/**
/   android
/   www.js
/   Rhys
/   02/02/2016
/
*/
// I like this pattern..


// class
function MainScene(containerElement, layerName, quality, createMenuFunction, layerManager) {
	this._createMenuFunction = createMenuFunction;
	this._containerElement = containerElement;
	this._layerName = layerName;
	this._quality = quality;
	this._layerManager = layerManager;
	this.WIDTH = Math.floor(window.innerWidth / this._quality);
	this.HEIGHT = Math.floor(window.innerHeight / this._quality);
	this.SIZE = this.WIDTH * this.HEIGHT,

	this.renderer = null;
	this.scene = null;
	this.camera = null;
	this.lastGestureRotation = 0;
	this.theta = 180;
	this.hammer = {};

	this.detail = 40;

	this.up = false;
	this.down = false;
	this.right = false;
	this.left = false;

	this.angle = 0;
	this.lastScale = 0;

	this.textureSize = 512;

	this._gameObjects = [];

	this._newMechanicFlow = [['PlaceLandMechanic', {size:5, type:1}],['PlaceLandMechanic', {size:3, type:2}],['PlaceLandMechanic', {size:4, type:0}],['CreatePersonMechanic', {stat1:2}]];
	this._mechanicFlow = this.cloneMechanicFlow(this._newMechanicFlow);
}

MainScene.prototype.cloneMechanicFlow = function(array)
{
	var newArray = [];
	for(var i = 0; i < array.length; i++)
	{
		newArray.push(array[i]);
    }
	console.debug('returning.... ', newArray);
	return newArray;
}

MainScene.prototype.setupHammer = function(container)
{
	this.hammer = new Hammer.Manager(container);
	console.debug('container...', container.parentElement);
	this.secondHammer = new Hammer.Manager(container.parentElement);
	var rotate = new Hammer.Rotate();
	var tap = new Hammer.Tap();
	var pinch = new Hammer.Pinch();
	var press = new Hammer.Press();
	var pan = new Hammer.Pan();
	tap.time = 0.01;
	tap.pan = 0.01;
	tap.requireFailure(press);
	pinch.recognizeWith(rotate);
	this.hammer.add([rotate, tap, pinch, pan]);
	this.secondHammer.add([pan]);
	this.hammer.get('pinch').set({ enable: true });
	this.secondHammer.on("pan", function(ev) {
		if(ev.distance > 75)
		{
			console.debug('override!!!!', ev);
			this.left = false;
			this.up = false;
			this.down = false;
			this.right = false;
			}

	}.bind(this));
	this.hammer.on("rotatestart", function(ev) {
			this.lastGestureRotation = ev.rotation;
			this.angle = this.lastGestureRotation;
	}.bind(this));
	this.hammer.on("rotate", function(ev) {
			this.theta = this.theta + Math.round(1 * (ev.rotation-this.lastGestureRotation));
			this.lastGestureRotation = ev.rotation;
	}.bind(this));
	this.hammer.on("pinchstart", function(ev){
							this.lastScale = ev.scale;
	}.bind(this))
	this.hammer.on("pinchend", function(ev){
		 this.currentScale = 0;
		 this.lastScale = 0;
		 this.left = false;
		this.up = false;
		this.down = false;
		this.right = false;
		console.debug('oi!')
	}.bind(this))
	this.hammer.on("pinch", function(ev){
		this.currentScale = this.lastScale - ev.scale;
	}.bind(this))
}

MainScene.prototype.init = function() {

	var container;

	container = this._containerElement;

	this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	container.appendChild( this.renderer.domElement );
	container.style.width = window.innerWidth;
	container.style.height = window.innerHeight;
	//SCENE
	this.scene = new THREE.Scene();

	this.scene.fog = new THREE.Fog( 0xd7cbb0, 320, 550 );

	this._horizonDistance = 4000;

	//RENDERER
	this.renderer.setClearColor( 0xff0000, 0 );
	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

	//CAMERA
	this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, this._horizonDistance );
	this.camera.position.y = 50;
	this.camera.lookAt(new THREE.Vector3(0,0,0));

	this.cameraController = new CameraController(this.camera);
	this.islandObjectManager = null;

	this._spriteController = new Directional8SpriteController();

	this._animatedSpriteController = new AnimatedDirectional8SpriteController();

	this.cameralight = new THREE.PointLight(0xffffff, 100, 500);
	this.cameralight.position.y = 100;
	this.cameralight.position.z = 0;
	this.cameralight.intensity = 0.9;
	this.cameralight.castShadow = false;
    this.cameralight.shadow.bias = 5;
    this.cameralight.shadowMapWidth = 1024;
    this.cameralight.shadowMapHeight = 1024;
	this.scene.add(this.cameralight);

	//WATER SETUP
	var sceneryBuilder = new SceneryBuilder();
	var water = sceneryBuilder.getWaterPlane(this._horizonDistance,this._horizonDistance,'waterNormals',this.renderer,this.camera,this.scene,this.cameralight.position);
	water.scale.x = water.scale.y = water.scale.z = 0.4;
	water.castShadow = true;
	water.receiveShadow = true;
	this.water = water.children[0];
	this.scene.add(water);

	//SKYBOX SETUP
	var skyBox = sceneryBuilder.getSkyBox('skyBoxMapFull', this._horizonDistance);
	this.scene.add(skyBox);

	//SETUP LANDS
	//LAND
    var sandDiff = ThreeAssetsFactory.getInstance().getTexture('sandDiffusive');
    var groundDiff = ThreeAssetsFactory.getInstance().getTexture('earthDiffusive');
    var rockDiff = ThreeAssetsFactory.getInstance().getTexture('rockDiffusive');
    var sandNorm = ThreeAssetsFactory.getInstance().getTexture('sandNormals');
    var groundNorm = ThreeAssetsFactory.getInstance().getTexture('earthNormals');
    var rockNorm = ThreeAssetsFactory.getInstance().getTexture('earthNormals');
    var alpha1 = ThreeAssetsFactory.getInstance().getTexture('alpha1');
    var alpha2 = ThreeAssetsFactory.getInstance().getTexture('alpha2');
    var alpha3 = ThreeAssetsFactory.getInstance().getTexture('alpha3');
    this._landLayer = new LandLayer(0,sandDiff,groundDiff,rockDiff,alpha1,alpha2,alpha3,sandNorm,groundNorm,rockNorm,this.detail,this.textureSize);
    this.scene.add(this._landLayer.getMesh());

	this.lastScale = 0;
	this.currentScale = 0;

	this.raycaster = new THREE.Raycaster();

	this.mouse = new THREE.Vector2();


	this.theta = 0;
	this.lastGestureRotation = 0;

	this.render();

	this.setupHammer(container);
	var startSize = 5;
	var rad = startSize/1.5;
	var startIsland = [];
	for(var i = -startSize; i < startSize; i++)
	{
		for(var j =-startSize; j < startSize; j++)
		{
			if((i*i)+(j*j) <=((((rad)*(rad)))-(rad)))
			{
				var x = 0.5+(i/20);
				var y = 0.5+(j/20);
				var uv = {x:x, y:y};
				var intersect = {uv:uv};
				var raiseObject = {intersect:intersect};
				startIsland.push(raiseObject);
			}
		}
	}
	for(var s = 0; s < startIsland.length; s++)
	{
		var raiseObject = startIsland[s];
		//one layer
		this._landLayer.clearAlphaPositions()
		this._landLayer.raiseVerts(raiseObject.intersect, null, true, 0);
		this._landLayer.modifyTexture(0);
		//this._landLayer.clearAlphaPositions();
	}

	//setup some people
	//this._personFactory = new PersonFactory();
	this._personController = new PersonController(this._landLayer, this.detail);
	//


	//this.createFallingLand();

	//var nextMechanic = this._createMenuFunction;
	this._mechanic = new PlaceLandMechanic(this._landLayer, this.scene, this._gameObjects, this.detail, this.raycaster, 6, 1, this.mechanicCallBackLoop.bind(this));
	this._mechanic.createFallingLand();
	this.updateMechanic = true;

	this.loop();
}

MainScene.prototype.mechanicCallBackLoop = function()
{
	this.updateMechanic = false;
	if(this._mechanicFlow.length > 0)
	{
		if(this._mechanic)
		{
			console.debug('destroy current mechanic');
			this._mechanic = null;
		}
		var nextMechanic = this._mechanicFlow[0];
		switch(nextMechanic[0])
		{
			case 'PlaceLandMechanic':
				console.debug('got next mechanic..', nextMechanic[0], nextMechanic[1]);
				this._mechanic = new PlaceLandMechanic(this._landLayer, this.scene, this._gameObjects, this.detail, this.raycaster, nextMechanic[1].size, nextMechanic[1].type, this.mechanicCallBackLoop.bind(this));
				this._mechanic.createFallingLand();
				this._mechanicFlow.shift();
				this.updateMechanic = true;
			break;
			case 'CreatePersonMechanic':
				this._mechanic = new CreatePersonMechanic(this.scene, this._gameObjects, this.detail);
				this._mechanic.createPerson();
				this.updateMechanic = false;
				this._mechanicFlow.shift();
				this.mechanicCallBackLoop();
			break;
		}
	}
	else
	{
		//request new mechanic flow
		console.debug('request new mechanic flow');
		setTimeout(function(){
			this._mechanicFlow = this.cloneMechanicFlow(this._newMechanicFlow);
            this.mechanicCallBackLoop();
		}.bind(this), 500);
	}
}

MainScene.prototype.render = function()
{
	this.renderer.render( this.scene, this.camera );
	this.water.material.uniforms.time.value += 0.02;
	this.water.render();
}

MainScene.prototype.loop = function()
{
	requestAnimationFrame(function(){this.loop()}.bind(this));

	for(var i = 0; i < this._gameObjects.length; i++)
	{
		var gameObject = this._gameObjects[i];
		if(gameObject instanceof AnimatedDirectional8SpriteObject)
		{
			this._animatedSpriteController.updateObject(gameObject, this.theta);
		}
		else if(gameObject instanceof Directional8SpriteObject)
		{
			this._spriteController.updateObject(gameObject, this.theta);
		}
		else if(gameObject instanceof PersonObject)
		{
			if(gameObject.dirty)//TODO make all game objects able to be dirty or not,
			{
				//then you can order gameobjects array by dirty and break the for loop as soon as you hit a non dirty
				this._personController.updateObject(gameObject);
			}
		}
	}

	if(this._mechanic && this.updateMechanic)
	{
		if(this._mechanic.placing && this._mechanic.fallen == false)
		{
			this._mechanic.fallPiece();
			this.cameraController.changeTarget(this._mechanic.currentFallingLand.mesh.position, (Math.random()*90)-45, (Math.random()*20)+70, 5000);
			this._mechanic.placing = false;
		}
		if(this.left)
		{
			this._mechanic.movePeice(1);
		}
		if(this.right)
		{
			this._mechanic.movePeice(0);
		}
		if(this.up)
		{
			this._mechanic.movePeice(3);
		}
		if(this.down)
		{
			this._mechanic.movePeice(2);
		}
	}

	this.cameraController.updateCamera(this.theta);
	this.cameraController.adjustZoom(((this.currentScale)*4));

	if(this.theta > 360)
	{
		this.theta = this.theta -360;
	}
	if(this.theta < 0)
	{
		this.theta = this.theta +360;
	}

	var radius = this.cameraController.getRadius();

	this.forDir = {x:-((radius/80) * Math.sin( THREE.Math.degToRad( -(this.theta) ) )), y:-((radius/80) * Math.cos( THREE.Math.degToRad( -(this.theta) ) )) }
	this.leftDir = {x:-((radius/80) * Math.sin( THREE.Math.degToRad( -(this.theta+90) ) )), y:-((radius/80) * Math.cos( THREE.Math.degToRad( -(this.theta+90) ) )) }

	if(this.updateMechanic)
	{
		this._mechanic.update(this.forDir, this.leftDir);
	}

	this.cameralight.position = this.camera.position;

	TWEEN.update();

	this.render();
};

MainScene.prototype.setMechanicProperty = function(name, value)
{
	if(this._mechanic)
	{
		this._mechanic[name] = value;
	}
}

MainScene.prototype.setIndex = function(index)
{
	this._containerElement.style.zIndex = index;
};

MainScene.prototype.createIslandMenu = function()
{
 	console.debug('create island menu');
};

// class methods
MainScene.prototype.getDisplayObject = function()
{
	return this._containerElement;
};

// same as above, function as a method
MainScene.prototype.layerName = function()
{
	return this._layerName;
};