/**
/   android
/   www.js
/   Rhys
/   08/02/2016
/
*/
// I like this pattern..


// class
function SceneryBuilder() {
  this._assetFactory = ThreeAssetsFactory.getInstance();
  this._builtModels = {};
}

SceneryBuilder.prototype.getWaterPlane = function(width, depth, texture, renderer, camera, scene, lightPosition)
{
	var geometry = new THREE.PlaneGeometry(width,depth,1,1);
	//var geometry = new THREE.CircleGeometry( width, 16 );

	//console.debug('the plane >', geometry.vertices);

	var normals = ThreeAssetsFactory.getInstance().getTexture(texture)
	normals.wrapS = normals.wrapT = THREE.RepeatWrapping;

	var water = new THREE.Water(renderer, camera, scene, {
                            					textureWidth:256,
                            					textureHeight:256,
                            					waterNormals:normals,
                            					alpha:1,
                            					sunDirection:lightPosition.clone().normalize(),
                            					sunColor:0x22ffff,
                            					waterColor:0x3399ff,
                            					distortionScale:2,
                            					reflectivity:0.5,
                            					mirrorSampler:6,
                            					fog:true
	} );
	water.fog = true;

                        //var material = new THREE.MeshPhongMaterial( {color:0x000000, shininess:10, specular:0xffffff, ambient:0x000000, diffusive:0x000000} );
                        //console.debug('water is >>>', water.material)
                        water.material.fog = true;
	var mesh = new THREE.Mesh( geometry, water.material );
	mesh.add(water)
	mesh.rotation.x = THREE.Math.degToRad(-90);
	return mesh;
};

SceneryBuilder.prototype.getSkyBox = function(texture, horizonDistance)
{
	var env = ThreeAssetsFactory.getInstance().getTexture(texture);
    env.format = THREE.RGBFormat;

    var cubeShader = THREE.ShaderLib[ 'cube' ];
    cubeShader.uniforms[ 'tCube' ].value = env;

    var skyBoxMaterial = new THREE.ShaderMaterial( {
    	fragmentShader: cubeShader.fragmentShader,
    	vertexShader: cubeShader.vertexShader,
    	uniforms: cubeShader.uniforms,
    	depthWrite: false,
    	side: THREE.BackSide
    	} );

    var skyBox = new THREE.Mesh(
    	new THREE.BoxGeometry( horizonDistance, 500, horizonDistance ),
    	skyBoxMaterial
    );
    //skyBox.position.y += 5;

    return skyBox;
};