/**
/   android
/   www.js
/   Rhys
/   01/02/2016
/
*/
// I like this pattern..


// class
function LayerManager(stageElement) {
	this._layers = [];
	this._stageElement = stageElement;
	this._stageElement.style.background = "#000000";
}
// class methods
LayerManager.prototype._getTotalLayers = function() {
  return this._stageElement.childNodes.length;
}

// same as above, function as a method
LayerManager.prototype.addLayer = function(gameLayer) {
	if(!this._layers[gameLayer.layerName()])
	{
		var displayObject = gameLayer.getDisplayObject();
		displayObject.style.position = 'absolute';
		displayObject.style.width = '100%';
		displayObject.style.height = '100%';
		displayObject.style.zIndex = ""+(this._getTotalLayers()+1)+"";

		this._layers[gameLayer.layerName()] = gameLayer;
		this._stageElement.appendChild(displayObject);
 	}
}

LayerManager.prototype.destroyLayer = function(layerName){
	console.debug('called destroy', layerName);
	var layer = this._layers[layerName];
	if(layer)
	{
		console.debug(layerName, layer, this._layers);
		var displayObject = layer.getDisplayObject();
		this._stageElement.removeChild(displayObject);
		this._layers[layerName] = null;
		delete this._layers[layerName];
	}
}

LayerManager.prototype.getLayerByName = function(layerName){
	return this._layers[layerName];
}