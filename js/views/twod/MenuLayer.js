/**
/   android
/   www.js
/   Rhys
/   01/02/2016
/
*/
// I like this pattern..


// class
/**
* GameLayer
* param domElement
* param string
*/
function MenuLayer(containerElement, layerName, descriptor, buttonManager) {
  this._containerElement = containerElement;
  this._layerName = layerName;
  this._descriptor = descriptor;
  this._buttonManager = buttonManager;
  this.buildMenu();
}

MenuLayer.prototype.buildMenu = function()
{
	var menu = document.createElement("div");
	menu.style.pointerEvents = 'none';
	switch(this._descriptor.type)
	{
		case 'vStackedMenu':
			menu.style.margin = 'auto';
			break;
		case 'hControlsBottomAligned':
			break;
			//menu.style.width = '80%';
			//menu.style.height = '100%'
	}
	console.debug(this._descriptor.contents);
	for(var i = 0; i < this._descriptor.contents.length; i++)
	{
		var item = document.createElement("div");
		item.className += this._descriptor.contents[i].class;
		item.style.display = 'inherit';
		item.style.margin = 'auto';
		item.style.marginTop = '20px';
		menu.appendChild(item);
		menu.width = '100%';
		menu.style.width = '100%';
		switch(this._descriptor.contents[i].type)
		{
			case 'image':
				item.style.display = 'inherit';
				item.style.marginTop = '0px';
				break;
			case 'button':
				item.style.setProperty ("pointer-events", "all", "important");
				item.style.setProperty ("position", "absolute");
				item.style.setProperty ("z-index", "2");
				item.innerText = this._descriptor.contents[i].text;
				item.dataset.type = 'button';
				item.dataset.context = this._descriptor.contents[i].context;
				item.dataset.value = this._descriptor.contents[i].value;
				var button = {element:item, callBack:this._descriptor.contents[i].callback};
				this._buttonManager.addTapButton(button);
				break;
			case 'objectList':
                item.style.setProperty ("pointer-events", "all", "important");
                item.style.setProperty ("position", "absolute");
                item.style.setProperty ("z-index", "2");
                var list = document.createElement("ul");
                list.className += "villagerList";
                for(var j = 0; j < 20; j++)
                {
                	var li = document.createElement("li");
                	li.innerHTML = "object";
                	list.appendChild(li);
                }
                item.appendChild(list);
                item.dataset.type = 'objectList';
                item.dataset.context = this._descriptor.contents[i].context;
                item.dataset.value = this._descriptor.contents[i].value;
                //var button = {element:item, callBack:this._descriptor.contents[i].callback};
                //this._buttonManager.addTapButton(button);
            	break;
			case 'placeButton':
				item.style.setProperty("pointer-events", "all", "important");
				item.style.setProperty("position", "absolute");
				item.style.setProperty("bottom", "20px");
				item.style.setProperty("right", "20px");
            	//item.innerText = this._descriptor.contents[i].text;
            	item.dataset.type = 'button';
            	item.dataset.context = this._descriptor.contents[i].context;
            	item.dataset.value = this._descriptor.contents[i].value;
            	var button = {element:item, callBack:this._descriptor.contents[i].callback};
            	this._buttonManager.addTapButton(button);
				break;
			case 'menu':
				item.style.setProperty("pointer-events", "all", "important");
				item.style.setProperty("position", "absolute");
				item.style.setProperty("bottom", "1em");
                item.style.setProperty("right", "1em");
                item.style.setProperty("left", "1em");
                item.style.setProperty("top", "1em");
                item.style.setProperty("background", "#FFFFFF");
                item.style.setProperty("border-radius", "0.5em");
                item.style.setProperty("display", "initial");
                item.style.marginTop = '0px';
				break;
			case 'textContent':
				item.style.setProperty("pointer-events", "all", "important");
				item.style.setProperty("position", "absolute");
				item.style.setProperty("background", "transparent");
				item.style.setProperty("display", "initial");
				item.style.marginTop = '0px';
				item.innerText = this._descriptor.contents[i].contents;
				break;
			case 'controls':
				item.style.setProperty('pointer-events', 'all', 'important');
				var table = document.createElement('table');
				table.style.setProperty('border', '0px none #000000')
				table.style.setProperty('position', 'absolute');
				table.style.setProperty('bottom', '1em');
				table.style.setProperty('left', '1em');
				for(var j = 0; j < 3; j++)
				{
					var tr = document.createElement('tr');
                    table.appendChild(tr);
                    for(var k = 0; k < 3; k++)
                    {
                    	var td = document.createElement('td');
                    	tr.appendChild(td);
                    	if(k===1 && j === 0)
                    	{
                    		td.className = 'upButton';
                    		td.dataset.type = 'button';
                    		td.dataset.context = 'controls';
                    		td.dataset.value = 'up';
                    		var button = {element:td, callBack:this._descriptor.contents[i].callback};
                    		this._buttonManager.addTapButton(button);
                    	}
                    	if(k===1 && j === 2)
                        {
                        	td.className = 'downButton';
                        	td.dataset.type = 'button';
                            td.dataset.context = 'controls';
                            td.dataset.value = 'down';
                        	var button = {element:td, callBack:this._descriptor.contents[i].callback};
                                                		this._buttonManager.addTapButton(button);
                        }
                        if(k===0 && j === 1)
                        {
                        	td.className = 'leftButton';
                        	td.dataset.type = 'button';
                            td.dataset.context = 'controls';
                            td.dataset.value = 'left';
                        	var button = {element:td, callBack:this._descriptor.contents[i].callback};
                                                		this._buttonManager.addTapButton(button);
                        }
                        if(k===2 && j === 1)
                        {
                        	td.className = 'rightButton';
                        	td.dataset.type = 'button';
                            td.dataset.context = 'controls';
                            td.dataset.value = 'right';
                        	var button = {element:td, callBack:this._descriptor.contents[i].callback};
                                                		this._buttonManager.addTapButton(button);
                        }
                    	td.style.setProperty('width', '5em');
                    	td.style.setProperty('height', '5em');
                    }
				}
				item.appendChild(table);
				break;
		}
	}
	this._containerElement.style.display = "flex";
	this._containerElement.appendChild(menu);
}

MenuLayer.prototype.testCallBack = function()
{
	//console.debug("tested");
}

// class methods
MenuLayer.prototype.getIndex = function()
{
	return this._containerElement.style.zIndex;
}

MenuLayer.prototype.setIndex = function(index)
{
	this._containerElement.style.zIndex = index;
}

// class methods
MenuLayer.prototype.getDisplayObject = function()
{
	return this._containerElement;
}

// same as above, function as a method
MenuLayer.prototype.layerName = function()
{
	return this._layerName;
}