/**
/   android
/   www.js
/   Rhys
/   07/05/2016
/
*/
// I like this pattern..


// class
function LandLayer(layerNumber, diffusiveTexture, diffusiveTexture1, diffusiveTexture2, alphaTexture1,alphaTexture2,alphaTexture3, normalTexture,normalTexture2,normalTexture3, detail, textureSize) {
  this._layerNumber = layerNumber;
  this._diffusiveTexture = diffusiveTexture;
  this._diffusiveTexture1 = diffusiveTexture1;
  this._diffusiveTexture2 = diffusiveTexture2;
  this._alphaTexture1 = alphaTexture1;
  this._alphaTexture2 = alphaTexture2;
  this._alphaTexture3 = alphaTexture3;
  this.normalTexture1 = normalTexture3;
  this.normalTexture2 = normalTexture2;
  this.normalTexture3 = normalTexture;
  this._detail = detail;
  this._textureSize = textureSize;
  this._drawingContext = null;
  this._material = null;
  this._mesh = null;
  this._alphaPositions = null;

  this.buildLayer();

  this._drawingCanvas1 = null;
  this._drawingContext1 = null;
  this._drawingCanvas2 = null;
  this._drawingContext2 = null;
  this._drawingCanvas2 = null;
  this._drawingContext2 = null;

  this.texture1 = null;
  this.texture2 = null;
  this.texture3 = null;

  this.wireDebug = false;
}

LandLayer.prototype.buildLayer = function()
{
	//SETUP LAYER
	var geometry = new THREE.PlaneGeometry(160,160,this._detail-1,this._detail-1);
	var diffusiveTexture = this._diffusiveTexture;
	diffusiveTexture.wrapS = THREE.RepeatWrapping;
	diffusiveTexture.wrapT = THREE.RepeatWrapping;
	diffusiveTexture.repeat.set( 1, 1 );

	//TODO:  very weird VVVVV
	var normaltexture = this.normalTexture1;
	normaltexture.wrapS = THREE.RepeatWrapping;
	normaltexture.wrapT = THREE.RepeatWrapping;
	normaltexture.repeat.set( 60, 60 );

	/**/
	this._drawingCanvas1 = document.getElementById("canvas1");
	this._drawingCanvas1.width = this._textureSize;
	this._drawingCanvas1.height = this._textureSize;
	this._drawingContext1 = this._drawingCanvas1.getContext('2d');
	this._drawingContext1.fillStyle = 'rgba(0,0,0,1)';
	this._drawingContext1.fillRect( 0, 0, this._textureSize, this._textureSize );
	/**/

	this._drawingCanvas2 = document.getElementById("canvas2");
	this._drawingCanvas2.width = this._textureSize;
	this._drawingCanvas2.height = this._textureSize;
	this._drawingContext2 = this._drawingCanvas2.getContext('2d');
	var rand = (Math.random()*255);
	this._drawingContext2.fillStyle = 'rgba(0,0,0,1)';
	this._drawingContext2.fillRect( 0, 0, this._textureSize, this._textureSize );

	this._drawingCanvas3 = document.getElementById("canvas3");
	this._drawingCanvas3.width = this._textureSize;
	this._drawingCanvas3.height = this._textureSize;
	this._drawingContext3 = this._drawingCanvas3.getContext('2d');
	var rand = (Math.random()*255);
	this._drawingContext3.fillStyle = 'rgba(0,0,0,1)';
	this._drawingContext3.fillRect( 0, 0, this._textureSize, this._textureSize );

	this.vertShader = document.getElementById('vertex_shh').innerHTML;

    this.fragShader = document.getElementById('fragment_shh').innerHTML;

	this.texture1 = this.updateTexture(this._drawingCanvas1);
	this.texture2 = this.updateTexture(this._drawingCanvas2);
	this.texture3 = this.updateTexture(this._drawingCanvas3);

	var attributes = {};


	var uniforms = {

	  tOne: { type: "t", value: this._diffusiveTexture2 },
	  tSec: { type: "t", value: this._diffusiveTexture1 },
	  tThi: { type: "t", value: this._diffusiveTexture },
	  aOne: { type: "t", value: this.texture1 },
	  aSec: { type: "t", value: this.texture2 },
	  aThi: { type: "t", value: this.texture3 },
	  nOrm: { type: "t", value: this.normalTexture1},
	  nOrm1: { type: "t", value: this.normalTexture2},
	  nOrm2: { type: "t", value: this.normalTexture3}

	};

	//uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], uniforms]);

	if(!this.wireDebug)
	{
		this._material = new THREE.ShaderMaterial({

                         	  uniforms: uniforms,

                         	  vertexShader: this.vertShader,

                         	  fragmentShader: this.fragShader,

                         	  transparent: true

                         	});
    }
    else
    {
    	this._material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
    }

	this._mesh = new THREE.Mesh(geometry, this._material);
	this._mesh.position.y = 0.01;
	this._mesh.position.x = 0;
	this._mesh.position.z = 0;
	this._mesh.rotation.x = THREE.Math.degToRad(-90);

	this.buildMap(geometry, this._detail);
	//this._mesh.rotation.z = THREE.Math.degToRad(-45);
	//this._mesh.receiveShadow = true;


	var pos1 = new THREE.Vector2();
	pos1.y = 32;
	this.getVertHeightAt(pos1);
};

