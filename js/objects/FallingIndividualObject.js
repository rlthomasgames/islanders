/**
/   android
/   www.js.objects
/   Rhys
/   28/03/2016
/
*/
// I like this pattern..


// class
function FallingIndividualObject(peice, distance, intersect, changeAmount, type) {
	this.SAND_TYPE = 'SAND_TYPE';
	this.GORUND_TYPE = 'GROUND_TYPE';
	this.ROCK_TYPE = 'ROCK_TYPE';
	this.LAVA_TYPE = 'LAVA_TYPE';
	this.peice = peice;
	this.distance = distance;
	this.intersect = intersect;
	this.type = type;
	this.changeAmount = changeAmount;
}