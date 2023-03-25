/**
 * Created by rhys.thomas on 02/12/2015.
 */
var ThreeAssetsFactory = (function () {
	var instance;

	//3d model loader
	var loader = null;
	var colladaloader = null;
	//texture loader
	var textureLoader = null;

	//OUR DICTIONARIES
	var models = {};
	var colladas = {};
	var textures = {};
	var loadedFiles = 0;
	var totalFiles = 0;
	var loadedCallBack = null;

	var _requestsObject = {};

	function createInstance()
	{
		return {
			loadModel: _loadModel,
			getModel: _getModel,
			loadColladaModel: _loadColladaModel,
            getCollada: _getCollada,
            loadTexture: _loadTexture,
			loadTextureCube: _loadTextureCube,
			loadTextureCubeFull: _loadTextureCubeFull,
			getTexture: _getTexture,
			unloadModel: _unloadModel,
			unloadTexture: _unloadTexture,
			reset: _reset
		};
	}

	function _reset(total_files, loadedCallBackFunc)
	{
		loadedFiles = 0;
		totalFiles = total_files;
		loadedCallBack = loadedCallBackFunc;
	}

	/**
	 * Loads a model from a ModelFileRequest
	 * @param {ModelFileRequest} modelRequest
	 * @private
	 */
	function _loadModel(modelRequest)
	{
		_requestsObject[modelRequest.path] = modelRequest;

		if(loader === null) //do i have a loader for this file type
		{
			loader = new THREE.JSONLoader(true); //create the required loader
		}
		//perform the load of file
		loader.load(modelRequest.path, function(geometry) {
				models[modelRequest.alias] = geometry;//store our geometry for later use
				fileloadedCallback();//call the call back function so files loader knows we have loaded this file
			}.bind(this));
	}

	/**
	 * Gets a loaded models geometry by the alias name provided in the config
	 * @param {String} alias
	 * @returns {THREE.Geometry}
	 * @private
	 */
	function _getModel(alias)
	{
		return models[alias];//return the stored geometry by string alias
	}

	/**
	 * Unloads and disposes on geometry that has been stored
	 * @param {ModelFileRequest} modelRequest
	 * @private
	 */
	function _unloadModel(modelRequest)
	{
		_requestsObject[modelRequest.path] = null;//nullify the stored request
		models[modelRequest.alias].dispose();//dispose of the actual geometry
		delete _requestsObject[modelRequest.path];//delete any record of the request having existed
		delete models[modelRequest.alias];//delete any record of the geometry having ever existed

	}

	/**
    	 * Loads a model from a ModelFileRequest
    	 * @param {ModelFileRequest} modelRequest
    	 * @private
    	 */
    	function _loadColladaModel(modelRequest)
    	{
    		_requestsObject[modelRequest.path] = modelRequest;

    		if(colladaloader === null) //do i have a loader for this file type
    		{
    			colladaloader = new THREE.ColladaLoader(true); //create the required loader
    		}
    		//perform the load of file
    		colladaloader.load(modelRequest.path, function(collada) {
    				colladas[modelRequest.alias] = collada.scene;//store our geometry for later use
    				fileloadedCallback();//call the call back function so files loader knows we have loaded this file
    			}.bind(this));
    	}

    	/**
    	 * Gets a loaded models geometry by the alias name provided in the config
    	 * @param {String} alias
    	 * @returns {THREE.Geometry}
    	 * @private
    	 */
    	function _getCollada(alias)
    	{
    		return colladas[alias].clone();//return the stored geometry by string alias
    	}

    	/**
    	 * Unloads and disposes on geometry that has been stored
    	 * @param {ModelFileRequest} modelRequest
    	 * @private
    	 */
    	function _unloadCollada(modelRequest)
    	{
    		_requestsObject[modelRequest.path] = null;//nullify the stored request
    		colladas[modelRequest.alias].dispose();//dispose of the actual geometry
    		delete _requestsObject[modelRequest.path];//delete any record of the request having existed
    		delete colladas[modelRequest.alias];//delete any record of the geometry having ever existed

    	}

	/**
	 * Loads textures which use the TextureFileRequest file format
	 * @param {TextureFileRequest} textureRequest
	 * @private
	 */
	function _loadTexture(textureRequest)
	{

		_requestsObject[textureRequest.path] = textureRequest;//store the file request

		if(textureLoader === null)//do i have a loader for this file type yet
		{
			textureLoader = new THREE.TextureLoader();//create the required loader type
		}
		//perform the load of the texture file
		textureLoader.load(textureRequest.path, function(texture){
			textures[textureRequest.alias] = texture;//store the loaded texture
			if(texture)
			{
				fileloadedCallback();//call the required call back function so file loader knows we successfully loaded it
			}
		}.bind(this));
	}

	/**
	 * Loads a texture of type TextureCubeFileRequest format
	 * these textures differ from other textures in that they normally have 6 images, creating a skybox or reflection map
	 * however we are using them simpler than that and just loading the same image six times as we are using them in there
	 * simplest form.
	 * @param {TextureCubeFileRequest} textureCubeRequest
	 * @private
	 */
	function _loadTextureCube(textureCubeRequest)
	{
		_requestsObject[textureCubeRequest.path] = textureCubeRequest;//store the request - we are seeing a pattern here :)

		var directions = [];//this array will be populated with the same image url six times
		for(var i = 0; i < 6; i++)
		{
			directions.push(textureCubeRequest.path);//push in the image url
		}

		var textureCubeLoader = null;

		if(textureCubeLoader === null)//do i have the required loader type yet
		{
			textureCubeLoader = new THREE.CubeTextureLoader();//create the required loader type
		}
		//perform the load
		textureCubeLoader.load(directions, function(texture){
			textures[textureCubeRequest.alias] = texture;//store our texture
			if(texture)
			{
				fileloadedCallback();//call the call back funstion so files loader knows this completed
			}
		}.bind(this));
	}

	/**
    	 * Loads a texture of type TextureCubeFileRequest format
    	 * these textures differ from other textures in that they normally have 6 images, creating a skybox or reflection map
    	 * however we are using them simpler than that and just loading the same image six times as we are using them in there
    	 * simplest form.
    	 * @param {TextureCubeFileRequest} textureCubeRequest
    	 * @private
    	 */
    	function _loadTextureCubeFull(textureCubeRequest)
    	{
    		_requestsObject[textureCubeRequest.path] = textureCubeRequest;//store the request - we are seeing a pattern here :)

    		var directions = [];//this array will be populated with the same image url six times
    		for(var i = 0; i < 6; i++)
    		{
    			directions.push(textureCubeRequest.path[i]);//push in the image url
    		}

    		var textureCubeLoader = null;

    		if(textureCubeLoader === null)//do i have the required loader type yet
    		{
    			textureCubeLoader = new THREE.CubeTextureLoader();//create the required loader type
    		}
    		//perform the load
    		textureCubeLoader.load(directions, function(texture){
    			textures[textureCubeRequest.alias] = texture;//store our texture
    			if(texture)
    			{
    				fileloadedCallback();//call the call back funstion so files loader knows this completed
    			}
    		}.bind(this));
    	}

	/**
	 * Get a texture by the alias used in the config, this can be used for getting both normal and cube textures
	 * @param {String} alias
	 * @returns {THREE.Texture} texture
	 * @private
	 */
	function _getTexture(alias)
	{
		return textures[alias];
	}

	/**
	 * Disposes of and clears record for a particular texture, accepts both TextureFileRequest and TextureCubeFileRequest
	 * @param {TextureFileRequest||TextureCubeFileRequest} textureRequest
	 * @private
	 */
	function _unloadTexture(textureRequest)
	{
		_requestsObject[textureRequest.path] = null;//nullify the stored request
		textures[textureRequest.alias].dispose();//dispose of the actual texture
		delete _requestsObject[textureRequest.path];//delete any record of the request
		delete textures[textureRequest.alias];//delete any record of the texture
	}

	function fileloadedCallback() {
    	loadedFiles++;
    	if(loadedFiles === totalFiles)
    	{
    		loadedCallBack();
    	}
    }

	return {
		getInstance: function () {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
})();

function run() {

	var instance1 = ThreeAssetsFactory.getInstance();
	var instance2 = ThreeAssetsFactory.getInstance();

	alert("Same instance? " + (instance1 === instance2));
}