LandLayer.prototype.buildMap = function(geometry, detail)
{
    this.map = [];
    this.graphMap = [];
    for(var i = 0; i < detail; i++)
    {
        this.map.push([]);
        this.graphMap.push([]);
        for(var j = 0; j < detail; j++)
        {
            var vertice = geometry.vertices[(detail*detail)-((j*detail)+i)];
            // var vertice = geometry.vertices[(j*detail)+i];
            this.graphMap[i].push(0);
            var tileObject = {vert:vertice, walkable:false, x:i, y:j};
            this.map[i].push(tileObject);
        }
    }
    this.graph = new Graph(this.graphMap, {diagonal:true});
    //console.debug('the graph map was >', this.graphMap);
    //console.debug('the graph was >', this.graph);
    //console.debug('map is ', this.map);
};

LandLayer.prototype.updateTexture = function(image)
{
	var texture = new THREE.Texture( image );
	texture.needsUpdate = true;
	return texture;
};

LandLayer.prototype.getMesh = function()
{
	return this._mesh;
};

LandLayer.prototype.modifyTexture = function(layer)
{
	if(layer === 0)
	{
		this.texture1 = this.updateTexture(this.drawAlphas(this._alphaPositions, layer));
	}
	if(layer === 1)
    	{
    		this.texture2 = this.updateTexture(this.drawAlphas(this._alphaPositions, layer));
    	}
    	if(layer === 2)
        	{
        		this.texture3 = this.updateTexture(this.drawAlphas(this._alphaPositions, layer));
        	}
	var attributes = {};


    	var uniforms = {

    	  tOne: { type: "t", value: this._diffusiveTexture2 },
          	  tSec: { type: "t", value: this._diffusiveTexture1 },
          	  tThi: { type: "t", value: this._diffusiveTexture },
          	  aOne: { type: "t", value: this.texture1 },
          	  aSec: { type: "t", value: this.texture2 },
          	  aThi: { type: "t", value: this.texture3 },
          	  nOrm: { type: "t", value: this.normalTexture1},
          	  nOrm1: { type: "t", value: this.normalTexture2},
          	  nOrm2: { type: "t", value: this.normalTexture3}

    	};

    	//uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], uniforms]);

	if(!this.wireDebug)
	{
    	this._material = new THREE.ShaderMaterial({

                             	  uniforms: uniforms,

                             	  vertexShader: this.vertShader,

                             	  fragmentShader: this.fragShader,

                             	  transparent: true

                             	});
		this._material.uniforms = uniforms;
		this._material.uniforms.needsUpdating = true;
		this._material.uniforms.aOne.needsUpdating = true;
		this._material.needsUpdating = true;

		this._mesh.material = this._material;
	}
	else
	{
		this._mesh.material = new THREE.MeshPhongMaterial( { color: 0x666666, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
	}

};

LandLayer.prototype.drawAlphas = function(alphaPositions, layer)
{
	var drawingCanvas = null;
    var drawingContext = null;
    switch(layer)
	{
			case 0:
			drawingCanvas = document.getElementById("canvas1");
			drawingContext = drawingCanvas.getContext('2d');
			break;
			case 1:
			drawingCanvas = document.getElementById("canvas2");
            drawingContext = drawingCanvas.getContext('2d');
			break;
			case 2:
			drawingCanvas = document.getElementById("canvas3");
            drawingContext = drawingCanvas.getContext('2d');
			break;
	}

	for(var i = 0; i < alphaPositions.length; i++)
    	{
    		var alphaPosObject = alphaPositions[i];
    		var texturePosX = alphaPosObject.x*this._textureSize;
    		var texturePosY = alphaPosObject.y*this._textureSize;
			var radius = this._textureSize / (15.8);
			drawingContext.beginPath();
			drawingContext.arc( texturePosX, texturePosY, radius, 0, 2 * Math.PI, false );
			var alpha = ""+0.075+"";
			var fillStyle = "rgba( 255, 255, 255,"+alpha+")";
			drawingContext.fillStyle = fillStyle;
			drawingContext.fill();
    	}
    	return drawingCanvas;
};

LandLayer.prototype.getAStarGraph = function()
{
    return this.graph;
};

LandLayer.prototype.getVertHeightAt = function(vector2)
{
	var vertices = this._mesh.geometry.vertices;
	return vertices[((vector2.y*(this._detail))+(vector2.x))-1].z;
}

LandLayer.prototype.getTile = function(x,y)
{
    if(this.map)
    {
        return this.map[x][y];
    }
}

LandLayer.prototype.raiseVerts = function(intersect, position, withAlpha, type)
{
	var vertices = this._mesh.geometry.vertices;
    	var x = intersect.uv.x;
    	var y = intersect.uv.y;

    	//console.debug('position at ', parseInt(this._detail*x), parseInt(this._detail*y));

    	var startX = parseInt(this._detail*x);
    	var startY = parseInt(this._detail*y);

    	for(var i = -2; i < 2; i++)
    	{
    		for(var j = -2; j < 2; j++)
    		{
    		/*
				var verticeNumber = (~~((x+(i*0.015))*this._detail)+(~~((1-(y+(j*0.015)))*this._detail)*this._detail));
				var vertice1 = vertices[verticeNumber];
				if(vertice1.z < 42)
				{
					vertice1.z += (0.08*(type+1));
				}
            */
				var c = this.map[this._detail-(startX+i)];
				if(c)
				{
					var tile = this.map[this._detail-(startX+i)][(startY+j)];
					if(tile)
					{
						if(this.graph)
						{
							this.graph.grid[tile.x][tile.y].weight = this.graph.grid[tile.x][tile.y].weight+type;
							if(this.graph.grid[tile.x][tile.y].weight == 0)
							{
								this.graph.grid[tile.x][tile.y].weight = 1;
							}
						}
						if(tile.vert.z < 25)
						{
							tile.vert.z += (0.45*(type+1));
						}
						if(tile.plant)
						{
							//tile.plant._sprite3D.position.y = tile.vert.z+4;
							var tween = new TWEEN.Tween(tile.plant._sprite3D.position).to({y:tile.vert.z+4}, 1000).start();
						}
						if(type === 1 && !tile.plant && tile.vert.z > 1.5)
						{
							var plant = null;
							if(tile.type !== 2)
							{
								plant = new PlantObject('plants', parseInt(Math.random()*6));
							}
							else
							{
								plant = new PlantObject('plants2', parseInt(Math.random()*6));
							}
							plant._sprite3D.position.x = tile.vert.x;
							plant._sprite3D.position.z = -(tile.vert.y);
							plant._sprite3D.position.y = -4;
							plant._sprite3D.material.rotation = THREE.Math.degToRad(-22.5+(Math.random()*45));
							plant._sprite3D.scale.x = plant._sprite3D.scale.y = plant._sprite3D.scale.z = 0;
							var tween = new TWEEN.Tween(plant._sprite3D.position).to({y:tile.vert.z+2.5}, 1000).start();
							var tween = new TWEEN.Tween(plant._sprite3D.scale).to({y:6, x:6, z:6}, 1800).start();
							//console.debug(this._mesh);
							this._mesh.parent.add(plant._sprite3D);
							plant._sprite3D.parent = this._mesh.parent;
							tile.plant = plant;
						}
						if(type === 2 && tile.plant)
						{
							var rand = parseInt(Math.random()*4);
							if(rand !== 0)
							{
								tile.plant.setTextureName('plants2');
								tile.plant._sprite3D.position.x = tile.vert.x;
								tile.plant._sprite3D.position.z = -(tile.vert.y);
								tile.plant._sprite3D.position.y = -4;
								tile.plant._sprite3D.material.rotation = THREE.Math.degToRad(-22.5+(Math.random()*45));
								tile.plant._sprite3D.scale.x = tile.plant._sprite3D.scale.y = tile.plant._sprite3D.scale.z = 0;
								var tween = new TWEEN.Tween(tile.plant._sprite3D.position).to({y:tile.vert.z+2.5}, 1000).start();
								var tween = new TWEEN.Tween(tile.plant._sprite3D.scale).to({y:6, x:6, z:6}, 1800).start();
								this._mesh.parent.add(tile.plant._sprite3D);
								console.debug('should have changed plant!')
							}
							else
							{
								if(tile.type !== 2)
								{
									this._mesh.parent.remove(tile.plant._sprite3D);
									tile.plant = null;
								}
							}
						}
						if(tile.type !== 2)
						{
							tile.type = type;
						}
						tile.walkable = true;
					}
				}
			}
    	}

    	this._mesh.geometry.verticesNeedUpdate = true;
    	this._mesh.geometry.needsUpdating = true;
    	var x1 = x;
    	var y1 = y;

		if(withAlpha)
		{
			for(var i = -2; i < 2; i++)
			{
				for(var j = -2; j < 2; j++)
				{
					var alphaObject = {x:x1+(i*0.005), y:1-(y1+(j*0.005))};
					this._alphaPositions.push(alphaObject);
				}
			}
    	}
};

LandLayer.prototype.clearAlphaPositions = function()
{
	this._alphaPositions = [];
};

LandLayer.prototype.getLayerNumber = function()
{
	return this._layerNumber;
};