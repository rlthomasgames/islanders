/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
window['prompt'] = (value)=>{

	// suppress cordova prompt for now
}
var app = {
    // Application Constructor

    initialize: function() {
    	window.onload = function(){
    		console.debug(document);
			console.log('init called new')
			app.onDeviceReady();
    	};
		/*
		setTimeout(()=>{
			app.onDeviceReady();
			console.log('2.5 seconds waited??')
		}, 2500)

		 */
		console.debug(window);
    	document.addEventListener("deviceready", app.onDeviceReady, false);
    	this._controlTimeOuts = null;
    },

    onDeviceReady: function() {
            	console.debug('i get here :)')
		document.dispatchEvent(new Event('deviceready'))
                //console.log(window.Media);
                //TODO THREEJS ASSET LOADING !
    			//navigator.splashscreen.show();
    			this.threeDLayer = null;
				/*
    			sounds.load([
                  "sounds/letsgo.mp3",
                  "sounds/yipee.mp3"
                ]);

				 */
    			setTimeout(this.loadAssets.bind(this), 0);
    			doOnce = false;
    },

    loadAssets: function()
    {
		console.log('loading assets');
    	var factory = ThreeAssetsFactory.getInstance();
    	factory.reset(assetsConfig.length, this.loadedAssets.bind(this))
    	for(var i = 0; i < assetsConfig.length; i++)
        {
        		var assetConfig = assetsConfig[i];

        		if(assetConfig.type === "TEXTURE")
        		{
        			factory.loadTexture(assetConfig);
        		}
        		else if(assetConfig.type === "TEXTURECUBE")
        		{
        			factory.loadTextureCube(assetConfig);
        		}
        		else if(assetConfig.type === "TEXTURECUBEFULL")
                {
                    factory.loadTextureCubeFull(assetConfig);
                }
        		else if(assetConfig.type === "MODEL")
        		{
        			factory.loadModel(assetConfig);
        		}
        		else if(assetConfig.type === "COLLADA")
                {
                	factory.loadColladaModel(assetConfig);
                }

        		console.debug(assetConfig);
        }
    },

    loadedAssets: function ()
    {
    	var canvasContainer = document.getElementById("canvasContainer");
        this.layerManager = new LayerManager(canvasContainer);
        this.buttonManager = new ButtonManager();
        //navigator.splashscreen.hide();

        //this.createMainMenu();
		//this.startGame('none', true);

        window.event.preventDefault();
        //window.plugins.insomnia.keepAwake();

		/*
        console.debug('cordova', cordova.file.dataDirectory);
        console.debug(window.plugins);

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
			console.log("got main dir",dir);
			dir.getFile("log.txt", {create:true}, function(file) {
				console.log("got the file", file);
				logOb = file;
				writeLog("App started");
			});
		});

		 */

		// ------------- temp new 2023
		if(!doOnce) {
			this.createThreeDLayer();
			this.createGameControls();
		}
    },

    createThreeDLayer: function()
    {
		if(!doOnce)
		{
			var threeDElement = document.createElement("div");
			var threeDLayer = new MainScene(threeDElement, 'threeDLayer', 5, this.createMenu, this.layerManager);
			this.threeDLayer = threeDLayer;
			this.layerManager.addLayer(threeDLayer);
			threeDLayer.init();
			doOnce = true;
        }
    },

    startGame: function(button, released)
    {
    	console.debug('button - ', button, released);
    	if(released)
    	{
			console.debug('startGame');
			var mainMenu = this.layerManager.getLayerByName('mainMenu').getDisplayObject();
			mainMenu.style.display = 'none';
			this.createThreeDLayer();
			this.createGameControls();
			// navigator.vibrate([100, 100, 100, 100, 600]);
    	}
    },

    controlPressed: function(control, released)
    {
    	console.debug('control pressed', control);
    	if(!released)
    	{
			if(control === 'place')
			{
				this.threeDLayer.setMechanicProperty('placingPressed',true);
				this.threeDLayer.setMechanicProperty('placing',true);
				this.threeDLayer.left = false;
				this.threeDLayer.right = false;
				this.threeDLayer.up = false;
				this.threeDLayer.down = false;
			}
			if(control === 'left')
			{
				this.threeDLayer.left = true;
				this.threeDLayer.right = false;
				this.threeDLayer.up = false;
				this.threeDLayer.down = false;
			}
			if(control === 'right')
			{
				this.threeDLayer.right = true;
				this.threeDLayer.left = false;
				this.threeDLayer.up = false;
				this.threeDLayer.down = false;
			}
			if(control === 'up')
			{
				this.threeDLayer.up = true;
				this.threeDLayer.down = false;
				this.threeDLayer.right = false;
				this.threeDLayer.left = false;
			}
			if(control === 'down')
			{
				this.threeDLayer.down = true;
				this.threeDLayer.up = false;
				this.threeDLayer.right = false;
				this.threeDLayer.left = false;
			}
			if(this._controlTimeOuts)
			{
				clearTimeout(this._controlTimeOuts);
				this._controlTimeOuts = null;
			}
			this._controlTimeOuts = setTimeout(function(){
				var proposedDir = null;
				if(this.threeDLayer.down)
				{
					proposedDir = 'down';
				}
				else if(this.threeDLayer.up)
				{
					proposedDir = 'up';
				}
				else if(this.threeDLayer.left)
				{
					proposedDir = 'left';
				}
				else if(this.threeDLayer.right)
				{
					proposedDir = 'right';
				}
				else
				{
					proposedDir = 'none';
				}
				this.threeDLayer.down = false;
				this.threeDLayer.up = false;
				this.threeDLayer.right = false;
				this.threeDLayer.left = false;
				if(proposedDir !== 'none')
				{
					this.threeDLayer[proposedDir] = true;
				}
			}.bind(this), 1030);
        }
        if(released)
        {
        	if(this._controlTimeOuts)
			{
				clearTimeout(this._controlTimeOuts);
				this._controlTimeOuts = null;
			}
        	this.threeDLayer.down = false;
			this.threeDLayer.up = false;
			this.threeDLayer.right = false;
			this.threeDLayer.left = false;
        }
    },

    createMainMenu: function()
    {
    	var menuDesciptor = {
    		type:'vStackedMenu',
    		contents:[
    				{type:'image',class:'logoMenu'},
    				{type:'button',text:'START',context:'mainMenu',value:'start',class:'btn',callback:()=>{
						console.log('start called here!!')
						this.startGame.bind(this)}},
    				{type:'button',text:'OPTIONS',context:'mainMenu',value:'options',class:'btn',callback:this.startGame.bind(this)},
                    {type:'button',text:'MULTIPLAYER',context:'mainMenu',value:'multiplayer',class:'btn',callback:this.startGame.bind(this)}
    			]};
    	var mainMenuElement = document.createElement("div");
        mainMenuElement.style.background = "transparent";
        mainMenuElement.style.pointerEvents = 'none';
		/*
        var mainMenu = new MenuLayer(mainMenuElement, 'mainMenu', menuDesciptor, this.buttonManager);
        this.layerManager.addLayer(mainMenu);

		 */
        // navigator.vibrate(1000);
    },

    createGameControls: function()
    {
    	var controlsDescriptor = {
    		type:'hControlsBottomAligned',
    		contents:[
    		{type:'controls', context:'inGame',callback:this.controlPressed.bind(this)},
    		{type:'placeButton',text:'', context:'inGame',value:'place',class:'placeButton', callback:this.controlPressed.bind(this)},
    		{type:'button', context:'inGame', text:'', value:'islandButton', class:'islandButton', callback:this.createIslandMenu.bind(this)}
    		]
    	};
    	var controlsElement = document.createElement('div');
    	/*
    	controlsElement.addEventListener("click",
    		function(e) {
                var xPosition = e.clientX;
                var yPosition = e.clientY;
                console.debug('yeah?', xPosition, yPosition);
            }, false);
        */
    	controlsElement.style.background = "transparent";
    	controlsElement.style.pointerEvents = 'none';
    	var controlsMenu = new MenuLayer(controlsElement, 'controlsMenu', controlsDescriptor, this.buttonManager);
    	this.layerManager.addLayer(controlsMenu);
    },

    createIslandMenu: function()
    {
    	console.debug('executed');
    	var menuDesciptor = {
			type:'hControlsBottomAligned',
			contents:[
					{type:'menu',class:'islandMenu'},
					//{type:'image',class:'newYoshi'},
					//{type:'textContent',class:'newYoshiText', contents:'Congratulations!\n You received a new villager!'},
					{type:'button',text:'CONTINUE',context:'islandMenu',value:'start',class:'btn_islander_1',callback:()=>{
						console.log('trying to destroy menu layer')
						this.layerManager.destroyLayer.bind(this.layerManager, 'islandMenu')}},
					{type:'objectList',context:'islandMenu',value:'start',class:'list'}
				]};
		var mainMenuElement = document.createElement("div");
		mainMenuElement.style.background = "transparent";
		mainMenuElement.style.pointerEvents = 'none';
		var islandMenu = new MenuLayer(mainMenuElement, 'islandMenu', menuDesciptor, this.buttonManager);
		this.layerManager.addLayer(islandMenu);
		// navigator.vibrate(1000);
    },

    createMenu:	function(name)
    {
    	switch(name)
    	{
    		case 'islandMenu':
    			console.debug('executed1');
    			app.createIslandMenu();
    			break;
    	}
    }
};

app.initialize();