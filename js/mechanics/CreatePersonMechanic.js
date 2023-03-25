/**
/   android
/   www.js.mechanics
/   Rhys
/   09/10/2016
/
*/
// I like this pattern..


// class
function CreatePersonMechanic(scene, gameObjects, detail) {
	this.scene = scene;
	this._gameObjects = gameObjects;
	this.detail = detail;
}

CreatePersonMechanic.prototype.createPerson = function()
{
	 //CREATE A Person!!!!
                    //STATS
                    		var personStats = {
                    			str:10,
                    			dex:10,
                    			wis:10
                    		};
                    		//

                    		//ABILITIES
                    		var personAbilities = {
                    			fishing:10,
                    			farming:10,
                    			mining:10,
                    			building:10,
                    			foraging:10
                    		};
                    		//

                    		//NAVIGATION
                    		var personNavigation = {
                    			mapPos:{},
                    			targetPos:{}
                    		}
                    		//

                    		var kidWalkAnim = {frames:[0,1,2,3,4,5], currentFrame:0, counter:0};
                    		var anims = {};
                    		anims['walk'] = kidWalkAnim;

                    		var sprite = new AnimatedDirectional8SpriteObject('yoshi', anims, 6);
                    		sprite.currentAnim = 'walk';
                    		var locDir = parseInt(Math.random()*2);
                    		var theSprite = sprite.init(true);
                    		sprite.setLocalDir(locDir);
                    		sprite.position.y = 6;
                    		sprite.scale.x = 6;
                    		sprite.scale.y = 6;
                    		sprite.scale.z = 6;
                    		this._gameObjects.push(sprite);

                    		var rand1 = 0;
                    		var rand2 = 0;

                    		var mapPos = new THREE.Vector2();
                    		mapPos.x = (this.detail/2)+rand1;
                    		mapPos.y = (this.detail/2)+rand2;

                    		var randy = (Math.random()*4)+2;
                    		var personStats = {speed:randy};

                    		var person = new PersonObject(sprite, mapPos, personStats);
                    		this._gameObjects.push(person);

                    		this.scene.add(theSprite);

                    		var letsgo = sounds["sounds/letsgo.mp3"];
                    		letsgo.play();

                    		/*
                    		var path = window.location.pathname;
                            path = path.substr( path, path.length - 10 );
                            var test = 'file://' + path;
                            console.debug('path >', test);
                    		var audio = new Media('android_asset/www/sounds/letsgo.mp3');
                            audio.play();

                            var audio1 = new Media(test+'android_asset/www/sounds/letsgo.mp3');
                            audio1.play();

                            var audio2 = new Media(test+'assets/www/sounds/letsgo.mp3');
    						audio2.play();
    						*/
                    //
}

/*
// class methods
CreatePersonMechanic.prototype.getFunction = function() {
  return this._variable;
}

// same as above, function as a method
CreatePersonMechanic.prototype.setFunction = function(value) {
  this._variable = value;
}

// the get age method can be a "static"
// method on the constructor function if you pass the
// person object
CreatePersonMechanic.staticConstructorFunction = function() {
  //perform a task
}
*/