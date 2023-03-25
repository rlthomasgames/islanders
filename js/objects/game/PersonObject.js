/**
/   android
/   www.js
/   Rhys
/   30/07/2016
/
*/
// I like this pattern..


// class
function PersonObject(spriteObject, mapPos, stats) {
  this.count = 0;
  this.sprite = spriteObject;
  this.mapPos = mapPos;
  this.firstRun = true;
  this.stats = stats;
  this.dirty = true;
  this.state = PersonObject.STATE_IDLE;
}

PersonObject.STATE_IDLE = 'idle';
PersonObject.STATE_WALKING = 'walking';
PersonObject.STATE_DEAD = 'dead';
