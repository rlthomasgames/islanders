/**
/   android
/   www.js
/   Rhys
/   30/07/2016
/
*/
// I like this pattern..


// class
function PersonController(landLayer, detail) {
  this._landLayer = landLayer;
  this._detail = detail;
}

PersonController.prototype.updateObject = function(object)
{
    if(object.state === "idle")
    {
        object.count++;
        if(object.count*2/object.count > object.count*Math.PI)
        {
            object.sprite.setLocalDir(object.sprite.getLocalDir()+1);
        }
        if(object.count > 1)
        {
            if(!object.end)
            {
                object.count = 0;
                object.sprite.position.x = (object.mapPos.x-((this._detail)/2))*4;
                object.sprite.position.z = (object.mapPos.y-((this._detail-1)/2))*4;
                var modified = new THREE.Vector2();
                modified.x = object.sprite.position.x;
                modified.y = object.sprite.position.z;
                object.sprite.position.y = this._landLayer.getVertHeightAt(modified)+1.25;
                object.sprite.setLocalDir(parseInt(Math.random()*8));

                var walkable = false;
                while(!walkable)
                {
                    var random1 = parseInt(Math.random()*this._detail);
                    var random2 = parseInt(Math.random()*this._detail);

                    var tile = this._landLayer.getTile(random1, random2);

                    if(tile.walkable)
                    {
                        object.sprite.position.x = tile.vert.x;
                        object.sprite.position.z = -tile.vert.y;
                        object.sprite.position.y = (tile.vert.z)+3;
                        object.start = this._landLayer.getAStarGraph().grid[random1][random2];
                        object.last = tile;
                        object.state = "searching";
                        walkable = true;
                    }
                }
            }
            else
            {
                object.start = object.end;
                object.state = "searching";
            }
	    }
	}
	else if(object.state === "searching")
    {
    	//console.debug('ready to find a target');
    	var walkable = false;
        while(!walkable)
        {
            var random1 = parseInt(Math.random()*this._detail);
            var random2 = parseInt(Math.random()*this._detail);

            var tile = this._landLayer.getTile(random1, random2);

            if(tile.walkable)
            {
                object.end = this._landLayer.getAStarGraph().grid[random1][random2];
                var path = astar.search(this._landLayer.getAStarGraph(), object.start, object.end, {heuristic:astar.heuristics.diagonal, closest:false});
                if (path && path.length > 0)
                {
                	//console.debug('path... ', path);
					object.path = path;
					object.state = "moving";
					object.count = 0;
					walkable = true;
					var yipee = sounds["sounds/yipee.mp3"];
                    yipee.play();
                }
            }
        }
    }
    else if(object.state == "moving")
    {
		var nextTile = this._landLayer.getTile(object.path[0].x, object.path[0].y);
		//object.sprite.setLocalDir(parseInt(Math.random()*8))
		new TWEEN.Tween(object.sprite.position).to({x:nextTile.vert.x, z:-nextTile.vert.y, y:((nextTile.vert.z)+3)}, 5000/object.stats.speed).onComplete(function(){this.makeDirty(object)}.bind(this)).start();
		object.dirty = false;
		/*
		object.sprite.position.x = nextTile.vert.x;
		object.sprite.position.z = -nextTile.vert.y;
		object.sprite.position.y = (nextTile.vert.z)+11.25;
		*/
		if(object.last && object.path.length > 0)
		{
			var newLocalDir = 0;
			var xDiff = (object.path[0].x - object.last.x);
			var yDiff = (object.path[0].y - object.last.y);
			var modifier = 0;
			//console.debug('change... ', xDiff, yDiff);
			if(xDiff == 0 && yDiff == -1)
			{
				newLocalDir = 0;
			}
			else if (xDiff == 1 && yDiff == -1)
			{
				newLocalDir = 7;
			}
			else if (xDiff == 1 && yDiff == 0)
			{
				newLocalDir = 6;
			}
			else if (xDiff == 1 && yDiff == 1)
			{
				newLocalDir = 5;
			}
			else if (xDiff == 0 && yDiff == 1)
			{
				newLocalDir = 4;
			}
			else if (xDiff == -1 && yDiff == 1)
			{
				newLocalDir = 3;
			}
			else if (xDiff == -1 && yDiff == 0)
			{
				newLocalDir = 2;
			}
			else if (xDiff == -1 && yDiff == -1)
			{
				newLocalDir = 1;
			}
			var total = newLocalDir+modifier;
			if(total > 7)
			{
				 total = total -7;
			}
			else if (total < 0)
			{
				 total = total+7;
			}
			object.sprite.setLocalDir(total);
		}
		object.last = object.path[0];
		object.path.shift();
		object.count = 0;
		if(object.path.length === 0)
		{
			object.state = "idle";
		}


    }
    //console.debug('i am', object.state);
};

PersonController.prototype.makeDirty = function(object){
	object.dirty = true;
};