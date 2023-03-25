/**
/   android
/   www.js
/   Rhys
/   01/08/2016
/
*/
// I like this pattern..


// class
function PersonFactory() {

}

PersonFactory.prototype.buildPerson = function(stats, abilities, navigation, spriteBase)
{
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

	var kidWalkAnim = {frames:[0,1], currentFrame:0, counter:0};
	var anims = {};
	anims['walk'] = kidWalkAnim;

	var sprite = new AnimatedDirectional8SpriteObject(spriteBase, anims);
	sprite.currentAnim = 'walk';
	var locDir = parseInt(Math.random()*8);
	var theSprite = sprite.init();
	sprite.setLocalDir(locDir);
	sprite.position.y = 11.5;
	sprite.scale.x = 3;
	sprite.scale.y = 3;
	sprite.scale.z = 3;
	this._gameObjects.push(sprite);

	var rand1 = Math.floor((Math.random()*40)-20);
	var rand2 = Math.floor((Math.random()*40)-20);

	var mapPos = new THREE.Vector2();
	mapPos.x = (this.detail/2)+rand1;
	mapPos.y = (this.detail/2)+rand2;

	var person = new PersonObject(sprite, mapPos);

	return person;
}